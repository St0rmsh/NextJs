"use client";

import { useMemo, useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Sparkles,
  Loader2,
  X,
  Plus,
  Check,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  SKILL_CATEGORIES,
  normalizeSkill,
  getSkillKey,
} from "@/lib/resume/skillCategories";

/* =========================================================
   COMPONENT
   ========================================================= */

export function SkillsForm() {
  const {
    data,
    updateSkills,
    updatePersonalInfo,
  } = useResumeStore();

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [experienceLevel, setExperienceLevel] =
    useState("Mid Level (3-5 years)");

  const [newSkill, setNewSkill] =
    useState("");

  /* =======================================================
     SELECTED SKILLS
     ======================================================= */

  const selectedSkills = useMemo(() => {
    return new Set(
      (data.skills || [])
        .filter((skill) => skill?.trim())
        .map((skill) => getSkillKey(skill))
    );
  }, [data.skills]);

  /* =======================================================
     TOGGLE SKILL
     ======================================================= */

  const toggleSkill = (skill: string) => {
    const normalized =
      normalizeSkill(skill);

    const key =
      getSkillKey(normalized);

    const currentSkills =
      data.skills || [];

    const exists =
      currentSkills.some(
        (item) =>
          getSkillKey(item) === key
      );

    if (exists) {
      updateSkills(
        currentSkills.filter(
          (item) =>
            getSkillKey(item) !== key
        )
      );

      return;
    }

    updateSkills([
      ...currentSkills,
      normalized,
    ]);
  };

  /* =======================================================
     ADD CUSTOM SKILL
     ======================================================= */

  const handleAddSkill = (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    const value =
      newSkill.trim();

    if (!value) {
      return;
    }

    const normalized =
      normalizeSkill(value);

    const key =
      getSkillKey(normalized);

    const exists =
      (data.skills || []).some(
        (skill) =>
          getSkillKey(skill) === key
      );

    if (exists) {
      setNewSkill("");
      return;
    }

    updateSkills([
      ...(data.skills || []),
      normalized,
    ]);

    setNewSkill("");
  };

  /* =======================================================
     REMOVE SKILL
     ======================================================= */

  const removeSkill = (
    skillToRemove: string
  ) => {
    const key =
      getSkillKey(skillToRemove);

    updateSkills(
      (data.skills || []).filter(
        (skill) =>
          getSkillKey(skill) !== key
      )
    );
  };

  /* =======================================================
     AI GENERATION
     ======================================================= */

  const generateSkills = async () => {
    if (!data.personalInfo.title?.trim()) {
      alert(
        "Please enter a Target Job Title first."
      );

      return;
    }

    setIsGenerating(true);

    try {
      const response =
        await fetch(
          "/api/ai/generate-skills",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              jobTitle:
                data.personalInfo.title,

              experienceLevel,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const result =
        await response.json();

      if (
        result.success &&
        Array.isArray(
          result.data?.skills
        )
      ) {
        const generatedSkills =
          result.data.skills
            .filter(
              (skill: unknown) =>
                typeof skill ===
                  "string" &&
                skill.trim()
            )
            .map(
              (skill: string) =>
                normalizeSkill(skill)
            );

        const merged =
          new Map<string, string>();

        // Existing skills
        for (const skill of
          data.skills || []) {
          const normalized =
            normalizeSkill(skill);

          merged.set(
            getSkillKey(normalized),
            normalized
          );
        }

        // AI generated skills
        for (const skill of
          generatedSkills) {
          merged.set(
            getSkillKey(skill),
            skill
          );
        }

        updateSkills(
          Array.from(
            merged.values()
          )
        );
      } else {
        alert(
          "Failed to generate skills. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Skill generation error:",
        error
      );

      alert(
        "An error occurred while generating skills."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
         =================================================== */}

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Technical Skills
        </h2>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select relevant skills by category. Keep only
          skills you can confidently discuss in an interview.
        </p>
      </div>

      {/* ===================================================
          AI GENERATOR
         =================================================== */}

      <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />

            AI Generator
          </CardTitle>

          <CardDescription>
            Generate relevant technical skills based on
            your target role and experience level.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* JOB TITLE */}

            <div className="grid gap-2">
              <Label htmlFor="jobTitle">
                Target Job Title
              </Label>

              <Input
                id="jobTitle"
                value={
                  data.personalInfo.title ||
                  ""
                }
                onChange={(e) =>
                  updatePersonalInfo({
                    title:
                      e.target.value,
                  })
                }
                className="bg-white dark:bg-zinc-900"
                placeholder="e.g. Full Stack Developer"
              />
            </div>

            {/* EXPERIENCE */}

            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">
                Experience Level
              </Label>

              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(
                    e.target.value
                  )
                }
                className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="Entry Level (0-2 years)">
                  Entry Level (0-2 years)
                </option>

                <option value="Mid Level (3-5 years)">
                  Mid Level (3-5 years)
                </option>

                <option value="Senior Level (5-10 years)">
                  Senior Level (5-10 years)
                </option>
              </select>
            </div>
          </div>

          <Button
            type="button"
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

      {/* ===================================================
          SKILL SELECTOR
         =================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Select Your Skills
          </CardTitle>

          <CardDescription>
            Choose the technologies that match your
            experience and target position.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-7">
          {Object.entries(
            SKILL_CATEGORIES
          ).map(
            ([category, skills]) => {
              const selectedCount =
                skills.filter(
                  (skill) =>
                    selectedSkills.has(
                      getSkillKey(skill)
                    )
                ).length;

              return (
                <div
                  key={category}
                  className="space-y-3"
                >
                  {/* CATEGORY HEADER */}

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-800 dark:text-zinc-200">
                      {category}
                    </h3>

                    <span className="text-xs text-zinc-400">
                      {selectedCount} selected
                    </span>
                  </div>

                  {/* SKILLS */}

                  <div className="flex flex-wrap gap-2">
                    {skills.map(
                      (skill) => {
                        const selected =
                          selectedSkills.has(
                            getSkillKey(
                              skill
                            )
                          );

                        return (
                          <motion.button
                            key={skill}
                            type="button"
                            whileTap={{
                              scale: 0.97,
                            }}
                            onClick={() =>
                              toggleSkill(
                                skill
                              )
                            }
                            className={[
                              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                              selected
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                                : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30",
                            ].join(" ")}
                          >
                            {selected && (
                              <Check className="h-3.5 w-3.5" />
                            )}

                            {skill}
                          </motion.button>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </CardContent>
      </Card>

      {/* ===================================================
          CUSTOM SKILL
         =================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Add Custom Skill
          </CardTitle>

          <CardDescription>
            Add a technology that isn't listed above.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={
              handleAddSkill
            }
            className="flex gap-2"
          >
            <Input
              placeholder="e.g. Elasticsearch"
              value={newSkill}
              onChange={(e) =>
                setNewSkill(
                  e.target.value
                )
              }
              className="bg-zinc-50 dark:bg-zinc-900/50"
            />

            <Button
              type="submit"
              variant="secondary"
              disabled={
                !newSkill.trim()
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ===================================================
          SELECTED SKILLS
         =================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Selected Skills
          </CardTitle>

          <CardDescription>
            These skills will appear on your resume.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="min-h-[100px] rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
            {!data.skills ||
            data.skills.length === 0 ? (
              <div className="flex min-h-[70px] items-center justify-center text-sm text-zinc-500">
                No skills selected yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {data.skills.map(
                    (skill) => {
                      const normalized =
                        normalizeSkill(
                          skill
                        );

                      return (
                        <motion.span
                          key={normalized}
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          transition={{
                            duration: 0.15,
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                        >
                          {normalized}

                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(
                                skill
                              )
                            }
                            aria-label={`Remove ${normalized}`}
                            className="ml-1 rounded p-0.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white dark:text-zinc-500 dark:hover:bg-black/10 dark:hover:text-zinc-900"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </motion.span>
                      );
                    }
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}