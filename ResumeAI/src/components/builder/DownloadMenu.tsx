"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileJson,
  FileType,
  FileDown,
  Printer,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  printResume,
  downloadResumeMarkdown,
  downloadResumeText,
  downloadResumeJSON,
} from "@/lib/export/resumeExport";
import { downloadResumePDF } from "@/lib/export/generateResumePdf";

export function DownloadMenu() {
  const { data } = useResumeStore();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      printResume();
      setIsPrinting(false);
    }, 150);
  };

  const handlePdfDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      await downloadResumePDF(data);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const isBusy = isPrinting || isGeneratingPDF;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button disabled={isBusy} />}>
        <Download className="mr-2 h-4 w-4" />
        Export
        <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem
          onClick={handlePdfDownload}
          disabled={isGeneratingPDF}
          className="gap-2"
        >
          {isGeneratingPDF ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          <div className="flex flex-col">
            <span>PDF (.pdf)</span>
            <span className="text-xs text-zinc-500">
              Clickable links, downloads directly
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handlePrint}
          disabled={isPrinting}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          <div className="flex flex-col">
            <span>PDF (Print)</span>
            <span className="text-xs text-zinc-500">
              Opens print dialog — links may not be clickable
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => downloadResumeMarkdown(data)} className="gap-2">
          <FileText className="h-4 w-4" />
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadResumeText(data)} className="gap-2">
          <FileType className="h-4 w-4" />
          Plain Text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadResumeJSON(data)} className="gap-2">
          <FileJson className="h-4 w-4" />
          JSON (backup)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}