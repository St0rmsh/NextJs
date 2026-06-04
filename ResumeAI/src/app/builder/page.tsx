"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { PersonalInfoForm } from "@/components/builder/forms/PersonalInfoForm";
import { SummaryForm } from "@/components/builder/forms/SummaryForm";
import { SkillsForm } from "@/components/builder/forms/SkillsForm";
import { ExperienceForm } from "@/components/builder/forms/ExperienceForm";
import { ProjectsForm } from "@/components/builder/forms/ProjectsForm";
import { EducationForm } from "@/components/builder/forms/EducationForm";
import { CertificationsForm } from "@/components/builder/forms/CertificationsForm";
import { ATSAnalysis } from "@/components/builder/forms/ATSAnalysis";
import { motion, AnimatePresence } from "framer-motion";

export default function BuilderPage() {
  const { activeStep } = useResumeStore();

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <SummaryForm />;
      case 3:
        return <SkillsForm />;
      case 4:
        return <ExperienceForm />;
      case 5:
        return <ProjectsForm />;
      case 6:
        return <EducationForm />;
      case 7:
        return <CertificationsForm />;
      case 8:
        return <ATSAnalysis />;
      case 9:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-3xl font-bold text-emerald-600 mb-4">You're All Set!</h2>
            <p className="text-zinc-600 mb-8 max-w-md">
              Review your resume in the right panel. When you are ready, click Export PDF in the header.
            </p>
          </div>
        );
      default:
        return (
          <div className="flex h-[400px] items-center justify-center text-zinc-500">
            Section under construction
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
