"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Store,
} from "lucide-react";

export function TerminalApp() {
  const t = useTranslations("auth");
  const { user, isLoading, isSubmitting, error, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Morphing animation states
  const [displayedView, setDisplayedView] = useState<"login" | "dashboard">(
    user ? "dashboard" : "login"
  );
  const [isMorphing, setIsMorphing] = useState(false);
  const prevUserRef = useRef<boolean>(!!user);

  // Detect user login or logout transitions
  useEffect(() => {
    const wasLoggedIn = prevUserRef.current;
    const isLoggedIn = !!user;

    if (wasLoggedIn !== isLoggedIn && !isLoading) {
      setIsMorphing(true);

      const timer = setTimeout(() => {
        setDisplayedView(isLoggedIn ? "dashboard" : "login");
        setIsMorphing(false);
      }, 650);

      prevUserRef.current = isLoggedIn;
      return () => clearTimeout(timer);
    } else {
      prevUserRef.current = isLoggedIn;
    }
  }, [user, isLoading]);

  // Initial load sync
  useEffect(() => {
    if (!isLoading) {
      setDisplayedView(user ? "dashboard" : "login");
    }
  }, [isLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      await login({ email: email.trim(), password });
    } catch {
      // Error handled in useAuth
    }
  };

  // Initial loader while checking session
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/10 p-4">
        <Card className="w-full max-w-md border-border shadow-sm min-h-[340px] flex flex-col items-center justify-center p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-normal">
            Initializing Terminal...
          </p>
        </Card>
      </main>
    );
  }

  // Stable Dashboard View (no morphing underway)
  if (displayedView === "dashboard" && !isMorphing && user) {
    return <DashboardLayout />;
  }

  // Morphing Container or Login View
  const isTargetingDashboard = !!user;

  return (
    <main
      className={`
        w-full min-h-screen flex items-center justify-center
        transition-all duration-700 ease-in-out
        ${isTargetingDashboard ? "bg-background p-0" : "bg-muted/10 p-4"}
      `}
    >
      <div
        className={`
          relative overflow-hidden
          transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
          ${
            isTargetingDashboard
              ? "w-full min-h-screen rounded-none border-0 bg-background shadow-none p-0"
              : "w-full max-w-md rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-7 space-y-4"
          }
        `}
      >
        {/* If morphing to Dashboard or currently displaying Dashboard */}
        {isTargetingDashboard ? (
          <div
            className={`
              w-full min-h-screen transition-opacity duration-500 ease-in-out
              ${isMorphing ? "opacity-90 animate-in fade-in duration-500" : "opacity-100"}
            `}
          >
            <DashboardLayout />
          </div>
        ) : (
          /* Login Card View */
          <div
            className={`
              w-full transition-all duration-300 ease-in-out
              ${isMorphing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
            `}
          >
            {/* Top Utility Controls */}
            <div className="flex items-center justify-between pb-3 h-8 border-b border-border/40 mb-4">
              <span className="text-xs font-normal tracking-wider text-muted-foreground uppercase select-none">
                {t("terminalTitle")}
              </span>
              <div className="flex items-center gap-1.5">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>

            {/* Header */}
            <CardHeader className="p-0 pb-6 text-center space-y-1.5">
              <CardTitle className="text-xl font-normal tracking-normal min-h-[28px] flex items-center justify-center">
                {t("loginTitle")}
              </CardTitle>
              <CardDescription className="text-xs font-normal min-h-[16px]">
                {t("loginDescription")}
              </CardDescription>
            </CardHeader>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive font-normal animate-in fade-in">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Operator Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs text-muted-foreground font-normal block h-4 leading-none"
                >
                  {t("emailLabel")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 text-xs h-9 font-normal"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Security Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs text-muted-foreground font-normal block h-4 leading-none"
                >
                  {t("passwordLabel")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 pr-9 text-xs h-9 font-normal"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label={t("togglePassword")}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="default"
                  className="w-full gap-2 cursor-pointer font-normal h-9.5 text-xs"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("submittingButton")}</span>
                    </>
                  ) : (
                    <span>{t("submitButton")}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
