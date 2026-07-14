import { ResumeData } from "@/types/resume";

/**
 * Triggers a browser download for a given string of content.
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function safeFileName(data: ResumeData) {
  const name = data.personalInfo.fullName?.trim() || "resume";
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Converts resume data into a clean, well-structured Markdown document.
 * Blank/empty entries (added but never filled in) are skipped entirely.
 */
export function generateResumeMarkdown(data: ResumeData): string {
  const lines: string[] = [];
  const { personalInfo } = data;

  const validExperience = data.experience.filter((e) => e.role || e.company);
  const validProjects = data.projects.filter((p) => p.name);
  const validEducation = data.education.filter((e) => e.institution || e.degree);
  const validCertifications = data.certifications.filter((c) => c.name);

  lines.push(`# ${personalInfo.fullName || "Your Name"}`);
  if (personalInfo.title) lines.push(`**${personalInfo.title}**`);

  const contactBits = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter(Boolean);
  if (contactBits.length) lines.push(contactBits.join(" | "));

  if (data.summary) {
    lines.push("", "## Summary", data.summary);
  }

  if (data.skills.length) {
    lines.push("", "## Skills", data.skills.join(", "));
  }

  if (validExperience.length) {
    lines.push("", "## Experience");
    for (const exp of validExperience) {
      const dateRange = `${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}`;
      lines.push("", `### ${exp.role || "Role"} — ${exp.company || "Company"}`, `*${dateRange}*`);
      for (const point of exp.description.filter(Boolean)) {
        lines.push(`- ${point}`);
      }
    }
  }

  if (validProjects.length) {
    lines.push("", "## Projects");
    for (const proj of validProjects) {
      const heading = proj.url
        ? `### [${proj.name}](${proj.url})`
        : `### ${proj.name}`;
      lines.push("", heading);
      if (proj.techStack.length) lines.push(`*${proj.techStack.join(", ")}*`);
      for (const point of proj.description.filter(Boolean)) {
        lines.push(`- ${point}`);
      }
    }
  }

  if (validEducation.length) {
    lines.push("", "## Education");
    for (const edu of validEducation) {
      const dateRange = `${edu.startYear || ""} - ${edu.endYear || ""}`;
      lines.push(
        "",
        `### ${edu.degree || "Degree"}${edu.field ? `, ${edu.field}` : ""}`,
        `${edu.institution || ""} | *${dateRange}*`
      );
      if (edu.cgpa) lines.push(`CGPA: ${edu.cgpa}`);
    }
  }

  if (validCertifications.length) {
    lines.push("", "## Certifications");
    for (const cert of validCertifications) {
      const parts = [cert.name, cert.organization, cert.issueDate].filter(Boolean);
      lines.push(`- ${parts.join(" — ")}${cert.url ? ` ([link](${cert.url}))` : ""}`);
    }
  }

  return lines.join("\n").trim() + "\n";
}

/**
 * Converts resume data into a readable plain-text document (no markdown syntax).
 */
export function generateResumeText(data: ResumeData): string {
  const md = generateResumeMarkdown(data);
  return md
    .replace(/^#{1,6}\s+/gm, "")        // strip heading hashes
    .replace(/\*\*(.*?)\*\*/g, "$1")    // strip bold
    .replace(/\*(.*?)\*/g, "$1")        // strip italics
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // strip links, keep label
    .replace(/^- /gm, "• ");            // nicer bullets for plain text
}

/**
 * Returns the raw resume data as pretty-printed JSON (backup/import format).
 */
export function generateResumeJSON(data: ResumeData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Opens the browser print dialog scoped to the resume preview.
 * Relies on the #resume-print-area / #resume-print-container CSS in globals.css.
 */
export function printResume() {
  window.print();
}

export function downloadResumeMarkdown(data: ResumeData) {
  downloadFile(`${safeFileName(data)}.md`, generateResumeMarkdown(data), "text/markdown");
}

export function downloadResumeText(data: ResumeData) {
  downloadFile(`${safeFileName(data)}.txt`, generateResumeText(data), "text/plain");
}

export function downloadResumeJSON(data: ResumeData) {
  downloadFile(`${safeFileName(data)}.json`, generateResumeJSON(data), "application/json");
}