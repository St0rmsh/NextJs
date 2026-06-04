"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";

export function ResumePreview() {
  const { data } = useResumeStore();

  return (
    <div className="flex w-full items-center justify-center p-4 lg:p-8 bg-zinc-100 dark:bg-zinc-950 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* A4 Paper aspect ratio container */}
      <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-2xl rounded-sm overflow-hidden text-zinc-900 transition-all duration-300">
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
            </div>
          </header>

          {data.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-2 border-b border-zinc-200 pb-1">Professional Summary</h2>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase text-zinc-900 mb-3 border-b border-zinc-200 pb-1">Experience</h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900">{exp.role}</h3>
                      <span className="text-sm font-medium text-emerald-700">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-zinc-700 mb-2">{exp.company}</p>
                    <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1 ml-1">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Add Projects, Education, etc. placeholders here as needed */}
          <div className="opacity-50 text-center text-zinc-400 mt-20 text-sm">
            Resume Preview - Start filling out your information
          </div>
        </div>
      </div>
    </div>
  );
}
