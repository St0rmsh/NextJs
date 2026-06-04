import { BuilderHeader } from "@/components/builder/Header";
import { BuilderSidebar } from "@/components/builder/Sidebar";
import { ResumePreview } from "@/components/preview/ResumePreview";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <BuilderHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <BuilderSidebar />
        
        {/* Center Workspace */}
        <main className="flex-1 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        {/* Right Panel - Preview */}
        <aside className="hidden xl:block w-[45%] bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
          <ResumePreview />
        </aside>
      </div>
    </div>
  );
}
