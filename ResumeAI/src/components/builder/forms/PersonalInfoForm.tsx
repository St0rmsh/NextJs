"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;

  return (
    <div className="space-y-5">
      {/* Professional Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Professional Title
        </label>

        <input
          id="title"
          type="text"
          value={personalInfo.title || ""}
          onChange={(e) =>
            updatePersonalInfo({
              title: e.target.value,
            })
          }
          placeholder="Full Stack Developer"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Full Name
        </label>

        <input
          id="fullName"
          type="text"
          value={personalInfo.fullName || ""}
          onChange={(e) =>
            updatePersonalInfo({
              fullName: e.target.value,
            })
          }
          placeholder="John Doe"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={personalInfo.email || ""}
          onChange={(e) =>
            updatePersonalInfo({
              email: e.target.value,
            })
          }
          placeholder="john@example.com"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          value={personalInfo.phone || ""}
          onChange={(e) =>
            updatePersonalInfo({
              phone: e.target.value,
            })
          }
          placeholder="+91 9876543210"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Location
        </label>

        <input
          id="location"
          type="text"
          value={personalInfo.location || ""}
          onChange={(e) =>
            updatePersonalInfo({
              location: e.target.value,
            })
          }
          placeholder="Assam, India"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* LinkedIn */}
      <div className="space-y-2">
        <label
          htmlFor="linkedin"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          LinkedIn URL
        </label>

        <input
          id="linkedin"
          type="url"
          value={personalInfo.linkedin || ""}
          onChange={(e) =>
            updatePersonalInfo({
              linkedin: e.target.value,
            })
          }
          placeholder="linkedin.com/in/janedoe"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* GitHub */}
      <div className="space-y-2">
        <label
          htmlFor="github"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          GitHub URL
        </label>

        <input
          id="github"
          type="url"
          value={personalInfo.github || ""}
          onChange={(e) =>
            updatePersonalInfo({
              github: e.target.value,
            })
          }
          placeholder="github.com/janedoe"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Portfolio */}
      <div className="space-y-2">
        <label
          htmlFor="portfolio"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Portfolio / Website
        </label>

        <input
          id="portfolio"
          type="url"
          value={personalInfo.portfolio || ""}
          onChange={(e) =>
            updatePersonalInfo({
              portfolio: e.target.value,
            })
          }
          placeholder="janedoe.com"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
    </div>
  );
}