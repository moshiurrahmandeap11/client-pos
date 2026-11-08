"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
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
} from "lucide-react";

export function LoginForm() {
  const t = useTranslations("auth");
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
      setSuccessMsg(res.user.name);
    } catch {
      // Error handled in useAuth hook
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Top Utility Controls: Title without icon, Language & Theme Toggle */}
      <div className="flex items-center justify-between px-1 h-8">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase select-none">
          {t("terminalTitle")}
        </span>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {isLoading ? (
        <Card className="border-border shadow-sm min-h-[320px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Card>
      ) : user ? (
        /* Authenticated Active Terminal View */
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg font-semibold min-h-[26px] flex items-center justify-center">
              {t("sessionActive")}
            </CardTitle>
            <CardDescription className="text-xs min-h-[16px]">
              {t("sessionDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                <span className="text-muted-foreground">{t("operatorName")}</span>
                <span className="font-medium text-foreground">{user.name}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                <span className="text-muted-foreground">{t("operatorEmail")}</span>
                <span className="font-mono text-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                <span className="text-muted-foreground">{t("operatorRole")}</span>
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">{t("terminalStatus")}</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t("statusOnline")}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-destructive hover:text-destructive cursor-pointer h-9"
              onClick={logout}
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("logoutButton")}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* Unauthenticated Clean Sign In Form */
        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-xl font-semibold tracking-tight min-h-[28px] flex items-center justify-center">
              {t("loginTitle")}
            </CardTitle>
            <CardDescription className="text-xs min-h-[16px]">
              {t("loginDescription")}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3.5">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Operator Email Field */}
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-xs text-muted-foreground font-medium block h-4 leading-none"
                >
                  {t("emailLabel")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-8 text-xs h-9"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Security Password Field */}
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-xs text-muted-foreground font-medium block h-4 leading-none"
                >
                  {t("passwordLabel")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-8 pr-8 text-xs h-9"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label={t("togglePassword")}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4">
              <Button
                type="submit"
                size="default"
                className="w-full gap-2 cursor-pointer font-medium h-9"
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
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
