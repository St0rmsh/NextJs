"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Personal Information
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Let's start with your basic details. This will be the header of your resume.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Software Engineer"
              value={personalInfo.title}
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
              className="bg-zinc-50 dark:bg-zinc-900/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Jane Doe"
                value={personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                className="bg-zinc-50 dark:bg-zinc-900/50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                className="bg-zinc-50 dark:bg-zinc-900/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                className="bg-zinc-50 dark:bg-zinc-900/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                className="bg-zinc-50 dark:bg-zinc-900/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Links</CardTitle>
          <CardDescription>Add your professional profiles</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/janedoe"
              value={personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              className="bg-zinc-50 dark:bg-zinc-900/50"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              placeholder="github.com/janedoe"
              value={personalInfo.github}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
              className="bg-zinc-50 dark:bg-zinc-900/50"
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <Input
              id="portfolio"
              placeholder="janedoe.com"
              value={personalInfo.portfolio}
              onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
              className="bg-zinc-50 dark:bg-zinc-900/50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
