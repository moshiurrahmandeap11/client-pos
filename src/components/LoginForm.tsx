"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Store,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export function LoginForm() {
  const { user, isLoading, isSubmitting, error, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      const res = await login({ email: email.trim(), password });
      setSuccessMsg(`Welcome back, ${res.user.name}!`);
    } catch {
      // Error handled in useAuth hook
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSuccessMsg(null);
  };

  // If initial auth check is loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Checking active session...</p>
      </div>
    );
  }

  // If already authenticated, show logged-in profile card
  if (user) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Active Terminal Session</CardTitle>
          <CardDescription>
            You are logged into POS Terminal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground">Operator Name:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-mono text-xs">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground">Role:</span>
              <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {user.role}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {user.isActive ? "Online / Verified" : "Inactive"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out & Clear Terminal
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Not logged in -> Show shadcn Login Form
  return (
    <Card className="w-full max-w-md shadow-xl border-border/80">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <Store className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          POS Terminal Login
        </CardTitle>
        <CardDescription>
          Enter your operator credentials to sign in
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-2">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Operator Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="operator@apexpos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Security Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 pr-9"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Quick Fill Demo Helper */}
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-2.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Quick Test Credentials:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("supervisor@apexpos.com", "password123")}
                className="text-left text-xs rounded border border-border bg-background px-2 py-1.5 hover:bg-accent transition cursor-pointer"
              >
                <div className="font-semibold text-foreground">Supervisor</div>
                <div className="text-[10px] text-muted-foreground">supervisor@apexpos.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("cashier@apexpos.com", "password123")}
                className="text-left text-xs rounded border border-border bg-background px-2 py-1.5 hover:bg-accent transition cursor-pointer"
              >
                <div className="font-semibold text-foreground">Cashier</div>
                <div className="text-[10px] text-muted-foreground">cashier@apexpos.com</div>
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 cursor-pointer font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Store className="h-4 w-4" />
                Sign In to Terminal
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
