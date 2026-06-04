"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience, reorderExperience } = useResumeStore();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAddExperience = () => {
    addExperience({
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    });
  };

  const generateDescription = async (expId: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp || !exp.role) {
      alert("Please enter a job role first.");
      return;
    }

    setGeneratingId(expId);
    try {
      const response = await fetch("/api/ai/generate-experience-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: exp.role,
          experienceLevel: "Mid Level", // Could be dynamic
          yearsOfExperience: 3,
          techStack: data.skills.length > 0 ? data.skills : ["General"],
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.workExperienceDescription?.descriptions) {
        updateExperience(expId, { 
          description: result.data.workExperienceDescription.descriptions 
        });
      } else {
        alert("Failed to generate description. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating.");
    } finally {
      setGeneratingId(null);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...data.experience];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    reorderExperience(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === data.experience.length - 1) return;
    const newOrder = [...data.experience];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderExperience(newOrder);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Work Experience
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Add your relevant experience. Use AI to generate bullet points.
          </p>
        </div>
        <Button onClick={handleAddExperience} className="gap-2">
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>

      <AnimatePresence>
        {data.experience.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500"
          >
            <p>No experience added yet. Click the button above to start.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => moveUp(index)} disabled={index === 0}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => moveDown(index)} disabled={index === data.experience.length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="grid gap-2">
                        <Label>Job Title / Role</Label>
                        <Input
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          placeholder="e.g. Frontend Engineer"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Company Name</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="e.g. Google"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          placeholder="MMM YYYY"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            value={exp.current ? "Present" : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="MMM YYYY"
                            disabled={exp.current}
                            className="bg-zinc-50 dark:bg-zinc-900/50 flex-1"
                          />
                          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 shrink-0 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
                            />
                            Current
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                      <div className="flex justify-between items-center">
                        <Label>Description Bullet Points</Label>
                        <Button 
                          onClick={() => generateDescription(exp.id)} 
                          disabled={generatingId === exp.id}
                          variant="secondary"
                          size="sm"
                          className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
                        >
                          {generatingId === exp.id ? (
                            <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Generating...</>
                          ) : (
                            <><Sparkles className="mr-2 h-3.5 w-3.5" /> Generate with AI</>
                          )}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {exp.description.map((desc, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                            <Textarea
                              value={desc}
                              onChange={(e) => {
                                const newDesc = [...exp.description];
                                newDesc[i] = e.target.value;
                                updateExperience(exp.id, { description: newDesc });
                              }}
                              className="min-h-[60px] flex-1 bg-zinc-50 dark:bg-zinc-900/50 resize-y"
                              placeholder="Describe your achievements..."
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 shrink-0 text-zinc-400 hover:text-red-500"
                              onClick={() => {
                                const newDesc = exp.description.filter((_, idx) => idx !== i);
                                updateExperience(exp.id, { description: newDesc.length ? newDesc : [""] });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            updateExperience(exp.id, { description: [...exp.description, ""] });
                          }}
                          className="mt-2 text-zinc-500"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Bullet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
