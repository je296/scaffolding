"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SignOutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
      setProgress((prev) => prev + 20);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
        {/* Success icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Signed Out Successfully
          </h1>
          <p className="text-zinc-400 text-lg">
            You have been securely signed out of your account.
          </p>
        </div>

        {/* Countdown */}
        <div className="space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-zinc-300">
            <LogOut className="w-5 h-5" />
            <span>Redirecting to login in</span>
          </div>
          
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tabular-nums">
            {countdown}
          </div>
          
          <Progress value={progress} className="h-2 bg-zinc-800" />
          
          <p className="text-sm text-zinc-500">
            seconds remaining
          </p>
        </div>

        {/* Manual redirect button */}
        <Button
          onClick={() => router.push("/login")}
          variant="outline"
          className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white"
        >
          Go to Login Now
        </Button>

        {/* Footer note */}
        <p className="text-xs text-zinc-600">
          For security, please close this browser tab if you&apos;re on a shared device.
        </p>
      </div>
    </div>
  );
}
