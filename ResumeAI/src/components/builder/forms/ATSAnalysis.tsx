"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export function ATSAnalysis() {
  const { data } = useResumeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    atsScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } | null>(null);

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      // Mocking resume text concatenation
      const resumeText = `
        ${data.personalInfo.fullName}
        ${data.personalInfo.title}
        ${data.summary}
        Skills: ${data.skills.join(", ")}
        Experience: ${data.experience.map(e => `${e.role} at ${e.company}. ${e.description.join(" ")}`).join("\n")}
        Education: ${data.education.map(e => `${e.degree} in ${e.field} from ${e.institution}`).join("\n")}
      `;

      const response = await fetch("/api/ai/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.atsScore) {
        setAtsResult(result.data.atsScore);
      } else {
        alert("Failed to analyze resume. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getScoreText = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          ATS Analysis
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Analyze your resume against common Applicant Tracking Systems.
        </p>
      </div>

      {!atsResult ? (
        <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
              <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-emerald-900 dark:text-emerald-50">
              Ready to analyze your resume?
            </h3>
            <p className="mb-8 max-w-[400px] text-sm text-emerald-700/80 dark:text-emerald-300/80">
              Our AI will evaluate your resume for ATS compatibility, keyword optimization, and overall structure.
            </p>
            <Button size="lg" onClick={analyzeResume} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Run ATS Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full border-[8px] border-zinc-100 dark:border-zinc-800">
                  {/* Pseudo circular progress visually */}
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                      className={getScoreText(atsResult.atsScore)}
                      strokeDasharray="289" // roughly 2*pi*r for r=46%
                      strokeDashoffset={289 - (289 * atsResult.atsScore) / 100}
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className={`text-5xl font-bold ${getScoreText(atsResult.atsScore)}`}>
                      {atsResult.atsScore}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">/ 100</span>
                  </div>
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {atsResult.atsScore >= 80 ? "Excellent!" : atsResult.atsScore >= 60 ? "Good, but can improve." : "Needs significant improvement."}
                </h3>
                <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
                  {atsResult.summary}
                </p>
                
                <Button variant="outline" className="mt-6" onClick={analyzeResume} disabled={isAnalyzing}>
                  {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Re-Analyze
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {atsResult.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-50/30 dark:bg-red-950/10">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2 text-lg">
                  <XCircle className="h-5 w-5" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {atsResult.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {atsResult.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {i + 1}
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{r}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
                    
      )}
                    
    </div>
  );
}
