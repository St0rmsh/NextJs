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

/* =====================================================
   Save this file as: src/lib/export/generateResumePdf.ts
   (next to your existing src/lib/export/resumeExport.ts)
   ===================================================== */

/* =====================================================
   LAYOUT CONSTANTS
   ===================================================== */

const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
// NOTE: MARGIN and CONTENT_WIDTH are now computed per-render inside
// renderResumeAtScale() below, since margins shrink along with the
// fit scale. They are intentionally not module-level constants.

const COLOR_TEXT = rgb(0.15, 0.15, 0.15);
const COLOR_HEADING = rgb(0, 0.4, 0.32);
const COLOR_LINK = rgb(0.02, 0.4, 0.32);
const COLOR_MUTED = rgb(0.45, 0.45, 0.45);
const COLOR_RULE = rgb(0.82, 0.82, 0.82);

// Auto-fit: render at decreasing scales until the resume fits on
// one page. MIN_SCALE is a readability floor — below this, text
// gets too small to be a good resume, so we stop shrinking and
// let it flow onto a second page instead of hurting legibility.
const MAX_SCALE = 1.0;
const MIN_SCALE = 0.62;
const SCALE_STEP = 0.02;

/* =====================================================
   INTERNAL STATE / CURSOR
   ===================================================== */

interface Cursor {
  page: PDFPage;
  y: number;
}

/* =====================================================
   CORE RENDERER — renders the full resume at a given scale
   onto a fresh document. Called repeatedly by
   generateResumePDF() at shrinking scales until it fits.
   ===================================================== */

async function renderResumeAtScale(
  data: ResumeData,
  scale: number
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();

  pdfDoc.setTitle(data.personalInfo.fullName?.trim() || "Resume");
  pdfDoc.setProducer("Resume AI Builder");

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Margins shrink along with text as the scale drops, reclaiming
  // real page space instead of only shrinking font sizes. Goes from
  // 50pt at full scale down to a 28pt floor at MIN_SCALE.
  const MARGIN_MAX = 50;
  const MARGIN_MIN = 28;
  const marginT = Math.min(
    1,
    Math.max(0, (MAX_SCALE - scale) / (MAX_SCALE - MIN_SCALE))
  );
  const MARGIN = MARGIN_MAX - marginT * (MARGIN_MAX - MARGIN_MIN);
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  const cursor: Cursor = {
    page: pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    y: PAGE_HEIGHT - MARGIN,
  };

  // Scales any size/spacing value by the current fit scale.
  const S = (v: number) => v * scale;

  /* ---------------------------------------------------
     Low-level helpers
     --------------------------------------------------- */

  function newPageIfNeeded(spaceNeeded: number) {
    if (cursor.y - spaceNeeded < MARGIN) {
      cursor.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursor.y = PAGE_HEIGHT - MARGIN;
    }
  }

  function wrapText(
    text: string,
    maxWidth: number,
    useFont: PDFFont,
    size: number
  ): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = useFont.widthOfTextAtSize(testLine, size);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function drawText(
    text: string,
    x: number,
    size: number,
    useFont: PDFFont = font,
    color = COLOR_TEXT
  ) {
    newPageIfNeeded(size + S(3));
    cursor.page.drawText(text, {
      x,
      y: cursor.y,
      size,
      font: useFont,
      color,
    });
    cursor.y -= size + S(3);
  }

  function drawWrappedText(
    text: string,
    x: number,
    size: number,
    useFont: PDFFont = font,
    maxWidth = CONTENT_WIDTH,
    color = COLOR_TEXT
  ) {
    const lines = wrapText(text, maxWidth, useFont, size);
    for (const line of lines) {
      drawText(line, x, size, useFont, color);
    }
  }

  function drawBullet(
    text: string,
    x: number,
    size: number,
    useFont: PDFFont = font
  ) {
    const bulletIndent = S(12);
    const maxWidth = CONTENT_WIDTH - (x - MARGIN) - bulletIndent;
    const lines = wrapText(text, maxWidth, useFont, size);

    lines.forEach((line, i) => {
      newPageIfNeeded(size + S(2));
      if (i === 0) {
        cursor.page.drawText("\u2022", {
          x,
          y: cursor.y,
          size,
          font: useFont,
          color: COLOR_TEXT,
        });
      }
      cursor.page.drawText(line, {
        x: x + bulletIndent,
        y: cursor.y,
        size,
        font: useFont,
        color: COLOR_TEXT,
      });
      cursor.y -= size + S(2);
    });
  }

  function drawSectionHeading(title: string) {
    cursor.y -= S(4);
    newPageIfNeeded(S(20));

    cursor.page.drawText(title.toUpperCase(), {
      x: MARGIN,
      y: cursor.y,
      size: S(12),
      font: fontBold,
      color: COLOR_HEADING,
    });
    cursor.y -= S(4);

    cursor.page.drawLine({
      start: { x: MARGIN, y: cursor.y },
      end: { x: PAGE_WIDTH - MARGIN, y: cursor.y },
      thickness: 0.75,
      color: COLOR_RULE,
    });
    cursor.y -= S(10);
  }

  function attachLinkAnnotation(
    page: PDFPage,
    rect: [number, number, number, number],
    url: string
  ) {
    const linkAnnotation = pdfDoc.context.register(
      pdfDoc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: rect,
        Border: [0, 0, 0],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(url),
        },
      })
    );

    const existingAnnots = page.node.lookup(PDFName.of("Annots"), PDFArray);

    if (existingAnnots) {
      existingAnnots.push(linkAnnotation);
    } else {
      page.node.set(PDFName.of("Annots"), pdfDoc.context.obj([linkAnnotation]));
    }
  }

  function drawLinkInline(
    x: number,
    size: number,
    text: string,
    url: string,
    useFont: PDFFont = font
  ): number {
    const textWidth = useFont.widthOfTextAtSize(text, size);
    const targetPage = cursor.page;
    const drawY = cursor.y;

    targetPage.drawText(text, {
      x,
      y: drawY,
      size,
      font: useFont,
      color: COLOR_LINK,
    });

    targetPage.drawLine({
      start: { x, y: drawY - 1.5 },
      end: { x: x + textWidth, y: drawY - 1.5 },
      thickness: 0.5,
      color: COLOR_LINK,
    });

    attachLinkAnnotation(
      targetPage,
      [x, drawY - 2, x + textWidth, drawY + size],
      url
    );

    return textWidth;
  }

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^mailto:/i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  /* ---------------------------------------------------
     HEADER
     --------------------------------------------------- */

  const { personalInfo } = data;

  drawText(personalInfo.fullName?.trim() || "Your Name", MARGIN, S(20), fontBold);

  if (personalInfo.title?.trim()) {
    drawText(personalInfo.title.trim(), MARGIN, S(11), fontItalic, COLOR_MUTED);
  }

  {
    newPageIfNeeded(S(14));
    let x = MARGIN;
    const size = S(9.5);
    const sep = "   |   ";
    const sepWidth = font.widthOfTextAtSize(sep, size);

    const contactItems: { text: string; url?: string }[] = [];

    if (personalInfo.phone?.trim()) {
      contactItems.push({ text: personalInfo.phone.trim() });
    }
    if (personalInfo.email?.trim()) {
      contactItems.push({
        text: personalInfo.email.trim(),
        url: `mailto:${personalInfo.email.trim()}`,
      });
    }
    if (personalInfo.location?.trim()) {
      contactItems.push({ text: personalInfo.location.trim() });
    }
    if (personalInfo.linkedin?.trim()) {
      contactItems.push({
        text: "LinkedIn",
        url: normalizeUrl(personalInfo.linkedin.trim()),
      });
    }
    if (personalInfo.github?.trim()) {
      contactItems.push({
        text: "GitHub",
        url: normalizeUrl(personalInfo.github.trim()),
      });
    }
    if (personalInfo.portfolio?.trim()) {
      contactItems.push({
        text: "Portfolio",
        url: normalizeUrl(personalInfo.portfolio.trim()),
      });
    }

    contactItems.forEach((item, i) => {
      if (item.url) {
        x += drawLinkInline(x, size, item.text, item.url);
      } else {
        cursor.page.drawText(item.text, {
          x,
          y: cursor.y,
          size,
          font,
          color: COLOR_TEXT,
        });
        x += font.widthOfTextAtSize(item.text, size);
      }

      if (i < contactItems.length - 1) {
        cursor.page.drawText(sep, {
          x,
          y: cursor.y,
          size,
          font,
          color: COLOR_MUTED,
        });
        x += sepWidth;
      }
    });

    cursor.y -= size + S(10);
  }

  /* ---------------------------------------------------
     SUMMARY
     --------------------------------------------------- */

  if (data.summary?.trim()) {
    drawSectionHeading("Summary");
    drawWrappedText(data.summary.trim(), MARGIN, S(10));
  }

  /* ---------------------------------------------------
     SKILLS
     --------------------------------------------------- */

  const skills = (data.skills || []).filter((s) => s?.trim());
  if (skills.length > 0) {
    drawSectionHeading("Skills");
    drawWrappedText(skills.join("  \u2022  "), MARGIN, S(10));
  }

  /* ---------------------------------------------------
     EXPERIENCE
     --------------------------------------------------- */

  const validExperience = (data.experience || []).filter(
    (e) => e.role?.trim() || e.company?.trim()
  );

  if (validExperience.length > 0) {
    drawSectionHeading("Experience");

    for (const exp of validExperience) {
      const role = exp.role?.trim() || "Role";
      const company = exp.company?.trim() || "Company";
      const dateParts = [exp.startDate, exp.current ? "Present" : exp.endDate].filter(
        Boolean
      );
      const dateRange = dateParts.join(" - ");

      newPageIfNeeded(S(14));
      drawText(`${role} \u2014 ${company}`, MARGIN, S(11), fontBold);

      if (dateRange) {
        drawText(dateRange, MARGIN, S(9), fontItalic, COLOR_MUTED);
      }

      for (const point of exp.description || []) {
        if (point?.trim()) {
          drawBullet(point.trim(), MARGIN + S(2), S(10));
        }
      }

      cursor.y -= S(6);
    }
  }

  /* ---------------------------------------------------
     PROJECTS
     --------------------------------------------------- */

  const validProjects = (data.projects || []).filter((p) => p.name?.trim());

  if (validProjects.length > 0) {
    drawSectionHeading("Projects");

    for (const project of validProjects) {
      newPageIfNeeded(S(14));
      drawText(project.name.trim(), MARGIN, S(11), fontBold);

      const linkUrl = project.url?.trim();
      const githubUrl = project.githubUrl?.trim();

      if (linkUrl || githubUrl) {
        newPageIfNeeded(S(12));
        let x = MARGIN;
        const size = S(9.5);

        if (linkUrl) {
          x += drawLinkInline(x, size, "Live Demo", normalizeUrl(linkUrl));
        }
        if (linkUrl && githubUrl) {
          const sep = "   |   ";
          cursor.page.drawText(sep, {
            x,
            y: cursor.y,
            size,
            font,
            color: COLOR_MUTED,
          });
          x += font.widthOfTextAtSize(sep, size);
        }
        if (githubUrl) {
          x += drawLinkInline(x, size, "GitHub", normalizeUrl(githubUrl));
        }

        cursor.y -= size + S(4);
      }

      const techStack = (project.techStack || []).filter((t) => t?.trim());
      if (techStack.length > 0) {
        drawText(techStack.join(", "), MARGIN, S(9), fontItalic, COLOR_MUTED);
      }

      for (const point of project.description || []) {
        if (point?.trim()) {
          drawBullet(point.trim(), MARGIN + S(2), S(10));
        }
      }

      cursor.y -= S(6);
    }
  }

  /* ---------------------------------------------------
     EDUCATION
     --------------------------------------------------- */

  const validEducation = (data.education || []).filter(
    (e) => e.institution?.trim() || e.degree?.trim()
  );

  if (validEducation.length > 0) {
    drawSectionHeading("Education");

    for (const edu of validEducation) {
      const degree = edu.degree?.trim() || "Degree";
      const field = edu.field?.trim() ? `, ${edu.field.trim()}` : "";
      const dateRange = [edu.startYear, edu.endYear].filter(Boolean).join(" - ");

      newPageIfNeeded(S(14));
      drawText(`${degree}${field}`, MARGIN, S(11), fontBold);

      const institution = edu.institution?.trim() || "";
      const line2 = [institution, dateRange ? `(${dateRange})` : ""]
        .filter(Boolean)
        .join("  ");
      if (line2) {
        drawText(line2, MARGIN, S(9.5), font, COLOR_MUTED);
      }

      if (edu.cgpa?.trim()) {
        drawText(`CGPA: ${edu.cgpa.trim()}`, MARGIN, S(9.5));
      }

      cursor.y -= S(4);
    }
  }

  /* ---------------------------------------------------
     CERTIFICATIONS
     --------------------------------------------------- */

  const validCertifications = (data.certifications || []).filter((c) =>
    c.name?.trim()
  );

  if (validCertifications.length > 0) {
    drawSectionHeading("Certifications");

    for (const cert of validCertifications) {
      const parts = [cert.name, cert.organization, cert.issueDate].filter(
        (v): v is string => Boolean(v?.trim())
      );
      if (parts.length === 0) continue;

      newPageIfNeeded(S(12));
      const label = parts.join(" \u2014 ");
      const url = cert.url?.trim();
      const size = S(10);

      if (url) {
        let x = MARGIN;
        cursor.page.drawText("\u2022 ", { x, y: cursor.y, size, font, color: COLOR_TEXT });
        x += font.widthOfTextAtSize("\u2022 ", size);
        cursor.page.drawText(`${label}  `, {
          x,
          y: cursor.y,
          size,
          font,
          color: COLOR_TEXT,
        });
        x += font.widthOfTextAtSize(`${label}  `, size);
        drawLinkInline(x, size, "(link)", normalizeUrl(url));
        cursor.y -= size + S(4);
      } else {
        drawBullet(label, MARGIN, size);
      }
    }
  }

  return pdfDoc;
}

/* =====================================================
   PUBLIC: GENERATE — auto-shrinks to fit on one page
   ===================================================== */

export async function generateResumePDF(data: ResumeData): Promise<Uint8Array> {
  let bestDoc: PDFDocument | null = null;

  for (let scale = MAX_SCALE; scale >= MIN_SCALE - 1e-9; scale -= SCALE_STEP) {
    const doc = await renderResumeAtScale(data, scale);
    bestDoc = doc; // keep the most-compressed attempt as a fallback

    if (doc.getPageCount() === 1) {
      return doc.save();
    }
  }

  // Even at the readability floor it didn't fit on one page.
  // Return the most-compressed version rather than shrinking
  // text further — the resume will just flow onto page 2.
  return bestDoc!.save();
}

/* =====================================================
   DOWNLOAD HELPER
   ===================================================== */

function safeFileName(data: ResumeData): string {
  const name = data.personalInfo.fullName?.trim();
  if (!name) return "resume";

  const filename = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return filename || "resume";
}

/**
 * Generates the PDF with clickable links, auto-fits it to one
 * page where possible, and triggers a browser download.
 */
export async function downloadResumePDF(data: ResumeData) {
  if (typeof window === "undefined") return;

  try {
    const pdfBytes = await generateResumePDF(data);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName(data)}.pdf`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error("Failed to generate resume PDF:", error);
  }
}