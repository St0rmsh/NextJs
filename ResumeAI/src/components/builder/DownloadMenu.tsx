"use client";

import { useState } from "react";
import { Download, FileText, FileJson, FileType, Printer, ChevronDown } from "lucide-react";
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

export function DownloadMenu() {
  const { data } = useResumeStore();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      printResume();
      setIsPrinting(false);
    }, 150);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button disabled={isPrinting} />}>
        <Download className="mr-2 h-4 w-4" />
        Export
        <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          <div className="flex flex-col">
            <span>PDF (Print)</span>
            <span className="text-xs text-zinc-500">Opens print dialog</span>
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