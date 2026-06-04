"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();

  const handleAddEducation = () => {
    addEducation({
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      cgpa: "",
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Education
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Add your educational background.
          </p>
        </div>
        <Button onClick={handleAddEducation} className="gap-2">
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      </div>

      <AnimatePresence>
        {data.education.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500"
          >
            <p>No education added yet. Click the button above to start.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <motion.div
                key={edu.id}
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
                        <span className="text-sm text-zinc-400 font-medium">Education {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Institution / University</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          placeholder="e.g. Stanford University"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="e.g. Bachelor of Science"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          placeholder="e.g. Computer Science"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>CGPA / Grade (Optional)</Label>
                        <Input
                          value={edu.cgpa}
                          onChange={(e) => updateEducation(edu.id, { cgpa: e.target.value })}
                          placeholder="e.g. 3.8/4.0"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Start Year</Label>
                        <Input
                          value={edu.startYear}
                          onChange={(e) => updateEducation(edu.id, { startYear: e.target.value })}
                          placeholder="YYYY"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>End Year (or Expected)</Label>
                        <Input
                          value={edu.endYear}
                          onChange={(e) => updateEducation(edu.id, { endYear: e.target.value })}
                          placeholder="YYYY"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
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
