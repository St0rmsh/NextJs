import { AuthMarketing } from "@/components/auth/AuthMarketing";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950 selection:bg-emerald-500/30">
      <AuthMarketing />
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-hidden">
        {/* Subtle background glow for the right side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-[420px] relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
