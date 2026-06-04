"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification } = useResumeStore();

  const handleAddCertification = () => {
    addCertification({
      name: "",
      organization: "",
      issueDate: "",
      url: "",
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Certifications
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            List your professional certifications and licenses.
          </p>
        </div>
        <Button onClick={handleAddCertification} className="gap-2">
          <Plus className="h-4 w-4" /> Add Certification
        </Button>
      </div>

      <AnimatePresence>
        {data.certifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-500"
          >
            <p>No certifications added yet. Click the button above to start.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {data.certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
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
                        <span className="text-sm text-zinc-400 font-medium">Certification {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => removeCertification(cert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Issuing Organization</Label>
                        <Input
                          value={cert.organization}
                          onChange={(e) => updateCertification(cert.id, { organization: e.target.value })}
                          placeholder="e.g. Amazon Web Services"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Issue Date</Label>
                        <Input
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })}
                          placeholder="MMM YYYY"
                          className="bg-zinc-50 dark:bg-zinc-900/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Credential URL (Optional)</Label>
                        <Input
                          value={cert.url}
                          onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                          placeholder="https://..."
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
