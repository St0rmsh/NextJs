export interface PersonalInfo {
  title: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  url: string;
  githubUrl: string;
  techStack: string[];
  description: string[];
}
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  cgpa: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  url: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    title: "Software Engineer",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
};
