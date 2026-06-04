"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sparkles, RefreshCcw, Wand2, Loader2 } from "lucide-react";

export function SummaryForm() {
  const { data, updateSummary, updatePersonalInfo } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("Mid Level");

  const generateSummary = async () => {
    if (!data.personalInfo.title) {
      alert("Please enter a Professional Title in Personal Info or below.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/genearte-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.personalInfo.title,
          experienceLevel,
          skills: data.skills.length > 0 ? data.skills : ["General Software Engineering"], // Fallback if no skills yet
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.summary?.summary) {
        updateSummary(result.data.summary.summary);
      } else {
        alert("Failed to generate summary. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Professional Summary
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Write a short summary highlighting your key experience and achievements.
        </p>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
            AI Generation
          </CardTitle>
          <CardDescription>
            Let our AI write a professional summary based on your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Target Job Title</Label>
              <Input
                id="jobTitle"
                value={data.personalInfo.title}
                onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                className="bg-white dark:bg-zinc-900"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
                <option value="Senior Level (5-10 years)">Senior Level (5-10 years)</option>
                <option value="Executive (10+ years)">Executive (10+ years)</option>
              </select>
            </div>
          </div>
          
          <Button 
            onClick={generateSummary} 
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="summary">Your Summary</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                  <Wand2 className="mr-2 h-3.5 w-3.5" />
                  Improve
                </Button>
                {data.summary && (
                  <Button variant="ghost" size="sm" className="h-8 text-zinc-500" onClick={generateSummary} disabled={isGenerating}>
                    <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                )}
              </div>
            </div>
            
            <Textarea
              id="summary"
              placeholder="Write your professional summary here..."
              className="min-h-[200px] text-base resize-y bg-zinc-50 dark:bg-zinc-900/50"
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
