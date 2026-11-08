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
import { Button } from "@/components/ui/button";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Monitor,
  Printer,
  Scale,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  Receipt,
  Wallet,
  PlusCircle,
  RotateCcw,
  Search,
  Lock,
} from "lucide-react";

interface DashboardContentProps {
  activeView?: "dashboard" | "settings";
}

export function DashboardContent({ activeView = "dashboard" }: DashboardContentProps) {
  const t = useTranslations("dashboard");
  const tAuth = useTranslations("auth");
  const { user } = useAuth();

  // 1. DASHBOARD VIEW
  if (activeView === "dashboard") {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Welcome Banner */}
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

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Sales */}
          <Card className="border-border bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-normal">
                {t("todaySales")}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-normal text-foreground">
              ৳48,650.00
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">
              +14.2% vs yesterday
            </p>
          </Card>

          {/* Card 2: Completed Orders */}
          <Card className="border-border bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-normal">
                {t("ordersCount")}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-normal text-foreground">
              142
            </div>
            <p className="text-[11px] text-muted-foreground font-normal">
              Avg 18 orders / hour
            </p>
          </Card>

          {/* Card 3: Average Ticket */}
          <Card className="border-border bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-normal">
                {t("avgTicket")}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Receipt className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-normal text-foreground">
              ৳342.60
            </div>
            <p className="text-[11px] text-muted-foreground font-normal">
              3.8 items per basket
            </p>
          </Card>

          {/* Card 4: Cash Drawer Balance */}
          <Card className="border-border bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-normal">
                {t("cashDrawer")}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Wallet className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-normal text-foreground">
              ৳18,200.00
            </div>
            <p className="text-[11px] text-muted-foreground font-normal">
              Float: ৳5,000 + Cash: ৳13,200
            </p>
          </Card>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="space-y-3">
          <h2 className="text-sm font-normal text-foreground">
            {t("quickActions")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-xl border-border bg-card hover:bg-muted/60 text-foreground cursor-pointer font-normal text-xs"
            >
              <PlusCircle className="h-5 w-5 text-primary" />
              <span>{t("newSale")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-xl border-border bg-card hover:bg-muted/60 text-foreground cursor-pointer font-normal text-xs"
            >
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>{t("refundSale")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-xl border-border bg-card hover:bg-muted/60 text-foreground cursor-pointer font-normal text-xs"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
              <span>{t("stockLookup")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-xl border-border bg-card hover:bg-muted/60 text-foreground cursor-pointer font-normal text-xs"
            >
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span>{t("shiftEnd")}</span>
            </Button>
          </div>
        </div>

        {/* Shift & Register Operational Status */}
        <Card className="border-border bg-card p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <CardTitle className="text-sm font-normal">Register #01 - Active Shift</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground font-normal">
              Started at 08:30 AM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-muted/40 p-3 space-y-1">
              <span className="text-muted-foreground">Cashier On Duty</span>
              <p className="text-foreground font-normal text-sm">{user?.name}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 space-y-1">
              <span className="text-muted-foreground">Assigned Role</span>
              <p className="text-foreground font-normal text-sm">{user?.roleDisplayName || user?.role}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 space-y-1">
              <span className="text-muted-foreground">Offline Sync Engine</span>
              <p className="text-emerald-600 dark:text-emerald-400 font-normal text-sm">IndexedDB Synced (0 pending)</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 2. SETTINGS VIEW (/settings)
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight">
            {t("settingsTitle")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("settingsDesc")}
          </p>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Station Display */}
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

        {/* Card 2: Thermal Printer */}
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

        {/* Card 3: Peripherals */}
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

        {/* Card 4: Payment Gateways */}
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
  );
}
