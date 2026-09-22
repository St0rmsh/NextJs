import { ResumeData } from "@/types/resume";

/**
 * Triggers a browser download for a given string of content.
 */
export function downloadFile(
  filename: string,
  content: string,
  mimeType: string
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const blob = new Blob([content], {
      type: mimeType,
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Allow the browser to start the download before
    // releasing the object URL.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Failed to download resume:", error);
  }
}

/**
 * Creates a safe filename from the user's name.
 */
function safeFileName(data: ResumeData): string {
  const name = data.personalInfo.fullName?.trim();

  if (!name) {
    return "resume";
  }

  const filename = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return filename || "resume";
}

/**
 * Converts resume data into a clean, well-structured
 * Markdown document.
 *
 * Empty sections and empty entries are skipped.
 */
export function generateResumeMarkdown(data: ResumeData): string {
  const lines: string[] = [];
  const { personalInfo } = data;

  const validExperience = data.experience.filter(
    (experience) =>
      experience.role?.trim() ||
      experience.company?.trim()
  );

  const validProjects = data.projects.filter(
    (project) => project.name?.trim()
  );

  const validEducation = data.education.filter(
    (education) =>
      education.institution?.trim() ||
      education.degree?.trim()
  );

  const validCertifications = data.certifications.filter(
    (certification) =>
      certification.name?.trim()
  );

  /* =====================================================
     HEADER
     ===================================================== */

  lines.push(
    `# ${personalInfo.fullName?.trim() || "Your Name"}`
  );

  if (personalInfo.title?.trim()) {
    lines.push(
      `**${personalInfo.title.trim()}**`
    );
  }

  const contactBits = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter(
    (value): value is string =>
      Boolean(value?.trim())
  );

  if (contactBits.length > 0) {
    lines.push(contactBits.join(" | "));
  }

  /* =====================================================
     SUMMARY
     ===================================================== */

  if (data.summary?.trim()) {
    lines.push(
      "",
      "## Summary",
      data.summary.trim()
    );
  }

  /* =====================================================
     SKILLS
     ===================================================== */

  if (data.skills?.length) {
    const skills = data.skills.filter(
      (skill) => skill?.trim()
    );

    if (skills.length > 0) {
      lines.push(
        "",
        "## Skills",
        skills.join(", ")
      );
    }
  }

  /* =====================================================
     EXPERIENCE
     ===================================================== */

  if (validExperience.length > 0) {
    lines.push(
      "",
      "## Experience"
    );

    for (const experience of validExperience) {
      const dateParts = [
        experience.startDate,
        experience.current
          ? "Present"
          : experience.endDate,
      ].filter(Boolean);

      const dateRange = dateParts.join(" - ");

      const role =
        experience.role?.trim() || "Role";

      const company =
        experience.company?.trim() || "Company";

      lines.push(
        "",
        `### ${role} — ${company}`
      );

      if (dateRange) {
        lines.push(`*${dateRange}*`);
      }

      const descriptions =
        experience.description || [];

      for (const point of descriptions) {
        if (point?.trim()) {
          lines.push(`- ${point.trim()}`);
        }
      }
    }
  }

  /* =====================================================
     PROJECTS
     ===================================================== */

  if (validProjects.length > 0) {
    lines.push(
      "",
      "## Projects"
    );

    for (const project of validProjects) {
      const projectName =
        project.name.trim();

      const projectUrl =
        project.url?.trim();

      const githubUrl =
        project.githubUrl?.trim();

      lines.push(
        "",
        `### ${projectName}`
      );

      /*
       * Export both project URLs.
       *
       * Example:
       * [Live Demo](https://example.com) |
       * [GitHub](https://github.com/example/project)
       */
      const links: string[] = [];

      if (projectUrl) {
        links.push(
          `[Live Demo](${projectUrl})`
        );
      }

      if (githubUrl) {
        links.push(
          `[GitHub](${githubUrl})`
        );
      }

      if (links.length > 0) {
        lines.push(
          links.join(" | ")
        );
      }

      const techStack =
        (project.techStack || []).filter(
          (technology) => technology?.trim()
        );

      if (techStack.length > 0) {
        lines.push(
          `*${techStack.join(", ")}*`
        );
      }

      const descriptions =
        project.description || [];

      for (const point of descriptions) {
        if (point?.trim()) {
          lines.push(`- ${point.trim()}`);
        }
      }
    }
  }

  /* =====================================================
     EDUCATION
     ===================================================== */

  if (validEducation.length > 0) {
    lines.push(
      "",
      "## Education"
    );

    for (const education of validEducation) {
      const degree =
        education.degree?.trim() ||
        "Degree";

      const field = education.field?.trim()
        ? `, ${education.field.trim()}`
        : "";

      const dateParts = [
        education.startYear,
        education.endYear,
      ].filter(Boolean);

      const dateRange =
        dateParts.join(" - ");

      lines.push(
        "",
        `### ${degree}${field}`
      );

      const institution =
        education.institution?.trim() || "";

      if (institution && dateRange) {
        lines.push(
          `${institution} | *${dateRange}*`
        );
      } else if (institution) {
        lines.push(institution);
      } else if (dateRange) {
        lines.push(`*${dateRange}*`);
      }

      if (education.cgpa?.trim()) {
        lines.push(
          `CGPA: ${education.cgpa.trim()}`
        );
      }
    }
  }

  /* =====================================================
     CERTIFICATIONS
     ===================================================== */

  if (validCertifications.length > 0) {
    lines.push(
      "",
      "## Certifications"
    );

    for (const certification of validCertifications) {
      const parts = [
        certification.name,
        certification.organization,
        certification.issueDate,
      ].filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

      if (parts.length === 0) {
        continue;
      }

      const url =
        certification.url?.trim();

      lines.push(
        `- ${parts.join(" — ")}${
          url
            ? ` ([link](${url}))`
            : ""
        }`
      );
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

/**
 * Converts the Markdown resume into readable
 * plain text.
 */
export function generateResumeText(
  data: ResumeData
): string {
  return generateResumeMarkdown(data)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^- /gm, "• ");
}

/**
 * Returns the raw resume data as formatted JSON.
 *
 * Useful for backup/import.
 */
export function generateResumeJSON(
  data: ResumeData
): string {
  return JSON.stringify(
    data,
    null,
    2
  );
}

/**
 * Opens the browser print dialog specifically
 * after the resume has finished rendering.
 *
 * This is used for:
 *
 * Resume Preview
 *       ↓
 * Print
 *       ↓
 * Save as PDF
 *
 * IMPORTANT:
 * This uses the browser's native print engine
 * instead of converting the resume into a canvas/image.
 *
 * Native browser printing preserves actual
 * <a href="..."> links in the generated PDF.
 */
export function printResume() {
  if (typeof window === "undefined") {
    return;
  }

  const printArea =
    document.getElementById(
      "resume-print-area"
    );

  if (!printArea) {
    console.error(
      "Resume print area not found."
    );

    return;
  }

  /*
   * Wait for React/browser layout to finish.
   *
   * Frame 1 → React/layout updates
   * Frame 2 → browser paints final layout
   */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      /*
       * If the resume contains images,
       * wait until they finish loading before
       * opening the print dialog.
       */
      const images =
        Array.from(
          printArea.querySelectorAll("img")
        );

      const imagePromises =
        images
          .filter(
            (image) => !image.complete
          )
          .map(
            (image) =>
              new Promise<void>((resolve) => {
                image.addEventListener(
                  "load",
                  () => resolve(),
                  { once: true }
                );

                image.addEventListener(
                  "error",
                  () => resolve(),
                  { once: true }
                );
              })
          );

      Promise.all(imagePromises).then(() => {
        /*
         * Final frame before printing.
         */
        requestAnimationFrame(() => {
          window.print();
        });
      });
    });
  });
}

/**
 * Downloads the resume as Markdown.
 */
export function downloadResumeMarkdown(
  data: ResumeData
) {
  downloadFile(
    `${safeFileName(data)}.md`,
    generateResumeMarkdown(data),
    "text/markdown;charset=utf-8"
  );
}

/**
 * Downloads the resume as plain text.
 */
export function downloadResumeText(
  data: ResumeData
) {
  downloadFile(
    `${safeFileName(data)}.txt`,
    generateResumeText(data),
    "text/plain;charset=utf-8"
  );
}

/**
 * Downloads the raw resume data as JSON.
 */
export function downloadResumeJSON(
  data: ResumeData
) {
  downloadFile(
    `${safeFileName(data)}.json`,
    generateResumeJSON(data),
    "application/json;charset=utf-8"
  );
}