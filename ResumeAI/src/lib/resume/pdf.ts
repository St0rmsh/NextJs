import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFFont,
  PDFPage,
  PDFName,
  PDFArray,
  PDFString,
} from "pdf-lib";

import { ResumeData } from "@/types/resume";
import { groupSkills } from "@/lib/resume/skillCategories";

/* =====================================================
   PROFESSIONAL RESUME PDF EXPORTER
   ===================================================== */

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const BASE_MARGIN = 48;

const TOP_MARGIN = 46;
const BOTTOM_MARGIN = 44;

const MIN_SCALE = 0.88;
const SCALE_STEP = 0.02;

/* =====================================================
   COLORS
   ===================================================== */

const COLOR = {
  text: rgb(0.12, 0.13, 0.14),
  heading: rgb(0.03, 0.34, 0.29),
  headingDark: rgb(0.04, 0.27, 0.24),
  muted: rgb(0.42, 0.44, 0.45),
  lightMuted: rgb(0.58, 0.59, 0.6),
  rule: rgb(0.82, 0.83, 0.83),
  link: rgb(0.02, 0.36, 0.32),
  bullet: rgb(0.25, 0.26, 0.27),
};

/* =====================================================
   INTERNAL TYPES
   ===================================================== */

interface Cursor {
  page: PDFPage;
  y: number;
}

interface ContactItem {
  text: string;
  url?: string;
}

/* =====================================================
   URL NORMALIZATION
   ===================================================== */

/**
 * Converts user-entered URL values into a valid URL.
 *
 * Handles:
 * - https://example.com
 * - http://example.com
 * - www.example.com
 * - example.com
 * - https//example.com
 * - http//example.com
 * - //example.com
 * - Markdown links: [Example](https://example.com)
 * - Markdown links with malformed spacing
 * - surrounding quotes/brackets
 * - %20 artifacts
 *
 * Returns an empty string when the URL cannot be validated.
 */
function normalizeUrl(value: string): string {
  if (!value) {
    return "";
  }

  let url = String(value).trim();

  if (!url) {
    return "";
  }

  /* ---------------------------------------------------
     Remove common encoded whitespace artifacts
     --------------------------------------------------- */

  url = url.replace(/%20/gi, " ");

  /* ---------------------------------------------------
     Decode simple surrounding URL encoding
     --------------------------------------------------- */

  try {
    url = decodeURIComponent(url);
  } catch {
    // Keep original value if it is not valid URI encoding.
  }

  url = url.trim();

  /* ---------------------------------------------------
     Extract URL from Markdown format
     
     [Zentro](https://zentro-pwp3.onrender.com)
     --------------------------------------------------- */

  const markdownMatch = url.match(
    /\[[^\]]*\]\(\s*(https?:\/\/[^)\s]+)\s*\)/i
  );

  if (markdownMatch?.[1]) {
    url = markdownMatch[1];
  }

  /* ---------------------------------------------------
     Handle malformed Markdown-like values.

     Example:
     ["%20https](https://"%20https//zentro-pwp3.onrender.com)

     Try to locate the actual URL portion.
     --------------------------------------------------- */

  if (
    url.includes("](") ||
    url.includes("](https") ||
    url.includes("](")
  ) {
    const embeddedUrl = url.match(
      /(https?:\/\/[^\s)\]"']+)/i
    );

    if (embeddedUrl?.[1]) {
      url = embeddedUrl[1];
    }
  }

  /* ---------------------------------------------------
     If multiple URL-like pieces exist, prefer the
     first actual HTTP/HTTPS URL.
     --------------------------------------------------- */

  const explicitProtocolMatch = url.match(
    /(https?:\/\/[^\s)\]"'<>]+)/i
  );

  if (explicitProtocolMatch?.[1]) {
    url = explicitProtocolMatch[1];
  }

  /* ---------------------------------------------------
     Remove surrounding characters
     --------------------------------------------------- */

  url = url
    .trim()
    .replace(/^[\s"'`<\[\]()]+/, "")
    .replace(/[\s"'`>\[\]()]+$/, "")
    .trim();

  /* ---------------------------------------------------
     Remove accidental encoded whitespace again
     --------------------------------------------------- */

  url = url.replace(/%20/gi, "");

  /* ---------------------------------------------------
     Fix malformed protocol:
     
     https//example.com
     http//example.com
     --------------------------------------------------- */

  if (/^https\/\//i.test(url)) {
    url = `https://${url.slice("https//".length)}`;
  }

  if (/^http\/\//i.test(url)) {
    url = `http://${url.slice("http//".length)}`;
  }

  /* ---------------------------------------------------
     Fix protocol with accidental spaces:
     
     https: //example.com
     https ://example.com
     --------------------------------------------------- */

  url = url.replace(
    /^https?\s*:\s*\/\//i,
    (match) =>
      match.toLowerCase().startsWith("https")
        ? "https://"
        : "http://"
  );

  /* ---------------------------------------------------
     Handle protocol-relative URLs:
     
     //example.com
     --------------------------------------------------- */

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  /* ---------------------------------------------------
     Handle www.example.com
     --------------------------------------------------- */

  if (/^www\./i.test(url)) {
    url = `https://${url}`;
  }

  /* ---------------------------------------------------
     Add HTTPS to bare domains
     
     zentro-pwp3.onrender.com
     github.com/St0rmsh/Zentro
     --------------------------------------------------- */

  if (
    !/^https?:\/\//i.test(url) &&
    !/^mailto:/i.test(url) &&
    !/^tel:/i.test(url)
  ) {
    url = `https://${url}`;
  }

  url = url.trim();

  /* ---------------------------------------------------
     Validate the final URL
     --------------------------------------------------- */

  try {
    if (
      /^mailto:/i.test(url) ||
      /^tel:/i.test(url)
    ) {
      return url;
    }

    const parsed = new URL(url);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return "";
    }

    if (!parsed.hostname) {
      return "";
    }

    return parsed.toString();
  } catch {
    return "";
  }
}

/* =====================================================
   MAIN RENDERER
   ===================================================== */

async function renderResumeAtScale(
  data: ResumeData,
  scale: number
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();

  /* ===================================================
     DOCUMENT METADATA
     =================================================== */

  const fullName =
    data.personalInfo.fullName?.trim() ||
    "Resume";

  pdfDoc.setTitle(fullName);
  pdfDoc.setAuthor(fullName);
  pdfDoc.setSubject("Professional Resume");
  pdfDoc.setProducer("Resume AI Builder");

  /* ===================================================
     FONTS
     =================================================== */

  const font = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );

  const fontBold = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );

  const fontItalic = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique
  );

  /* ===================================================
     SCALE
     =================================================== */

  const S = (value: number) => value * scale;

  const margin = Math.max(
    42,
    BASE_MARGIN - (1 - scale) * 20
  );

  const contentWidth =
    PAGE_WIDTH - margin * 2;

  /* ===================================================
     CURSOR
     =================================================== */

  const cursor: Cursor = {
    page: pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]),
    y: PAGE_HEIGHT - S(TOP_MARGIN),
  };

  /* ===================================================
     PAGE HELPERS
     =================================================== */

  function createPage() {
    cursor.page = pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

    cursor.y =
      PAGE_HEIGHT - S(TOP_MARGIN);
  }

  function ensureSpace(requiredHeight: number) {
    if (
      cursor.y - requiredHeight <
      S(BOTTOM_MARGIN)
    ) {
      createPage();
    }
  }

  /* ===================================================
     TEXT WIDTH
     =================================================== */

  function widthOf(
    text: string,
    useFont: PDFFont,
    size: number,
    characterSpacing = 0
  ) {
    const base =
      useFont.widthOfTextAtSize(
        text,
        size
      );

    if (!characterSpacing) {
      return base;
    }

    return (
      base +
      Math.max(0, text.length - 1) *
        characterSpacing
    );
  }

  /* ===================================================
     WRAP TEXT
     =================================================== */

  function wrapText(
    text: string,
    maxWidth: number,
    useFont: PDFFont,
    size: number,
    characterSpacing = 0
  ): string[] {
    const cleaned = text
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned) {
      return [];
    }

    const words = cleaned.split(" ");
    const lines: string[] = [];

    let current = "";

    for (const word of words) {
      const candidate = current
        ? `${current} ${word}`
        : word;

      if (
        widthOf(
          candidate,
          useFont,
          size,
          characterSpacing
        ) <= maxWidth
      ) {
        current = candidate;
        continue;
      }

      if (current) {
        lines.push(current);
      }

      if (
        widthOf(
          word,
          useFont,
          size,
          characterSpacing
        ) > maxWidth
      ) {
        let chunk = "";

        for (const char of word) {
          const test = chunk + char;

          if (
            widthOf(
              test,
              useFont,
              size,
              characterSpacing
            ) <= maxWidth
          ) {
            chunk = test;
          } else {
            if (chunk) {
              lines.push(chunk);
            }

            chunk = char;
          }
        }

        current = chunk;
      } else {
        current = word;
      }
    }

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  /* ===================================================
     DRAW SIMPLE TEXT
     =================================================== */

  function drawText(
    text: string,
    x: number,
    size: number,
    useFont: PDFFont = font,
    color = COLOR.text,
    options?: {
      characterSpacing?: number;
      lineHeight?: number;
      after?: number;
    }
  ) {
    const characterSpacing =
      options?.characterSpacing ?? 0;

    const lineHeight =
      options?.lineHeight ??
      size * 1.25;

    const after =
      options?.after ?? 0;

    ensureSpace(
      lineHeight + S(after)
    );

    cursor.page.drawText(text, {
      x,
      y: cursor.y,
      size,
      font: useFont,
      color,
      characterSpacing,
    });

    cursor.y -=
      lineHeight + S(after);
  }

  /* ===================================================
     DRAW WRAPPED PARAGRAPH
     =================================================== */

  function drawParagraph(
    text: string,
    x: number,
    size: number,
    useFont: PDFFont = font,
    maxWidth = contentWidth,
    color = COLOR.text,
    options?: {
      lineHeight?: number;
      after?: number;
      characterSpacing?: number;
    }
  ) {
    const lineHeight =
      options?.lineHeight ??
      size * 1.35;

    const after =
      options?.after ?? 6;

    const characterSpacing =
      options?.characterSpacing ?? 0;

    const lines = wrapText(
      text,
      maxWidth,
      useFont,
      size,
      characterSpacing
    );

    for (const line of lines) {
      ensureSpace(lineHeight);

      cursor.page.drawText(line, {
        x,
        y: cursor.y,
        size,
        font: useFont,
        color,
        characterSpacing,
      });

      cursor.y -= lineHeight;
    }

    cursor.y -= S(after);
  }

  /* ===================================================
     BULLET
     =================================================== */

  function drawBullet(
    text: string,
    x: number,
    size: number
  ) {
    const bulletRadius = S(1.7);

    const textX = x + S(12);

    const maxWidth =
      PAGE_WIDTH -
      margin -
      textX;

    const lineHeight =
      size * 1.32;

    const lines = wrapText(
      text,
      maxWidth,
      font,
      size
    );

    if (!lines.length) {
      return;
    }

    ensureSpace(
      lines.length * lineHeight +
        S(3)
    );

    for (
      let index = 0;
      index < lines.length;
      index++
    ) {
      if (index === 0) {
        cursor.page.drawCircle({
          x: x + S(3),
          y:
            cursor.y +
            size * 0.28,
          size: bulletRadius,
          color: COLOR.bullet,
        });
      }

      cursor.page.drawText(
        lines[index],
        {
          x: textX,
          y: cursor.y,
          size,
          font,
          color: COLOR.text,
        }
      );

      cursor.y -= lineHeight;
    }

    cursor.y -= S(3);
  }

  /* ===================================================
     LINK ANNOTATION
     =================================================== */

  function attachLinkAnnotation(
    page: PDFPage,
    rect: [
      number,
      number,
      number,
      number
    ],
    url: string
  ) {
    const normalized =
      normalizeUrl(url);

    if (!normalized) {
      return;
    }

    const annotation =
      pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: rect,
          Border: [0, 0, 0],
          A: {
            Type: "Action",
            S: "URI",
            URI: PDFString.of(
              normalized
            ),
          },
        })
      );

    const annots =
      page.node.lookup(
        PDFName.of("Annots"),
        PDFArray
      );

    if (annots) {
      annots.push(annotation);
    } else {
      page.node.set(
        PDFName.of("Annots"),
        pdfDoc.context.obj([
          annotation,
        ])
      );
    }
  }

  /* ===================================================
     DRAW LINK
     =================================================== */

  function drawLink(
    text: string,
    url: string,
    x: number,
    y: number,
    size: number,
    useFont: PDFFont = font
  ): number {
    const normalizedUrl =
      normalizeUrl(url);

    if (!normalizedUrl) {
      return 0;
    }

    const textWidth = widthOf(
      text,
      useFont,
      size
    );

    cursor.page.drawText(text, {
      x,
      y,
      size,
      font: useFont,
      color: COLOR.link,
    });

    cursor.page.drawLine({
      start: {
        x,
        y: y - S(1.4),
      },
      end: {
        x: x + textWidth,
        y: y - S(1.4),
      },
      thickness: S(0.45),
      color: COLOR.link,
    });

    attachLinkAnnotation(
      cursor.page,
      [
        x,
        y - S(2),
        x + textWidth,
        y + size + S(2),
      ],
      normalizedUrl
    );

    return textWidth;
  }

  /* ===================================================
     HORIZONTAL RULE
     =================================================== */

  function drawRule(
    y: number,
    thickness = 0.6,
    color = COLOR.rule
  ) {
    cursor.page.drawLine({
      start: {
        x: margin,
        y,
      },
      end: {
        x:
          PAGE_WIDTH -
          margin,
        y,
      },
      thickness: S(thickness),
      color,
    });
  }

  /* ===================================================
     SECTION HEADER
     =================================================== */

  function drawSectionHeading(
    sectionTitle: string
  ) {
    cursor.y -= S(9);

    ensureSpace(S(28));

    const size = S(10.5);

    const upperTitle =
      sectionTitle.toUpperCase();

    cursor.page.drawText(
      upperTitle,
      {
        x: margin,
        y: cursor.y,
        size,
        font: fontBold,
        color:
          COLOR.headingDark,
        characterSpacing:
          S(0.55),
      }
    );

    const titleWidth = widthOf(
      upperTitle,
      fontBold,
      size,
      S(0.55)
    );

    drawRule(
      cursor.y + S(3),
      0.55
    );

    cursor.page.drawRectangle({
      x: margin - S(2),
      y:
        cursor.y -
        S(2),
      width:
        titleWidth +
        S(18),
      height: S(7),
      color: rgb(1, 1, 1),
    });

    cursor.page.drawText(
      upperTitle,
      {
        x: margin,
        y: cursor.y,
        size,
        font: fontBold,
        color:
          COLOR.headingDark,
        characterSpacing:
          S(0.55),
      }
    );

    cursor.page.drawRectangle({
      x: margin,
      y:
        cursor.y -
        S(3),
      width: S(26),
      height: S(1.5),
      color: COLOR.heading,
    });

    cursor.y -= S(19);
  }

  /* ===================================================
     PERSONAL INFORMATION
     =================================================== */

  const {
    personalInfo,
  } = data;

  const name =
    personalInfo.fullName?.trim() ||
    "Your Name";

  const title =
    personalInfo.title?.trim() ||
    "";

  /* ===================================================
     CENTERED HEADER
     =================================================== */

  ensureSpace(S(90));

  const nameSize = S(24);

  const nameWidth = widthOf(
    name,
    fontBold,
    nameSize,
    S(0.1)
  );

  const nameX =
    (PAGE_WIDTH - nameWidth) /
    2;

  cursor.page.drawText(name, {
    x: nameX,
    y: cursor.y,
    size: nameSize,
    font: fontBold,
    color: COLOR.text,
    characterSpacing: S(0.1),
  });

  cursor.y -= S(29);

  /* ===================================================
     TITLE
     =================================================== */

  if (title) {
    const titleSize = S(10.5);

    const titleWidth = widthOf(
      title,
      fontItalic,
      titleSize,
      S(0.05)
    );

    const titleX =
      (PAGE_WIDTH - titleWidth) /
      2;

    cursor.page.drawText(
      title,
      {
        x: titleX,
        y: cursor.y,
        size: titleSize,
        font: fontItalic,
        color: COLOR.muted,
        characterSpacing:
          S(0.05),
      }
    );

    cursor.y -= S(16);
  }

  /* ===================================================
     CONTACT INFORMATION
     =================================================== */

  const contacts: ContactItem[] = [];

  if (personalInfo.email?.trim()) {
    contacts.push({
      text: personalInfo.email.trim(),
      url: `mailto:${personalInfo.email.trim()}`,
    });
  }

  if (personalInfo.phone?.trim()) {
    contacts.push({
      text: personalInfo.phone.trim(),
      url: `tel:${personalInfo.phone.trim()}`,
    });
  }

  if (personalInfo.location?.trim()) {
    contacts.push({
      text: personalInfo.location.trim(),
    });
  }

  /* ===================================================
     SOCIAL LINKS
     =================================================== */

  if (personalInfo.linkedin?.trim()) {
    const linkedin =
      normalizeUrl(
        personalInfo.linkedin.trim()
      );

    if (linkedin) {
      contacts.push({
        text: "LinkedIn",
        url: linkedin,
      });
    }
  }

  if (personalInfo.github?.trim()) {
    const github =
      normalizeUrl(
        personalInfo.github.trim()
      );

    if (github) {
      contacts.push({
        text: "GitHub",
        url: github,
      });
    }
  }

  if (personalInfo.portfolio?.trim()) {
    const portfolio =
      normalizeUrl(
        personalInfo.portfolio.trim()
      );

    if (portfolio) {
      contacts.push({
        text: "Portfolio",
        url: portfolio,
      });
    }
  }

  /* ===================================================
     CENTER CONTACTS
     =================================================== */

  if (contacts.length) {
    const contactSize = S(8.8);

    const separator =
      "   •   ";

    const separatorWidth =
      widthOf(
        separator,
        font,
        contactSize
      );

    const availableWidth =
      PAGE_WIDTH -
      margin * 2;

    const rows: ContactItem[][] =
      [];

    let currentRow: ContactItem[] =
      [];

    let currentWidth = 0;

    for (const item of contacts) {
      const itemWidth =
        widthOf(
          item.text,
          font,
          contactSize
        );

      const additionalWidth =
        currentRow.length > 0
          ? separatorWidth +
            itemWidth
          : itemWidth;

      if (
        currentRow.length > 0 &&
        currentWidth +
          additionalWidth >
          availableWidth
      ) {
        rows.push(
          currentRow
        );

        currentRow = [item];

        currentWidth =
          itemWidth;
      } else {
        currentRow.push(item);

        currentWidth +=
          additionalWidth;
      }
    }

    if (currentRow.length) {
      rows.push(
        currentRow
      );
    }

    for (const row of rows) {
      let rowWidth = 0;

      row.forEach(
        (item, index) => {
          rowWidth +=
            widthOf(
              item.text,
              font,
              contactSize
            );

          if (
            index <
            row.length - 1
          ) {
            rowWidth +=
              separatorWidth;
          }
        }
      );

      let x =
        (PAGE_WIDTH -
          rowWidth) /
        2;

      const lineY =
        cursor.y;

      row.forEach(
        (item, index) => {
          const itemWidth =
            widthOf(
              item.text,
              font,
              contactSize
            );

          if (item.url) {
            drawLink(
              item.text,
              item.url,
              x,
              lineY,
              contactSize
            );
          } else {
            cursor.page.drawText(
              item.text,
              {
                x,
                y: lineY,
                size:
                  contactSize,
                font,
                color:
                  COLOR.text,
              }
            );
          }

          x += itemWidth;

          if (
            index <
            row.length - 1
          ) {
            cursor.page.drawText(
              separator,
              {
                x,
                y: lineY,
                size:
                  contactSize,
                font,
                color:
                  COLOR.lightMuted,
              }
            );

            x +=
              separatorWidth;
          }
        }
      );

      cursor.y -= S(14);
    }

    cursor.y -= S(2);
  }

  /* ===================================================
     HEADER RULE
     =================================================== */

  drawRule(
    cursor.y,
    0.8,
    COLOR.heading
  );

  cursor.y -= S(11);

  /* ===================================================
     SUMMARY
     =================================================== */

  if (data.summary?.trim()) {
    drawSectionHeading("Summary");

    drawParagraph(
      data.summary.trim(),
      margin,
      S(9.5),
      font,
      contentWidth,
      COLOR.text,
      {
        lineHeight: S(13.2),
        after: 2,
        characterSpacing: S(0.02),
      }
    );
  }

  /* ===================================================
     SKILLS
     =================================================== */

  const rawSkills =
    (data.skills || [])
      .filter(
        (skill) =>
          typeof skill === "string" &&
          skill.trim()
      )
      .map(
        (skill) =>
          skill.trim()
      );

  const groupedSkills =
    groupSkills(rawSkills);

  if (groupedSkills.length) {
    drawSectionHeading("Skills");

    const labelWidth = S(88);

    const skillGap = S(9);

    const skillX =
      margin +
      labelWidth +
      skillGap;

    const skillWidth =
      PAGE_WIDTH -
      margin -
      skillX;

    const labelSize = S(8.5);

    const skillSize = S(9.1);

    const lineHeight = S(12.2);

    for (const group of groupedSkills) {
      const skillText =
        group.skills.join(
          "  •  "
        );

      const lines = wrapText(
        skillText,
        skillWidth,
        font,
        skillSize,
        S(0.01)
      );

      if (!lines.length) {
        continue;
      }

      ensureSpace(
        lines.length *
          lineHeight +
          S(4)
      );

      cursor.page.drawText(
        group.label.toUpperCase(),
        {
          x: margin,
          y: cursor.y,
          size: labelSize,
          font: fontBold,
          color: COLOR.muted,
          characterSpacing:
            S(0.35),
        }
      );

      for (
        let index = 0;
        index < lines.length;
        index++
      ) {
        cursor.page.drawText(
          lines[index],
          {
            x: skillX,
            y:
              cursor.y -
              index *
                lineHeight,
            size: skillSize,
            font,
            color:
              COLOR.text,
          }
        );
      }

      cursor.y -=
        lines.length *
        lineHeight;

      cursor.y -= S(3);
    }
  }

  /* ===================================================
     EXPERIENCE
     =================================================== */

  const experiences =
    (data.experience || [])
      .filter(
        (experience) =>
          experience.role?.trim() ||
          experience.company?.trim()
      );

  if (experiences.length) {
    drawSectionHeading(
      "Experience"
    );

    for (const experience of experiences) {
      const role =
        experience.role?.trim() ||
        "Role";

      const company =
        experience.company?.trim() ||
        "Company";

      const dates = [
        experience.startDate,
        experience.current
          ? "Present"
          : experience.endDate,
      ].filter(Boolean);

      const dateText =
        dates.join(" - ");

      ensureSpace(S(36));

      cursor.page.drawText(
        role,
        {
          x: margin,
          y: cursor.y,
          size: S(10.8),
          font: fontBold,
          color: COLOR.text,
        }
      );

      const roleWidth =
        widthOf(
          role,
          fontBold,
          S(10.8)
        );

      cursor.page.drawText(
        `  •  ${company}`,
        {
          x:
            margin +
            roleWidth,
          y: cursor.y,
          size: S(10.8),
          font,
          color:
            COLOR.muted,
        }
      );

      if (dateText) {
        const dateWidth =
          widthOf(
            dateText,
            fontItalic,
            S(8.5)
          );

        cursor.page.drawText(
          dateText,
          {
            x:
              PAGE_WIDTH -
              margin -
              dateWidth,
            y: cursor.y,
            size: S(8.5),
            font: fontItalic,
            color:
              COLOR.muted,
          }
        );
      }

      cursor.y -= S(15);

      for (
        const description of
          experience.description ||
          []
      ) {
        if (
          description?.trim()
        ) {
          drawBullet(
            description.trim(),
            margin,
            S(9.25)
          );
        }
      }

      cursor.y -= S(5);
    }
  }

  /* ===================================================
     PROJECTS
     =================================================== */

  const projects =
    (data.projects || [])
      .filter(
        (project) =>
          project.name?.trim()
      );

  if (projects.length) {
    drawSectionHeading(
      "Projects"
    );

    for (const project of projects) {
      const projectName =
        project.name.trim();

      /*
       * Normalize project URLs BEFORE
       * using them anywhere in the PDF.
       */
      const liveUrl =
        normalizeUrl(
          project.url || ""
        );

      const githubUrl =
        normalizeUrl(
          project.githubUrl || ""
        );

      ensureSpace(S(40));

      /* PROJECT TITLE */

      cursor.page.drawText(
        projectName,
        {
          x: margin,
          y: cursor.y,
          size: S(10.8),
          font: fontBold,
          color: COLOR.text,
        }
      );

      /* LINKS */

      let linkX =
        margin +
        widthOf(
          projectName,
          fontBold,
          S(10.8)
        ) +
        S(12);

      const linkSize = S(8.4);

      if (liveUrl) {
        const liveWidth =
          drawLink(
            "Live Demo",
            liveUrl,
            linkX,
            cursor.y,
            linkSize
          );

        linkX += liveWidth;
      }

      if (
        liveUrl &&
        githubUrl
      ) {
        const separator =
          "   •   ";

        cursor.page.drawText(
          separator,
          {
            x: linkX,
            y: cursor.y,
            size: linkSize,
            font,
            color:
              COLOR.lightMuted,
          }
        );

        linkX +=
          widthOf(
            separator,
            font,
            linkSize
          );
      }

      if (githubUrl) {
        drawLink(
          "GitHub",
          githubUrl,
          linkX,
          cursor.y,
          linkSize
        );
      }

      cursor.y -= S(14);

      /* TECH STACK */

      const technologies =
        (
          project.techStack ||
          []
        )
          .filter(
            (technology) =>
              technology?.trim()
          )
          .map(
            (technology) =>
              technology.trim()
          );

      if (technologies.length) {
        drawParagraph(
          technologies.join(
            "  •  "
          ),
          margin,
          S(8.2),
          fontItalic,
          contentWidth,
          COLOR.muted,
          {
            lineHeight:
              S(11.2),
            after: 5,
            characterSpacing:
              S(0.01),
          }
        );
      }

      /* DESCRIPTION */

      for (
        const description of
          project.description ||
          []
      ) {
        if (
          description?.trim()
        ) {
          drawBullet(
            description.trim(),
            margin,
            S(9.2)
          );
        }
      }

      cursor.y -= S(7);
    }
  }

  /* ===================================================
     EDUCATION
     =================================================== */

  const education =
    (data.education || [])
      .filter(
        (educationItem) =>
          educationItem.institution?.trim() ||
          educationItem.degree?.trim()
      );

  if (education.length) {
    drawSectionHeading(
      "Education"
    );

    for (
      const educationItem of
        education
    ) {
      const degree =
        educationItem.degree?.trim() ||
        "Degree";

      const field =
        educationItem.field?.trim()
          ? `, ${educationItem.field.trim()}`
          : "";

      const institution =
        educationItem.institution?.trim() ||
        "";

      const dates = [
        educationItem.startYear,
        educationItem.endYear,
      ]
        .filter(Boolean)
        .join(" - ");

      ensureSpace(S(35));

      cursor.page.drawText(
        `${degree}${field}`,
        {
          x: margin,
          y: cursor.y,
          size: S(10.2),
          font: fontBold,
          color: COLOR.text,
        }
      );

      cursor.y -= S(14);

      const secondLine = [
        institution,
        dates,
      ]
        .filter(Boolean)
        .join("  •  ");

      if (secondLine) {
        drawText(
          secondLine,
          margin,
          S(8.8),
          font,
          COLOR.muted,
          {
            lineHeight: S(12),
            after: 3,
          }
        );
      }

      if (
        educationItem.cgpa?.trim()
      ) {
        drawText(
          `CGPA: ${educationItem.cgpa.trim()}`,
          margin,
          S(8.7),
          font,
          COLOR.text,
          {
            lineHeight: S(12),
            after: 4,
          }
        );
      }

      cursor.y -= S(4);
    }
  }

  /* ===================================================
     CERTIFICATIONS
     =================================================== */

  const certifications =
    (data.certifications || [])
      .filter(
        (certification) =>
          certification.name?.trim()
      );

  if (certifications.length) {
    drawSectionHeading(
      "Certifications"
    );

    for (
      const certification of
        certifications
    ) {
      const parts = [
        certification.name,
        certification.organization,
        certification.issueDate,
      ].filter(
        (
          value
        ): value is string =>
          Boolean(
            value?.trim()
          )
      );

      if (!parts.length) {
        continue;
      }

      const label =
        parts.join(
          "  •  "
        );

      const url =
        normalizeUrl(
          certification.url || ""
        );

      if (!url) {
        drawBullet(
          label,
          margin,
          S(9.1)
        );

        continue;
      }

      const bulletX =
        margin + S(3);

      const textX =
        margin + S(12);

      const availableWidth =
        PAGE_WIDTH -
        margin -
        textX;

      const labelLines =
        wrapText(
          label,
          availableWidth -
            S(35),
          font,
          S(9.1)
        );

      if (!labelLines.length) {
        continue;
      }

      ensureSpace(
        labelLines.length *
          S(12)
      );

      for (
        let i = 0;
        i < labelLines.length;
        i++
      ) {
        if (i === 0) {
          cursor.page.drawCircle({
            x: bulletX,
            y:
              cursor.y +
              S(3),
            size: S(1.7),
            color:
              COLOR.bullet,
          });
        }

        cursor.page.drawText(
          labelLines[i],
          {
            x: textX,
            y: cursor.y,
            size: S(9.1),
            font,
            color:
              COLOR.text,
          }
        );

        cursor.y -= S(12);
      }

      cursor.y += S(12);

      const lastLine =
        labelLines[
          labelLines.length - 1
        ];

      const lastLineWidth =
        widthOf(
          lastLine,
          font,
          S(9.1)
        );

      drawLink(
        "(link)",
        url,
        textX +
          lastLineWidth +
          S(5),
        cursor.y,
        S(8.7)
      );

      cursor.y -= S(15);
    }
  }

  return pdfDoc;
}

/* =====================================================
   PUBLIC PDF GENERATOR
   ===================================================== */

export async function generateResumePDF(
  data: ResumeData
): Promise<Uint8Array> {
  const firstDocument =
    await renderResumeAtScale(
      data,
      1
    );

  if (
    firstDocument.getPageCount() ===
    1
  ) {
    return firstDocument.save();
  }

  let bestDocument =
    firstDocument;

  for (
    let scale =
      1 - SCALE_STEP;
    scale >=
    MIN_SCALE - 0.001;
    scale -= SCALE_STEP
  ) {
    const currentDocument =
      await renderResumeAtScale(
        data,
        Number(
          scale.toFixed(2)
        )
      );

    bestDocument =
      currentDocument;

    if (
      currentDocument.getPageCount() ===
      1
    ) {
      return currentDocument.save();
    }
  }

  return bestDocument.save();
}

/* =====================================================
   SAFE FILE NAME
   ===================================================== */

function safeFileName(
  data: ResumeData
): string {
  const name =
    data.personalInfo.fullName?.trim();

  if (!name) {
    return "resume";
  }

  const filename =
    name
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  return (
    filename ||
    "resume"
  );
}

/* =====================================================
   DOWNLOAD
   ===================================================== */

export async function downloadResumePDF(
  data: ResumeData
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    const pdfBytes =
      await generateResumePDF(
        data
      );

    const blob =
      new Blob(
        [pdfBytes],
        {
          type:
            "application/pdf",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `${safeFileName(
        data
      )}.pdf`;

    link.style.display =
      "none";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    window.setTimeout(
      () => {
        URL.revokeObjectURL(
          url
        );
      },
      1000
    );
  } catch (error) {
    console.error(
      "Failed to generate resume PDF:",
      error
    );

    throw error;
  }
}