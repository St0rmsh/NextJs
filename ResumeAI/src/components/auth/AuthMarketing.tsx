"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, FileText, BarChart } from "lucide-react";

export function AuthMarketing() {
  return (
    <div className="relative hidden lg:flex flex-col w-[60%] bg-zinc-950 dark:bg-zinc-950 overflow-hidden text-zinc-50 p-12 lg:p-24 border-r border-zinc-800">
      {/* Background abstract gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-600/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">ResumeAI</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Build a Resume <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Recruiters Actually Want to Read
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
            Create ATS-friendly resumes, improve content with AI, and stand out in
            competitive job markets with our intelligent platform.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 mt-20">
          {[
            {
              title: "AI Resume Writer",
              description: "Generate professional content tailored to your target role instantly.",
              icon: <FileText className="h-6 w-6 text-emerald-400" />,
            },
            {
              title: "ATS Optimization",
              description: "Ensure your resume passes automated screening systems.",
              icon: <CheckCircle2 className="h-6 w-6 text-emerald-400" />,
            },
            {
              title: "Smart Analytics",
              description: "Get a detailed breakdown of your resume's strengths and weaknesses.",
              icon: <BarChart className="h-6 w-6 text-teal-400" />,
            },
            {
              title: "Instant Feedback",
              description: "Receive actionable suggestions to improve your impact.",
              icon: <Sparkles className="h-6 w-6 text-teal-400" />,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-zinc-100 font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Floating Mock Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute right-[-10%] top-[30%] w-[380px] p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <BarChart className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">ATS Score Analysis</p>
                <p className="text-xs text-emerald-400">Excellent</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-zinc-100">94<span className="text-lg text-zinc-500">/100</span></div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Keyword Match", score: "98%" },
              { label: "Formatting", score: "100%" },
              { label: "Impact Metrics", score: "85%" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-400">{stat.label}</span>
                  <span className="text-zinc-100">{stat.score}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: stat.score }}
                    transition={{ duration: 1, delay: 1 + i * 0.2 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
