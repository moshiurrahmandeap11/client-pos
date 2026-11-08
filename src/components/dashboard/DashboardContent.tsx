"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
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

  // 1. DASHBOARD OVERVIEW VIEW (Full Width)
  if (activeView === "dashboard") {
    return (
      <div className="w-full space-y-6">
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
              ৳48,650.00
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
              ৳342.60
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
              ৳18,200.00
            </div>
            <p className="text-[11px] text-muted-foreground font-normal">
              Float: ৳5,000 + Cash: ৳13,200
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
              <CardTitle className="text-sm font-normal">Active Shift (Counter #01)</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground font-normal">
              Started at 08:30 AM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full">
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
          description: "Register a new receipt or kitchen thermal printer with baud rate, paper width (58mm/80mm), and IP port.",
        };
      case "currencies":
        return {
          title: tSettings("currencies"),
          icon: CircleDollarSign,
          description: "Configure base store currency (BDT ৳), symbol positioning, decimal precision, and exchange rates.",
        };
      case "customer-groups":
        return {
          title: tSettings("customerGroups"),
          icon: Users,
          description: "Group retail customers (Regular, VIP, Wholesale, Corporate) with tier-based automated discounts.",
        };
      case "price-groups":
        return {
          title: tSettings("priceGroups"),
          icon: Tag,
          description: "Set up multi-tier pricing strategies (Retail Counter, Wholesale Bulk, Distributor Special).",
        };
      case "variants":
        return {
          title: tSettings("variants"),
          icon: Layers,
          description: "Manage product variant attributes (Size, Color, Flavor, Material, Weight) with barcode suffixes.",
        };
      case "email-templates":
        return {
          title: tSettings("emailTemplates"),
          icon: Mail,
          description: "Customize automated digital invoice emails, order receipts, purchase orders, and customer alerts.",
        };
      case "site-logs":
        return {
          title: tSettings("siteLogs"),
          icon: FileCode,
          description: "Audit trail of operator transactions, supervisor PIN overrides, financial adjustments, and errors.",
        };
      case "backups":
        return {
          title: tSettings("backups"),
          icon: DatabaseBackup,
          description: "Create manual database snapshots, configure scheduled cloud backups, and restore archive points.",
        };
      default:
        return {
          title: tSettings("systemSettings"),
          icon: Sliders,
          description: "Global POS engine configuration, timezone, localization, and station defaults.",
        };
    }
  };

  const currentTab = getSubTabDetails();
  const TabIcon = currentTab.icon;

  return (
    <div className="w-full space-y-6">
      {/* Submenu Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TabIcon className="h-5 w-5" />
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

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground font-normal">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Section: {activeSubTab || "system-settings"}</span>
        </div>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Card 1: Configuration Status */}
        <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <TabIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-normal">Module Status</CardTitle>
              <CardDescription className="text-xs font-normal">Ready & Active</CardDescription>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
            <div className="flex justify-between">
              <span>Station ID</span>
              <span className="font-mono text-foreground font-normal">#POS-01</span>
            </div>
            <div className="flex justify-between">
              <span>Configuration State</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-normal">Synchronized</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Hardware & Peripheral Interfacing */}
        <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-normal">Hardware Interface</CardTitle>
              <CardDescription className="text-xs font-normal">Thermal Printer & Scale</CardDescription>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
            <div className="flex justify-between">
              <span>Thermal Receipt (ESC/POS)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-normal">80mm Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Drawer Kick Pulse</span>
              <span className="text-foreground font-normal">Enabled</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Storage & Database Sync */}
        <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <DatabaseBackup className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-normal">Database Connection</CardTitle>
              <CardDescription className="text-xs font-normal">PostgreSQL VPS</CardDescription>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-1 space-y-1.5 border-t border-border/50">
            <div className="flex justify-between">
              <span>Remote VPS Host</span>
              <span className="font-mono text-foreground font-normal">103.71.47.73</span>
            </div>
            <div className="flex justify-between">
              <span>Latency</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-normal">&lt; 38ms</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Action Controls tailored to current tab */}
        <Card className="border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs sm:col-span-2 lg:col-span-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-3">
            <div>
              <CardTitle className="text-sm font-normal">Manage {currentTab.title}</CardTitle>
              <CardDescription className="text-xs font-normal">
                Perform administrative adjustments for this setting domain.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-normal cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Configuration</span>
              </Button>

              <Button
                variant="default"
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
