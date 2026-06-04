"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SkillsForm() {
  const { data, updateSkills, updatePersonalInfo } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("Mid Level");
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      updateSkills([...data.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateSkills(data.skills.filter((skill) => skill !== skillToRemove));
  };

  const generateSkills = async () => {
    if (!data.personalInfo.title) {
      alert("Please enter a Target Job Title first.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.personalInfo.title,
          experienceLevel,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.skills) {
        // Merge with existing avoiding duplicates
        const generatedSkills = result.data.skills;
        const newSkillsList = [...new Set([...data.skills, ...generatedSkills])];
        updateSkills(newSkillsList);
      } else {
        alert("Failed to generate skills. Please try again.");
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
          Technical Skills
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          List your technical skills, programming languages, and tools.
        </p>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
            AI Generator
          </CardTitle>
          <CardDescription>
            Let our AI suggest the best technical skills for your role.
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
              </select>
            </div>
          </div>
          
          <Button 
            onClick={generateSkills} 
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
                Auto-generate Skills
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
            <Input
              placeholder="Type a skill and press Enter..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900/50"
            />
            <Button type="submit" variant="secondary" disabled={!newSkill.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
            {data.skills.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-sm text-zinc-500">
                No skills added yet. Add some above or generate with AI.
              </div>
            ) : (
              <AnimatePresence>
                {data.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-zinc-400 hover:text-white dark:text-zinc-500 dark:hover:text-zinc-900 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
