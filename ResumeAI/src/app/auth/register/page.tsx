"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const password = watch("password", "");
  const acceptTerms = watch("acceptTerms");

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = calculateStrength(password);
  
  const strengthText = ["Poor", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "bg-zinc-200 dark:bg-zinc-800",
    "bg-red-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-emerald-500",
  ][strength];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      router.push("/builder");
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create an account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your details to get started with ResumeAI
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            
            <div className="grid gap-2">
              <Label htmlFor="username">Full Name</Label>
              <Input
                id="username"
                placeholder="John Doe"
                disabled={isLoading}
                {...register("username")}
                className={cn(errors.username && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number (Optional)</Label>
              <Input
                id="mobile"
                placeholder="+1 234 567 8900"
                type="tel"
                disabled={isLoading}
                {...register("mobile")}
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  {...register("password")}
                  className={cn(
                    "pr-10",
                    errors.password && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Password strength</span>
                    <span className={cn(
                      "font-medium",
                      strength === 4 ? "text-emerald-500" : strength >= 2 ? "text-amber-500" : "text-zinc-500"
                    )}>{strengthText}</span>
                  </div>
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "flex-1 rounded-full transition-all duration-300",
                          strength >= level ? strengthColor : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={isLoading}
                  {...register("confirmPassword")}
                  className={cn(
                    "pr-10",
                    errors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start space-x-2 mt-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean, { shouldValidate: true })}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal text-zinc-500 dark:text-zinc-400 cursor-pointer"
                >
                  I accept the{" "}
                  <Link href="/terms" className="text-emerald-600 hover:text-emerald-500">
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-emerald-600 hover:text-emerald-500">
                    privacy policy
                  </Link>.
                </Label>
                {errors.acceptTerms && <p className="text-xs text-red-500 mt-1">{errors.acceptTerms.message}</p>}
              </div>
            </div>

            {apiError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {apiError}
              </div>
            )}

            <Button disabled={isLoading} className="w-full mt-2 group relative overflow-hidden">
              <span className={cn("transition-all duration-200 flex items-center justify-center", isLoading ? "opacity-0" : "opacity-100")}>
                Create Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
                  </motion.div>
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">
              Or sign up with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" disabled={isLoading} className="bg-white dark:bg-zinc-950">
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" disabled={isLoading} className="bg-white dark:bg-zinc-950">
            {/* <Github className="mr-2 h-4 w-4" /> */}
            GitHub
          </Button>
        </div>
      </div>
      <p className="px-8 text-center text-sm text-zinc-500 mt-6 pb-8">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
