"use client";

import * as React from "react";
import { FileText, Chrome, Github, Mail, Building2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Microsoft icon component
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}

// Okta icon component
function OktaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.389 0 0 5.389 0 12s5.389 12 12 12 12-5.389 12-12S18.611 0 12 0zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
    </svg>
  );
}

const oauthProviders = [
  {
    id: "google",
    name: "Google",
    icon: Chrome,
    color: "hover:bg-white/10 hover:border-white/20",
    iconColor: "text-red-400",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    icon: MicrosoftIcon,
    color: "hover:bg-white/10 hover:border-white/20",
    iconColor: "",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    color: "hover:bg-white/10 hover:border-white/20",
    iconColor: "text-white",
  },
  {
    id: "okta",
    name: "Okta SSO",
    icon: OktaIcon,
    color: "hover:bg-white/10 hover:border-white/20",
    iconColor: "text-blue-400",
  },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = React.useState(false);

  const handleOAuthLogin = (providerId: string) => {
    setIsLoading(providerId);
    // Simulate OAuth redirect delay
    setTimeout(() => {
      setIsLoading(null);
      // In real implementation, this would redirect to OAuth provider
      alert(`OAuth login with ${providerId} - This is a mockup!`);
    }, 1500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading("email");
    setTimeout(() => {
      setIsLoading(null);
      alert("Email login - This is a mockup!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Documentum</h1>
              <p className="text-cyan-100 text-sm">Enterprise Document Management</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Secure. Organized.<br />
            <span className="text-cyan-200">Always accessible.</span>
          </h2>

          <p className="text-lg text-cyan-100 mb-8 max-w-md">
            Manage your documents with enterprise-grade security, version control, and seamless collaboration.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <KeyRound className="h-4 w-4" />
              </div>
              <span>Enterprise SSO & OAuth 2.0 Authentication</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Building2 className="h-4 w-4" />
              </div>
              <span>SOC 2 Type II Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Documentum</h1>
              <p className="text-xs text-muted-foreground">Enterprise Document Management</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {oauthProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start gap-3 border-white/10 bg-white/5 transition-all",
                  provider.color,
                  isLoading === provider.id && "opacity-70 pointer-events-none"
                )}
                onClick={() => handleOAuthLogin(provider.id)}
                disabled={isLoading !== null}
              >
                {isLoading === provider.id ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <provider.icon className={cn("h-5 w-5", provider.iconColor)} />
                )}
                <span>Continue with {provider.name}</span>
              </Button>
            ))}
          </div>

          <div className="relative my-8">
            <Separator className="bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Email Login */}
          {!showEmailLogin ? (
            <Button
              variant="outline"
              className="w-full h-12 gap-3 border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setShowEmailLogin(true)}
            >
              <Mail className="h-5 w-5" />
              Sign in with Email
            </Button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 bg-white/5 border-white/10"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="border-white/20" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal">
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-cyan-600 hover:bg-cyan-700"
                disabled={isLoading !== null}
              >
                {isLoading === "email" ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  "Sign in"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setShowEmailLogin(false)}
              >
                Back to OAuth options
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Contact your administrator
            </a>
          </p>

          <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-muted-foreground">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-muted-foreground">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
