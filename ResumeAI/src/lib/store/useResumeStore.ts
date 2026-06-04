import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeData, initialResumeData } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface ResumeState {
  data: ResumeData;
  activeStep: number;
  completionPercentage: number;
  
  // Actions
  setActiveStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: string[]) => void;
  
  // Array operations
  addExperience: (exp: Omit<ResumeData["experience"][0], "id">) => void;
  updateExperience: (id: string, exp: Partial<ResumeData["experience"][0]>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (newOrder: ResumeData["experience"]) => void;

  addProject: (proj: Omit<ResumeData["projects"][0], "id">) => void;
  updateProject: (id: string, proj: Partial<ResumeData["projects"][0]>) => void;
  removeProject: (id: string) => void;
  
  addEducation: (edu: Omit<ResumeData["education"][0], "id">) => void;
  updateEducation: (id: string, edu: Partial<ResumeData["education"][0]>) => void;
  removeEducation: (id: string) => void;

  addCertification: (cert: Omit<ResumeData["certifications"][0], "id">) => void;
  updateCertification: (id: string, cert: Partial<ResumeData["certifications"][0]>) => void;
  removeCertification: (id: string) => void;

  calculateCompletion: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      data: initialResumeData,
      activeStep: 1,
      completionPercentage: 0,

      setActiveStep: (step) => set({ activeStep: step }),

      updatePersonalInfo: (info) => {
        set((state) => ({
          data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } },
        }));
        get().calculateCompletion();
      },

      updateSummary: (summary) => {
        set((state) => ({ data: { ...state.data, summary } }));
        get().calculateCompletion();
      },

      updateSkills: (skills) => {
        set((state) => ({ data: { ...state.data, skills } }));
        get().calculateCompletion();
      },

      addExperience: (exp) => {
        set((state) => ({
          data: {
            ...state.data,
            experience: [...state.data.experience, { ...exp, id: uuidv4() }],
          },
        }));
        get().calculateCompletion();
      },

      updateExperience: (id, updatedExp) => {
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) =>
              e.id === id ? { ...e, ...updatedExp } : e
            ),
          },
        }));
      },

      removeExperience: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((e) => e.id !== id),
          },
        }));
        get().calculateCompletion();
      },

      reorderExperience: (newOrder) => {
        set((state) => ({
          data: {
            ...state.data,
            experience: newOrder,
          },
        }));
      },

      addProject: (proj) => {
        set((state) => ({
          data: {
            ...state.data,
            projects: [...state.data.projects, { ...proj, id: uuidv4() }],
          },
        }));
        get().calculateCompletion();
      },

      updateProject: (id, updatedProj) => {
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((p) =>
              p.id === id ? { ...p, ...updatedProj } : p
            ),
          },
        }));
      },

      removeProject: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter((p) => p.id !== id),
          },
        }));
        get().calculateCompletion();
      },

      addEducation: (edu) => {
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, { ...edu, id: uuidv4() }],
          },
        }));
        get().calculateCompletion();
      },

      updateEducation: (id, updatedEdu) => {
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((e) =>
              e.id === id ? { ...e, ...updatedEdu } : e
            ),
          },
        }));
      },

      removeEducation: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        }));
        get().calculateCompletion();
      },

      addCertification: (cert) => {
        set((state) => ({
          data: {
            ...state.data,
            certifications: [...state.data.certifications, { ...cert, id: uuidv4() }],
          },
        }));
        get().calculateCompletion();
      },

      updateCertification: (id, updatedCert) => {
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.map((c) =>
              c.id === id ? { ...c, ...updatedCert } : c
            ),
          },
        }));
      },

      removeCertification: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.filter((c) => c.id !== id),
          },
        }));
        get().calculateCompletion();
      },

      calculateCompletion: () => {
        const { data } = get();
        let score = 0;
        let total = 7; // Number of major sections

        if (data.personalInfo.fullName && data.personalInfo.email) score++;
        if (data.summary.length > 20) score++;
        if (data.skills.length > 2) score++;
        if (data.experience.length > 0) score++;
        if (data.projects.length > 0) score++;
        if (data.education.length > 0) score++;
        if (data.certifications.length > 0) score++;

        set({ completionPercentage: Math.round((score / total) * 100) });
      },
    }),
    {
      name: "resume-storage",
    }
  )
);
