"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Monitor,
  Printer,
  Scale,
  CreditCard,
} from "lucide-react";

interface DashboardContentProps {
  activeItem?: string;
}

export function DashboardContent({ activeItem = "settings" }: DashboardContentProps) {
  const t = useTranslations("dashboard");
  const tAuth = useTranslations("auth");
  const { user } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Overview Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight">
            {t("welcome")}, {user?.name || "Operator"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("readyText")}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-400 font-normal">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{t("systemStatus")}</span>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-base font-normal text-foreground">
              {t("settingsTitle")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("settingsDesc")}
            </p>
          </div>
        </div>

        {/* Responsive Grid of Configuration Cards (no hardcoded widths!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Active Terminal Station */}
          <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                <Monitor className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-normal">Station Display</CardTitle>
                <CardDescription className="text-xs font-normal">Dual-screen & resolution</CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
              <div className="flex justify-between">
                <span>Terminal ID</span>
                <span className="font-mono text-foreground font-normal">#POS-01</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution</span>
                <span className="text-foreground font-normal">Adaptive Responsive</span>
              </div>
            </div>
          </Card>

          {/* Card 2: ESC/POS Thermal Receipt Printer */}
          <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                <Printer className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-normal">Thermal Printer</CardTitle>
                <CardDescription className="text-xs font-normal">ESC/POS 80mm & 58mm</CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-normal">Ready / USB</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Drawer Kick</span>
                <span className="text-foreground font-normal">Auto on print</span>
              </div>
            </div>
          </Card>

          {/* Card 3: Barcode & Digital Scale */}
          <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-normal">Peripherals</CardTitle>
                <CardDescription className="text-xs font-normal">Scale & Barcode Gun</CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
              <div className="flex justify-between">
                <span>Scanner Input</span>
                <span className="text-foreground font-normal">HID Keyboard Emulation</span>
              </div>
              <div className="flex justify-between">
                <span>Weighing Scale</span>
                <span className="text-foreground font-normal">COM Serial Ready</span>
              </div>
            </div>
          </Card>

          {/* Card 4: Payment Terminals */}
          <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-normal">Payment Gateways</CardTitle>
                <CardDescription className="text-xs font-normal">Cash, Cards & MFS</CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
              <div className="flex justify-between">
                <span>Cash & Split</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-normal">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>bKash / Nagad QR</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-normal">Active</span>
              </div>
            </div>
          </Card>

          {/* Card 5: Operator RBAC Overview */}
          <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs sm:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-normal">Active Operator Credentials</CardTitle>
                  <CardDescription className="text-xs font-normal">Permissions granted to current session</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary font-normal">
                {user?.roleDisplayName || user?.role}
              </span>
            </div>

            <div className="text-xs text-muted-foreground pt-1 space-y-2 border-t border-border/50">
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user?.role === "SUPER_ADMIN" ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] text-foreground font-normal">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    All 19 Root Permissions Active (Master Bypass)
                  </span>
                ) : (
                  user?.permissions?.map((perm) => (
                    <span
                      key={perm}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground font-normal"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                      {perm}
                    </span>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
