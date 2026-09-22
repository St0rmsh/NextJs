"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsForm() {
  const {
    data,
    addProject,
    updateProject,
    removeProject,
  } = useResumeStore();

  const [generatingId, setGeneratingId] = useState<string | null>(
    null
  );

  const handleAddProject = () => {
    addProject({
      name: "",
      url: "",
      githubUrl: "",
      techStack: [],
      description: [""],
    });
  };

  const handleGenerateDescription = async (
    projectId: string
  ) => {
    const project = data.projects.find(
      (proj) => proj.id === projectId
    );

    if (!project) return;

    if (!project.name.trim()) {
      alert("Please enter the project name first.");
      return;
    }

    try {
      setGeneratingId(projectId);

      const response = await fetch(
        "/api/ai/generate-project-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: project.name,
            projectUrl: project.url,
            jobTitle:
              data.personalInfo.title || "Software Engineer",
            experienceLevel: "Mid Level",
            techStack:
              project.techStack.length > 0
                ? project.techStack
                : data.skills,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let result;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text || "Invalid response from AI service."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to generate project description."
        );
      }

      const descriptions =
        result?.data?.projectDescription?.descriptions ||
        result?.descriptions;

      if (
        !Array.isArray(descriptions) ||
        descriptions.length === 0
      ) {
        throw new Error(
          "AI did not return a valid project description."
        );
      }

      updateProject(projectId, {
        description: descriptions,
      });
    } catch (error) {
      console.error(
        "Project description generation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate project description."
      );
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Projects
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your projects, live links, GitHub repositories,
            technologies, and descriptions.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddProject}
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Projects */}
      <AnimatePresence mode="popLayout">
        {data.projects.map((proj, index) => (
          <motion.div
            key={proj.id}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
          >
            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Project Header */}
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium">
                    Project {index + 1}
                  </h3>

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      removeProject(proj.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Project Name */}
                <div className="grid gap-2">
                  <Label>Project Name</Label>

                  <Input
                    value={proj.name}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        name: e.target.value,
                      })
                    }
                    placeholder="Zentro"
                    className="bg-zinc-50 dark:bg-zinc-900/50"
                  />
                </div>

                {/* URLs */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Live Project URL */}
                  <div className="grid gap-2">
                    <Label>
                      Live Project URL (Optional)
                    </Label>

                    <Textarea
                      value={proj.url}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          url: e.target.value,
                        })
                      }
                      placeholder="https://your-project.vercel.app"
                      className="min-h-[80px] resize-y bg-zinc-50 dark:bg-zinc-900/50"
                    />

                    <p className="text-xs text-zinc-400">
                      URL of the deployed/live application.
                    </p>
                  </div>

                  {/* GitHub URL */}
                  <div className="grid gap-2">
                    <Label>
                      GitHub Repository URL (Optional)
                    </Label>

                    <Textarea
                      value={proj.githubUrl || ""}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          githubUrl: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username/project"
                      className="min-h-[80px] resize-y bg-zinc-50 dark:bg-zinc-900/50"
                    />

                    <p className="text-xs text-zinc-400">
                      URL of the project's GitHub repository.
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="grid gap-2">
                  <Label>Tech Stack</Label>

                  <Input
                    value={proj.techStack.join(", ")}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        techStack: e.target.value
                          .split(",")
                          .map((tech) => tech.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="React, TypeScript, Node.js, MongoDB"
                    className="bg-zinc-50 dark:bg-zinc-900/50"
                  />

                  <p className="text-xs text-zinc-400">
                    Separate technologies with commas.
                  </p>
                </div>

                {/* Description */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <Label>Project Description</Label>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleGenerateDescription(proj.id)
                      }
                      disabled={
                        generatingId === proj.id
                      }
                    >
                      {generatingId === proj.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {proj.description.map(
                      (description, descriptionIndex) => (
                        <div
                          key={descriptionIndex}
                          className="flex gap-2"
                        >
                          <Textarea
                            value={description}
                            onChange={(e) => {
                              const updatedDescription = [
                                ...proj.description,
                              ];

                              updatedDescription[
                                descriptionIndex
                              ] = e.target.value;

                              updateProject(proj.id, {
                                description:
                                  updatedDescription,
                              });
                            }}
                            placeholder="Describe what you built, the technologies used, and the impact."
                            className="min-h-[90px] resize-y bg-zinc-50 dark:bg-zinc-900/50"
                          />

                          {proj.description.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updatedDescription =
                                  proj.description.filter(
                                    (_, i) =>
                                      i !== descriptionIndex
                                  );

                                updateProject(proj.id, {
                                  description:
                                    updatedDescription,
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() =>
                      updateProject(proj.id, {
                        description: [
                          ...proj.description,
                          "",
                        ],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Description
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty State */}
      {data.projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No projects added yet.
            </p>

            <Button
              type="button"
              onClick={handleAddProject}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}