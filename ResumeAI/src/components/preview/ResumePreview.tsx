"use client";

import { useMemo } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { groupSkills } from "@/lib/resume/skillCategories";

function normalizeUrl(url?: string): string {
  if (!url?.trim()) {
    return "";
  }

  const value = url.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-2 border-b border-zinc-300 pb-1 text-[12.5px] font-bold uppercase tracking-[0.12em] text-zinc-800">
      {children}
    </h2>
  );
}

export default function ResumePreview() {
  const { data } = useResumeStore();

  const personalInfo = data.personalInfo;

  /* =========================================================
     FILTER EMPTY DATA
     ========================================================= */

  const validExperience =
    data.experience?.filter(
      (experience) =>
        Boolean(experience.role?.trim()) ||
        Boolean(experience.company?.trim()) ||
        Boolean(experience.startDate?.trim()) ||
        Boolean(experience.endDate?.trim()) ||
        Boolean(
          experience.description?.some(
            (point) => point?.trim()
          )
        )
    ) || [];

  const validEducation =
    data.education?.filter(
      (education) =>
        Boolean(education.institution?.trim()) ||
        Boolean(education.degree?.trim()) ||
        Boolean(education.field?.trim()) ||
        Boolean(education.startYear) ||
        Boolean(education.endYear) ||
        Boolean(education.cgpa?.trim())
    ) || [];

  const validProjects =
    data.projects?.filter(
      (project) =>
        Boolean(project.name?.trim()) ||
        Boolean(project.url?.trim()) ||
        Boolean(
          project.techStack?.some(
            (technology) => technology?.trim()
          )
        ) ||
        Boolean(
          project.description?.some(
            (point) => point?.trim()
          )
        )
    ) || [];

  const validCertifications =
    data.certifications?.filter(
      (certification) =>
        Boolean(certification.name?.trim()) ||
        Boolean(certification.organization?.trim()) ||
        Boolean(certification.issueDate?.trim()) ||
        Boolean(certification.url?.trim())
    ) || [];

  const validSkills =
    data.skills?.filter(
      (skill) => skill?.trim()
    ) || [];

  /* =========================================================
     GROUP SKILLS
     ========================================================= */

  const groupedSkills = useMemo(
    () => groupSkills(validSkills),
    [data.skills]
  );

  /* =========================================================
     CHECK WHETHER RESUME HAS ANY CONTENT
     ========================================================= */

  const hasAnyContent =
    Boolean(personalInfo?.fullName?.trim()) ||
    Boolean(personalInfo?.title?.trim()) ||
    Boolean(personalInfo?.email?.trim()) ||
    Boolean(personalInfo?.phone?.trim()) ||
    Boolean(personalInfo?.location?.trim()) ||
    Boolean(personalInfo?.linkedin?.trim()) ||
    Boolean(personalInfo?.github?.trim()) ||
    Boolean(personalInfo?.portfolio?.trim()) ||
    Boolean(data.summary?.trim()) ||
    validSkills.length > 0 ||
    validExperience.length > 0 ||
    validProjects.length > 0 ||
    validEducation.length > 0 ||
    validCertifications.length > 0;

  /* =========================================================
     EMPTY PREVIEW
     ========================================================= */

  if (!hasAnyContent) {
    return (
      <div
        id="resume-print-container"
        className="flex h-[calc(100vh-4rem)] w-full items-start justify-center overflow-y-auto bg-zinc-100 px-4 py-8 dark:bg-zinc-950"
      >
        <div className="w-full max-w-[794px] bg-white p-12 text-center text-zinc-500 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
          <p className="text-sm">
            Start filling out your resume to see the preview here.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     RESUME
     ========================================================= */

  return (
    <div
      id="resume-print-container"
      className="h-[calc(100vh-4rem)] w-full overflow-y-auto bg-zinc-100 px-4 py-6 dark:bg-zinc-950 sm:px-6 lg:px-10"
    >
      <div
        id="resume-print-area"
        className="mx-auto w-full max-w-[794px] shrink-0 bg-white text-zinc-900 shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="box-border px-8 py-7 sm:px-9 sm:py-8">

          {/* =====================================================
              HEADER
             ===================================================== */}

          <header className="mb-5 text-center">

            {/* NAME */}

            {personalInfo.fullName?.trim() && (
              <h1 className="text-[29px] font-bold leading-[1.1] tracking-tight text-zinc-950">
                {personalInfo.fullName.trim()}
              </h1>
            )}

            {/* TITLE */}

            {personalInfo.title?.trim() && (
              <p className="mt-1 text-[14px] font-medium text-zinc-600">
                {personalInfo.title.trim()}
              </p>
            )}

            {/* =================================================
                EMAIL / PHONE / LOCATION
               ================================================= */}

            {(personalInfo.email?.trim() ||
              personalInfo.phone?.trim() ||
              personalInfo.location?.trim()) && (
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[10.5px] leading-5 text-zinc-600">

                {personalInfo.email?.trim() && (
                  <a
                    href={`mailto:${personalInfo.email.trim()}`}
                    className="resume-link hover:underline"
                  >
                    {personalInfo.email.trim()}
                  </a>
                )}

                {personalInfo.phone?.trim() && (
                  <>
                    {personalInfo.email?.trim() && (
                      <span aria-hidden="true">
                        •
                      </span>
                    )}

                    <a
                      href={`tel:${personalInfo.phone.trim()}`}
                      className="resume-link hover:underline"
                    >
                      {personalInfo.phone.trim()}
                    </a>
                  </>
                )}

                {personalInfo.location?.trim() && (
                  <>
                    {(personalInfo.email?.trim() ||
                      personalInfo.phone?.trim()) && (
                      <span aria-hidden="true">
                        •
                      </span>
                    )}

                    <span>
                      {personalInfo.location.trim()}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* =================================================
                LINKEDIN / GITHUB / PORTFOLIO
               ================================================= */}

            {(personalInfo.linkedin?.trim() ||
              personalInfo.github?.trim() ||
              personalInfo.portfolio?.trim()) && (
              <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[10.5px] leading-5 text-zinc-600">

                {personalInfo.linkedin?.trim() && (
                  <a
                    href={normalizeUrl(
                      personalInfo.linkedin
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-link hover:underline"
                  >
                    LinkedIn
                  </a>
                )}

                {personalInfo.github?.trim() && (
                  <>
                    {personalInfo.linkedin?.trim() && (
                      <span aria-hidden="true">
                        •
                      </span>
                    )}

                    <a
                      href={normalizeUrl(
                        personalInfo.github
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-link hover:underline"
                    >
                      GitHub
                    </a>
                  </>
                )}

                {personalInfo.portfolio?.trim() && (
                  <>
                    {(personalInfo.linkedin?.trim() ||
                      personalInfo.github?.trim()) && (
                      <span aria-hidden="true">
                        •
                      </span>
                    )}

                    <a
                      href={normalizeUrl(
                        personalInfo.portfolio
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-link hover:underline"
                    >
                      Portfolio
                    </a>
                  </>
                )}
              </div>
            )}
          </header>

          {/* =====================================================
              SUMMARY
             ===================================================== */}

          {data.summary?.trim() && (
            <section className="mb-4">
              <SectionTitle>
                Summary
              </SectionTitle>

              <p className="text-[11px] leading-[1.5] text-zinc-700">
                {data.summary.trim()}
              </p>
            </section>
          )}

          {/* =====================================================
              SKILLS
             ===================================================== */}

          {groupedSkills.length > 0 && (
            <section className="mb-4">
              <SectionTitle>
                Skills
              </SectionTitle>

              <div className="space-y-1">
                {groupedSkills.map((group) => (
                  <div
                    key={group.category}
                    className="grid grid-cols-[105px_minmax(0,1fr)] items-start gap-x-3"
                  >
                    <span className="pt-[1px] text-[9.5px] font-bold uppercase tracking-[0.06em] text-zinc-600">
                      {group.label}
                    </span>

                    <p className="text-[10.5px] leading-[1.5] text-zinc-700">
                      {group.skills.join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              EXPERIENCE
             ===================================================== */}

          {validExperience.length > 0 && (
            <section className="mb-4">
              <SectionTitle>
                Experience
              </SectionTitle>

              <div className="space-y-3">
                {validExperience.map(
                  (experience, index) => {
                    const dateParts = [
                      experience.startDate,
                      experience.current
                        ? "Present"
                        : experience.endDate,
                    ].filter(Boolean);

                    const dateRange =
                      dateParts.join(" - ");

                    const descriptions =
                      experience.description?.filter(
                        (point) => point?.trim()
                      ) || [];

                    return (
                      <article
                        key={`${experience.company}-${experience.role}-${index}`}
                        className="break-inside-avoid"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            {experience.role?.trim() && (
                              <h3 className="text-[12px] font-bold text-zinc-900">
                                {experience.role.trim()}
                              </h3>
                            )}

                            {experience.company?.trim() && (
                              <p className="mt-0.5 text-[11px] font-medium text-zinc-600">
                                {experience.company.trim()}
                              </p>
                            )}
                          </div>

                          {dateRange && (
                            <span className="shrink-0 text-[10px] text-zinc-500">
                              {dateRange}
                            </span>
                          )}
                        </div>

                        {descriptions.length > 0 && (
                          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10.5px] leading-[1.45] text-zinc-700">
                            {descriptions.map(
                              (
                                point,
                                pointIndex
                              ) => (
                                <li
                                  key={pointIndex}
                                >
                                  {point.trim()}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              PROJECTS
             ===================================================== */}

          {validProjects.length > 0 && (
            <section className="mb-4">
              <SectionTitle>
                Projects
              </SectionTitle>

              <div className="space-y-3">
                {validProjects.map(
                  (project, index) => {
                    const projectUrl =
                      project.url?.trim()
                        ? normalizeUrl(
                            project.url
                          )
                        : "";

                    const techStack =
                      project.techStack?.filter(
                        (technology) =>
                          technology?.trim()
                      ) || [];

                    const descriptions =
                      project.description?.filter(
                        (point) =>
                          point?.trim()
                      ) || [];

                    return (
                      <article
                        key={`${project.name}-${index}`}
                        className="break-inside-avoid"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            {project.name?.trim() && (
                              <h3 className="text-[12px] font-bold text-zinc-900">
                                {projectUrl ? (
                                  <a
                                    href={
                                      projectUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="resume-link hover:underline"
                                  >
                                    {project.name.trim()}
                                  </a>
                                ) : (
                                  project.name.trim()
                                )}
                              </h3>
                            )}

                            {techStack.length > 0 && (
                              <p className="mt-0.5 text-[10px] font-medium text-zinc-500">
                                {techStack.join(" • ")}
                              </p>
                            )}
                          </div>

                          {projectUrl && (
                            <a
                              href={projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resume-link shrink-0 text-[10px] text-zinc-500 hover:underline"
                            >
                              View Project
                            </a>
                          )}
                        </div>

                        {descriptions.length > 0 && (
                          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10.5px] leading-[1.45] text-zinc-700">
                            {descriptions.map(
                              (
                                point,
                                pointIndex
                              ) => (
                                <li
                                  key={pointIndex}
                                >
                                  {point.trim()}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              EDUCATION
             ===================================================== */}

          {validEducation.length > 0 && (
            <section className="mb-4">
              <SectionTitle>
                Education
              </SectionTitle>

              <div className="space-y-2.5">
                {validEducation.map(
                  (education, index) => {
                    const degree =
                      education.degree?.trim() ||
                      "";

                    const field =
                      education.field?.trim()
                        ? `, ${education.field.trim()}`
                        : "";

                    const dateParts = [
                      education.startYear,
                      education.endYear,
                    ].filter(Boolean);

                    const dateRange =
                      dateParts.join(" - ");

                    return (
                      <article
                        key={`${education.institution}-${education.degree}-${index}`}
                        className="break-inside-avoid"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            {(degree || field) && (
                              <h3 className="text-[11.5px] font-bold text-zinc-900">
                                {degree}
                                {field}
                              </h3>
                            )}

                            {education.institution?.trim() && (
                              <p className="mt-0.5 text-[10.5px] text-zinc-600">
                                {education.institution.trim()}
                              </p>
                            )}

                            {education.cgpa?.trim() && (
                              <p className="mt-0.5 text-[10px] text-zinc-500">
                                CGPA:{" "}
                                {education.cgpa.trim()}
                              </p>
                            )}
                          </div>

                          {dateRange && (
                            <span className="shrink-0 text-[10px] text-zinc-500">
                              {dateRange}
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              CERTIFICATIONS
             ===================================================== */}

          {validCertifications.length > 0 && (
            <section className="mb-4">
              <SectionTitle>
                Certifications
              </SectionTitle>

              <div className="space-y-2">
                {validCertifications.map(
                  (
                    certification,
                    index
                  ) => {
                    const certificationUrl =
                      certification.url?.trim()
                        ? normalizeUrl(
                            certification.url
                          )
                        : "";

                    return (
                      <article
                        key={`${certification.name}-${index}`}
                        className="break-inside-avoid"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            {certification.name?.trim() && (
                              <h3 className="text-[11px] font-semibold text-zinc-900">
                                {certificationUrl ? (
                                  <a
                                    href={
                                      certificationUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="resume-link hover:underline"
                                  >
                                    {certification.name.trim()}
                                  </a>
                                ) : (
                                  certification.name.trim()
                                )}
                              </h3>
                            )}

                            {(certification.organization?.trim() ||
                              certification.issueDate?.trim()) && (
                              <p className="mt-0.5 text-[10px] text-zinc-500">
                                {[
                                  certification.organization,
                                  certification.issueDate,
                                ]
                                  .filter(
                                    (value) =>
                                      value?.trim()
                                  )
                                  .join(" • ")}
                              </p>
                            )}
                          </div>

                          {certificationUrl && (
                            <a
                              href={
                                certificationUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resume-link shrink-0 text-[10px] text-zinc-500 hover:underline"
                            >
                              Certificate
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}