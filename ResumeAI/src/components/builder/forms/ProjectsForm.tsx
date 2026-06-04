"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAddProject = () => {
    addProject({
      name: "",
      url: "",
      techStack: [],
      description: [""],
    });
  };

  const generateDescription = async (projId: string) => {
    const proj = data.projects.find(p => p.id === projId);
    if (!proj || !proj.name) {
      alert("Please enter a project name first.");
      return;
    }

    setGeneratingId(projId);
    try {
      // Mocking project description generation since we don't have a specific endpoint yet
      // using the summary endpoint as a fallback or simulating it
      const response = await fetch("/api/ai/genearte-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: `Developer for ${proj.name}`,
          experienceLevel: "Mid Level",
          skills: proj.techStack.length > 0 ? proj.techStack : data.skills,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.summary?.summary) {
        updateProject(projId, { 
          description: [result.data.summary.summary] // API returns a paragraph, we put it in array
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Projects
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Highlight your best work and personal projects.
          </p>
        </div>
        <Button onClick={handleAddProject} className="gap-2">
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      <AnimatePresence>
        {data.projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500"
          >
            <p>No projects added yet. Click the button above to start.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {data.projects.map((proj, index) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm text-zinc-400 font-medium">Project {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => removeProject(proj.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Project Name</Label>
                        <Input
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                          placeholder="e.g. E-Commerce Platform"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Project URL (Optional)</Label>
                        <Input
                          value={proj.url}
                          onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                          placeholder="e.g. github.com/user/project"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tech Stack (Comma separated)</Label>
                        <Input
                          value={proj.techStack.join(", ")}
                          onChange={(e) => updateProject(proj.id, { techStack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                          placeholder="e.g. React, Node.js, MongoDB"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                      <div className="flex justify-between items-center">
                        <Label>Description</Label>
                        <Button 
                          onClick={() => generateDescription(proj.id)} 
                          disabled={generatingId === proj.id}
                          variant="secondary"
                          size="sm"
                          className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
                        >
                          {generatingId === proj.id ? (
                            <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Generating...</>
                          ) : (
                            <><Sparkles className="mr-2 h-3.5 w-3.5" /> Generate with AI</>
                          )}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {proj.description.map((desc, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                            <Textarea
                              value={desc}
                              onChange={(e) => {
                                const newDesc = [...proj.description];
                                newDesc[i] = e.target.value;
                                updateProject(proj.id, { description: newDesc });
                              }}
                              className="min-h-[60px] flex-1 bg-zinc-50 dark:bg-zinc-900/50 resize-y"
                              placeholder="Describe your project..."
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 shrink-0 text-zinc-400 hover:text-red-500"
                              onClick={() => {
                                const newDesc = proj.description.filter((_, idx) => idx !== i);
                                updateProject(proj.id, { description: newDesc.length ? newDesc : [""] });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            updateProject(proj.id, { description: [...proj.description, ""] });
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
