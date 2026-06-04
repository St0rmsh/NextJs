"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { cn } from "@/lib/utils";
import { 
  User, 
  FileText, 
  Code, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Award, 
  BarChart, 
  CheckSquare 
} from "lucide-react";

const STEPS = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Summary", icon: FileText },
  { id: 3, name: "Skills", icon: Code },
  { id: 4, name: "Experience", icon: Briefcase },
  { id: 5, name: "Projects", icon: FolderGit2 },
  { id: 6, name: "Education", icon: GraduationCap },
  { id: 7, name: "Certifications", icon: Award },
  { id: 8, name: "ATS Analysis", icon: BarChart },
  { id: 9, name: "Final Review", icon: CheckSquare },
];

export function BuilderSidebar() {
  const { activeStep, setActiveStep } = useResumeStore();

  return (
    <div className="w-64 shrink-0 border-r border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/50 hidden lg:block overflow-y-auto">
      <div className="p-4">
        <div className="space-y-1">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {step.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
