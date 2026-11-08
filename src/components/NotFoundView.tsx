"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Store, FileQuestion, ArrowLeft, Settings } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "cn";

export function NotFoundView() {
  const t = useTranslations("notFound");
  const tAuth = useTranslations("auth");

  return (
    <div className="min-h-screen w-full bg-muted/10 text-foreground flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Utility Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-4 w-4" />
          </div>
          <span className="text-sm font-normal tracking-tight">
            {tAuth("terminalTitle")}
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Center 404 Card */}
      <div className="w-full max-w-md mx-auto my-auto animate-in fade-in zoom-in-95 duration-200">
        <Card className="border-border bg-card p-6 sm:p-8 text-center space-y-5 shadow-sm">
          {/* Subtle Icon & Badge */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <FileQuestion className="h-6 w-6 stroke-[1.5]" />
            </div>

            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-normal">
              {t("badge")}
            </span>
          </div>

          {/* Heading & Text */}
          <div className="space-y-2">
            <h1 className="text-lg sm:text-xl font-normal text-foreground tracking-tight">
              {t("title")}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full sm:w-auto gap-2 font-normal text-xs h-9 cursor-pointer"
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("backHome")}</span>
            </Link>

            <Link
              href="/settings"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto gap-2 font-normal text-xs h-9 cursor-pointer"
              )}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{t("settings")}</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Bottom Footer Info */}
      <div className="w-full max-w-4xl mx-auto pt-4 text-center">
        <p className="text-[11px] text-muted-foreground/60 font-normal">
          Apex Retail POS Engine • Station #01
        </p>
      </div>
    </div>
  );
}
