"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { DownloadMenu } from "@/components/builder/DownloadMenu";

export function BuilderHeader() {
  const { theme, setTheme } = useTheme();
  const { completionPercentage, setActiveStep } = useResumeStore();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <span className="font-bold">AI</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          ResumeOS
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mr-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>Saved</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium">
            {completionPercentage}% Complete
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-zinc-500" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-zinc-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="outline"
          className="hidden sm:flex"
          onClick={() => setActiveStep(8)}
        >
          <Search className="mr-2 h-4 w-4" />
          Analyze ATS
        </Button>

        <DownloadMenu />
      </div>
    </header>
  );
}