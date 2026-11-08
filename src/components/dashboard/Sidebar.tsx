"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  Settings,
  Store,
  PanelLeftClose,
  X,
  ChevronDown,
  ChevronRight,
  Sliders,
  MonitorCheck,
  FolderTree,
  Building2,
  Ruler,
  Receipt,
  Warehouse,
  ShieldCheck,
  Percent,
  Image,
  BadgePercent,
  Printer,
  PrinterCheck,
  CircleDollarSign,
  Users,
  Tag,
  Layers,
  Mail,
  FileCode,
  DatabaseBackup,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isPinnedExpanded: boolean;
  onTogglePin: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeItem?: string;
  activeSubItem?: string;
  onSelectItem?: (item: string) => void;
}

export function Sidebar({
  isPinnedExpanded,
  onTogglePin,
  isMobileOpen,
  onCloseMobile,
  activeItem,
  activeSubItem,
  onSelectItem,
}: SidebarProps) {
  const t = useTranslations("sidebar");
  const tSettings = useTranslations("settingsMenu");
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Settings submenu collapsible state (open by default when on settings pages)
  const isSettingsActive = pathname.startsWith("/settings") || activeItem === "settings";
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsActive]);

  // MongoDB-style dynamic hover expansion:
  // When pinned open, stays open (w-64).
  // When shrinked (w-16), hovering expands smoothly to w-64, mouse leave shrinks back to w-16.
  const isExpanded = isPinnedExpanded || isHovered;

  // 20 Settings Submenu Items with official Lucide SVG icons (strictly no emojis)
  const settingsSubmenu = [
    { id: "system-settings", key: "systemSettings", href: "/settings/system-settings", icon: Sliders },
    { id: "pos-settings", key: "posSettings", href: "/settings/pos-settings", icon: MonitorCheck },
    { id: "categories", key: "categories", href: "/settings/categories", icon: FolderTree },
    { id: "branches", key: "branches", href: "/settings/branches", icon: Building2 },
    { id: "units", key: "units", href: "/settings/units", icon: Ruler },
    { id: "expense-categories", key: "expenseCategories", href: "/settings/expense-categories", icon: Receipt },
    { id: "warehouses", key: "warehouses", href: "/settings/warehouses", icon: Warehouse },
    { id: "access-setup", key: "accessSetup", href: "/settings/access-setup", icon: ShieldCheck },
    { id: "tax-rates", key: "taxRates", href: "/settings/tax-rates", icon: Percent },
    { id: "change-logo", key: "changeLogo", href: "/settings/change-logo", icon: Image },
    { id: "promos", key: "promos", href: "/settings/promos", icon: BadgePercent },
    { id: "list-printers", key: "listPrinters", href: "/settings/list-printers", icon: Printer },
    { id: "add-printer", key: "addPrinter", href: "/settings/add-printer", icon: PrinterCheck },
    { id: "currencies", key: "currencies", href: "/settings/currencies", icon: CircleDollarSign },
    { id: "customer-groups", key: "customerGroups", href: "/settings/customer-groups", icon: Users },
    { id: "price-groups", key: "priceGroups", href: "/settings/price-groups", icon: Tag },
    { id: "variants", key: "variants", href: "/settings/variants", icon: Layers },
    { id: "email-templates", key: "emailTemplates", href: "/settings/email-templates", icon: Mail },
    { id: "site-logs", key: "siteLogs", href: "/settings/site-logs", icon: FileCode },
    { id: "backups", key: "backups", href: "/settings/backups", icon: DatabaseBackup },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        onMouseEnter={() => {
          if (!isPinnedExpanded) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (!isPinnedExpanded) setIsHovered(false);
        }}
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen
          bg-sidebar text-sidebar-foreground border-r border-sidebar-border
          flex flex-col select-none
          transition-all duration-300 ease-in-out
          ${
            /* Mobile drawer slide behavior */
            isMobileOpen
              ? "translate-x-0 w-64 shadow-2xl"
              : "-translate-x-full md:translate-x-0"
          }
          ${
            /* Desktop MongoDB hover width & elevation */
            isPinnedExpanded
              ? "md:w-64"
              : isHovered
              ? "md:w-64 md:shadow-xl md:bg-sidebar/98 md:backdrop-blur-md"
              : "md:w-16"
          }
        `}
      >
        {/* Top Synchronized Header (Height h-14 to match Topbar exactly) */}
        <div
          className={`h-14 shrink-0 flex items-center border-b border-sidebar-border/80 transition-all duration-300 ${
            isExpanded || isMobileOpen
              ? "justify-between px-3"
              : "justify-center px-0"
          }`}
        >
          {/* Logo & Brand Wrapper: When shrinked, ONLY the centered logo is shown */}
          <div
            onClick={() => {
              if (!isExpanded) onTogglePin();
            }}
            className={`flex items-center gap-2.5 min-w-0 transition-all duration-200 ${
              !isExpanded ? "cursor-pointer" : ""
            }`}
            title={!isExpanded ? t("expand") : undefined}
          >
            {/* The Logo Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform hover:scale-105">
              <Store className="h-4 w-4" />
            </div>

            {/* Brand Title (Visible only when expanded) */}
            {(isExpanded || isMobileOpen) && (
              <span className="text-sm font-normal text-sidebar-foreground tracking-tight whitespace-nowrap animate-in fade-in duration-200">
                {t("brand")}
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle Button (Visible ONLY when expanded) */}
          {(isExpanded || isMobileOpen) && (
            <div className="hidden md:flex items-center animate-in fade-in duration-150">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onTogglePin}
                title={t("collapse")}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer rounded-md"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Mobile Close Button */}
          {isMobileOpen && (
            <div className="flex md:hidden items-center">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onCloseMobile}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items Container */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
          {/* 1. Dashboard Nav Item */}
          <Link
            href="/dashboard"
            onClick={() => {
              if (onSelectItem) onSelectItem("dashboard");
              if (isMobileOpen) onCloseMobile();
            }}
            className={`
              w-full flex items-center rounded-lg text-xs font-normal
              transition-all duration-200 cursor-pointer outline-none select-none
              ${
                isExpanded || isMobileOpen
                  ? "justify-start px-2.5 py-2 gap-3"
                  : "justify-center h-10 px-0"
              }
              ${
                pathname === "/dashboard" || pathname === "/" || activeItem === "dashboard"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }
            `}
            title={!isExpanded ? t("dashboard") : undefined}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />

            {(isExpanded || isMobileOpen) && (
              <span className="whitespace-nowrap transition-all duration-200 animate-in fade-in">
                {t("dashboard")}
              </span>
            )}
          </Link>

          {/* 2. Settings Item with Collapsible Submenu */}
          <div className="space-y-1">
            <div
              onClick={() => {
                if (!isExpanded) {
                  onTogglePin();
                  setIsSettingsOpen(true);
                } else {
                  setIsSettingsOpen(!isSettingsOpen);
                }
              }}
              className={`
                w-full flex items-center rounded-lg text-xs font-normal
                transition-all duration-200 cursor-pointer outline-none select-none
                ${
                  isExpanded || isMobileOpen
                    ? "justify-between px-2.5 py-2"
                    : "justify-center h-10 px-0"
                }
                ${
                  isSettingsActive
                    ? "bg-sidebar-accent/80 text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }
              `}
              title={!isExpanded ? t("settings") : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Settings className="h-4 w-4 shrink-0" />

                {(isExpanded || isMobileOpen) && (
                  <span className="whitespace-nowrap transition-all duration-200 animate-in fade-in">
                    {t("settings")}
                  </span>
                )}
              </div>

              {/* Accordion Chevron Indicator */}
              {(isExpanded || isMobileOpen) && (
                <div className="text-sidebar-foreground/60 transition-transform duration-200">
                  {isSettingsOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </div>
              )}
            </div>

            {/* Submenu List (Only visible when expanded and open) */}
            {(isExpanded || isMobileOpen) && isSettingsOpen && (
              <div className="ml-4 pl-2 border-l border-sidebar-border/70 space-y-0.5 animate-in fade-in duration-200">
                {settingsSubmenu.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive =
                    pathname === sub.href ||
                    activeSubItem === sub.id ||
                    (pathname === "/settings" && sub.id === "system-settings");

                  return (
                    <Link
                      key={sub.id}
                      href={sub.href}
                      onClick={() => {
                        if (onSelectItem) onSelectItem(sub.id);
                        if (isMobileOpen) onCloseMobile();
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] font-normal
                        transition-colors cursor-pointer outline-none select-none
                        ${
                          isSubActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-normal"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                        }
                      `}
                    >
                      <SubIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      <span className="truncate whitespace-nowrap">
                        {tSettings(sub.key as any)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Area - Clean as requested */}
        <div className="h-3 shrink-0" />
      </aside>
    </>
  );
}
