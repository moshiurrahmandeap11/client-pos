"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { SystemSettingsForm } from "./settings/SystemSettingsForm";
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
  AlertTriangle,
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
  Sliders,
  MonitorCheck,
  FolderTree,
  Building2,
  Ruler,
  Warehouse,
  Percent,
  Image as ImageIcon,
  BadgePercent,
  PrinterCheck,
  CircleDollarSign,
  Users,
  Tag,
  Layers,
  Mail,
  FileCode,
  DatabaseBackup,
  Download,
} from "lucide-react";

interface DashboardContentProps {
  activeView?: "dashboard" | "settings";
  activeSubTab?: string;
}

export function DashboardContent({
  activeView = "dashboard",
  activeSubTab = "system-settings",
}: DashboardContentProps) {
  const t = useTranslations("dashboard");
  const tAuth = useTranslations("auth");
  const tSettings = useTranslations("settingsMenu");
  const { user } = useAuth();
  const { settings, currencySymbol, formatDate } = useSettings();

  // 1. DASHBOARD OVERVIEW VIEW (Full Width)
  if (activeView === "dashboard") {
    return (
      <div className="w-full space-y-6">
        {/* Maintenance Mode Alert Banner if active */}
        {settings?.maintenanceMode === "Yes" && (
          <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center gap-3 text-xs text-amber-700 dark:text-amber-300 font-normal animate-in fade-in">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <span className="font-medium">Maintenance Mode is currently enabled.</span>
              <span className="ml-1 text-muted-foreground">Store transactions are in administrative-only testing mode.</span>
            </div>
          </div>
        )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
              {currencySymbol}48,650.00
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">
              +14.2% vs yesterday
            </p>
          </Card>

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
              {currencySymbol}342.60
            </div>
            <p className="text-[11px] text-muted-foreground font-normal">
              3.8 items per basket
            </p>
          </Card>

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
              {currencySymbol}18,200.00
            </div>
            <p className="text-[11px] text-muted-foreground font-normal">
              Float: {currencySymbol}5,000 + Cash: {currencySymbol}13,200
            </p>
          </Card>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="space-y-3 w-full">
          <h2 className="text-sm font-normal text-foreground">
            {t("quickActions")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
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

        {/* Shift Status */}
        <Card className="border-border bg-card p-4 sm:p-5 shadow-xs space-y-3 w-full">
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <CardTitle className="text-sm font-normal">
                Active Shift ({settings?.defaultWarehouse || "Main Branch"})
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground font-normal">
              Today: {formatDate(new Date())} • {settings?.timezone || "Asia/Dhaka"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full">
            <div className="rounded-lg bg-muted/40 p-3 space-y-1">
              <span className="text-muted-foreground">Cashier On Duty</span>
              <p className="text-foreground font-normal text-sm">{user?.name || "Operator"}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 space-y-1">
              <span className="text-muted-foreground">Default Accounting Method</span>
              <p className="text-foreground font-normal text-sm">{settings?.accountingMethod || "AVCO"}</p>
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

  // 2. SETTINGS VIEW: If "system-settings" is active, render the dedicated SystemSettingsForm!
  if (!activeSubTab || activeSubTab === "system-settings") {
    return <SystemSettingsForm />;
  }

  // 3. OTHER SETTINGS SUBMENUS
  const getSubTabDetails = () => {
    switch (activeSubTab) {
      case "pos-settings":
        return {
          title: tSettings("posSettings"),
          icon: MonitorCheck,
          description: "Configure counter peripherals, auto-receipt printing, cash drawer kick timing, and touch grid layout.",
        };
      case "categories":
        return {
          title: tSettings("categories"),
          icon: FolderTree,
          description: "Organize inventory hierarchy, parent-child product categories, and counter display groups.",
        };
      case "branches":
        return {
          title: tSettings("branches"),
          icon: Building2,
          description: "Manage physical store branches, outlet addresses, operating hours, and counter register allocations.",
        };
      case "units":
        return {
          title: tSettings("units"),
          icon: Ruler,
          description: "Configure measurement units (Pcs, Box, Kg, Liter, Meter) and fractional conversion multipliers.",
        };
      case "expense-categories":
        return {
          title: tSettings("expenseCategories"),
          icon: Receipt,
          description: "Classify operational expenses, counter petty cash disbursements, and store utility payments.",
        };
      case "warehouses":
        return {
          title: tSettings("warehouses"),
          icon: Warehouse,
          description: "Configure central fulfillment warehouses, stock storage zones, and branch replenishment routes.",
        };
      case "access-setup":
        return {
          title: tSettings("accessSetup"),
          icon: ShieldCheck,
          description: "RBAC security matrix: manage dynamic staff roles, fine-grained counter permissions, and supervisor PIN policies.",
        };
      case "tax-rates":
        return {
          title: tSettings("taxRates"),
          icon: Percent,
          description: "Configure standard VAT/Tax rates (e.g. 5%, 7.5%, 15%), tax exemption rules, and invoice tax breakdowns.",
        };
      case "change-logo":
        return {
          title: tSettings("changeLogo"),
          icon: ImageIcon,
          description: "Upload store brand mark, invoice thermal receipt logo header, and terminal splash artwork.",
        };
      case "promos":
        return {
          title: tSettings("promos"),
          icon: BadgePercent,
          description: "Configure discount campaigns, coupon codes, buy-one-get-one deals, and seasonal customer promotions.",
        };
      case "list-printers":
        return {
          title: tSettings("listPrinters"),
          icon: Printer,
          description: "Overview of all connected thermal printers, ESC/POS hardware interfaces (USB, Network IP, Bluetooth).",
        };
      case "add-printer":
        return {
          title: tSettings("addPrinter"),
          icon: PrinterCheck,
          description: "Register a new POS thermal receipt or barcode label printer with baud rates and driver profiles.",
        };
      case "currencies":
        return {
          title: tSettings("currencies"),
          icon: CircleDollarSign,
          description: "Manage exchange rates, multi-currency cash tender options, and rounding precision thresholds.",
        };
      case "customer-groups":
        return {
          title: tSettings("customerGroups"),
          icon: Users,
          description: "Segment customer cohorts for targeted discount tiers, credit limits, and promotional offers.",
        };
      case "price-groups":
        return {
          title: tSettings("priceGroups"),
          icon: Tag,
          description: "Set customer price lists (Retail, Wholesale, Distributor) and volume markdown schedules.",
        };
      case "variants":
        return {
          title: tSettings("variants"),
          icon: Layers,
          description: "Configure SKU attributes such as Color, Size, Flavor, Material, and barcode child item matrix.",
        };
      case "email-templates":
        return {
          title: tSettings("emailTemplates"),
          icon: Mail,
          description: "Design automated customer notification emails, digital e-receipts, and staff shift summaries.",
        };
      case "site-logs":
        return {
          title: tSettings("siteLogs"),
          icon: FileCode,
          description: "Inspect immutable system audit trail, security events, cash drawer openings, and price overrides.",
        };
      case "backups":
        return {
          title: tSettings("backups"),
          icon: DatabaseBackup,
          description: "Trigger real-time PostgreSQL database snapshot backups and schedule cloud storage replication.",
        };
      default:
        return {
          title: activeSubTab,
          icon: Sliders,
          description: "Manage and configure settings module parameters.",
        };
    }
  };

  const currentTab = getSubTabDetails();
  const CurrentIcon = currentTab.icon;

  return (
    <div className="w-full space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CurrentIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-tight">
              {currentTab.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentTab.description}
            </p>
          </div>
        </div>
      </div>

      {/* Module Workspace Container */}
      <div className="space-y-4 w-full">
        <Card className="border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <h2 className="text-sm font-normal text-foreground">
                {currentTab.title} Registry
              </h2>
              <p className="text-xs text-muted-foreground">
                Operational records and configuration parameters currently active on this station.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-normal cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Schema</span>
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs font-normal cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add / Update</span>
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-1 space-y-2">
            <div className="rounded-lg bg-muted/40 p-3 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-foreground font-normal">Operational Policy Active</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  All adjustments in <span className="text-foreground">{currentTab.title}</span> are automatically logged in the immutable audit trail and synchronized across connected counter terminals.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
