"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";

export function ResumePreview() {
  const { data } = useResumeStore();

  const hasAnyContent =
    data.personalInfo.fullName ||
    data.summary ||
    data.skills.length > 0 ||
    data.experience.some((e) => e.role || e.company) ||
    data.projects.some((p) => p.name) ||
    data.education.some((e) => e.institution || e.degree) ||
    data.certifications.some((c) => c.name);

  const validExperience = data.experience.filter((e) => e.role || e.company);
  const validProjects = data.projects.filter((p) => p.name);
  const validEducation = data.education.filter((e) => e.institution || e.degree);
  const validCertifications = data.certifications.filter((c) => c.name);

  return (
    <div className="flex w-full items-center justify-center p-4 lg:p-8 bg-zinc-100 dark:bg-zinc-950 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* A4 Paper aspect ratio container */}
      <div
        id="resume-print-area"
        className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-2xl rounded-sm overflow-hidden text-zinc-900 transition-all duration-300"
      >
        <div className="p-10">
          <header className="border-b-2 border-zinc-800 pb-4 mb-6">
            <h1 className="text-4xl font-bold uppercase tracking-tight text-zinc-900">
              {data.personalInfo.fullName || "Your Name"}
            </h1>
            <p className="text-lg text-emerald-700 font-medium mt-1">
              {data.personalInfo.title || "Professional Title"}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-zinc-600">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
              {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
            </div>
          </header>

          {data.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-2 border-b border-zinc-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {data.summary}
              </p>
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-2 border-b border-zinc-200 pb-1">
                Technical Skills
              </h2>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {data.skills.join(" • ")}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-3 border-b border-zinc-200 pb-1">
                Experience
              </h2>
              <div className="space-y-4">
                {validExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">{exp.role}</h3>
                      <span className="text-sm font-medium text-emerald-700">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-2">{exp.company}</p>
                    <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1 ml-1">
                      {exp.description.filter(Boolean).map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-3 border-b border-zinc-200 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {validProjects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">{proj.name}</h3>
                      {proj.url && (
                        <span className="text-sm font-medium text-emerald-700">{proj.url}</span>
                      )}
                    </div>
                    {proj.techStack.length > 0 && (
                      <p className="text-sm font-medium text-zinc-700 mb-2 italic">
                        {proj.techStack.join(", ")}
                      </p>
                    )}
                    <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1 ml-1">
                      {proj.description.filter(Boolean).map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {validEducation.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-3 border-b border-zinc-200 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {validEducation.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">
                        {edu.degree}
                        {edu.field ? `, ${edu.field}` : ""}
                      </h3>
                      <span className="text-sm font-medium text-emerald-700">
                        {edu.startYear} - {edu.endYear}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700">
                      {edu.institution}
                      {edu.cgpa ? ` — CGPA: ${edu.cgpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {validCertifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-3 border-b border-zinc-200 pb-1">
                Certifications
              </h2>
              <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1 ml-1">
                {validCertifications.map((cert) => (
                  <li key={cert.id}>
                    {cert.name}
                    {cert.organization ? ` — ${cert.organization}` : ""}
                    {cert.issueDate ? ` (${cert.issueDate})` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!hasAnyContent && (
            <div className="opacity-50 text-center text-zinc-400 mt-20 text-sm">
              Resume Preview - Start filling out your information
            </div>
          )}
        </div>
      </div>
    </div>
  );
}