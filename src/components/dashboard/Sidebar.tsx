"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  Settings,
  Store,
  PanelLeftClose,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isPinnedExpanded: boolean;
  onTogglePin: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

export function Sidebar({
  isPinnedExpanded,
  onTogglePin,
  isMobileOpen,
  onCloseMobile,
  activeItem,
  onSelectItem,
}: SidebarProps) {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // MongoDB-style dynamic hover expansion:
  // When pinned open, stays open (w-64).
  // When shrinked (w-16), hovering expands smoothly to w-64, mouse leave shrinks back to w-16.
  const isExpanded = isPinnedExpanded || isHovered;

  const navItems = [
    {
      id: "dashboard",
      label: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive:
        pathname === "/dashboard" ||
        pathname === "/" ||
        activeItem === "dashboard",
    },
    {
      id: "settings",
      label: t("settings"),
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings" || activeItem === "settings",
    },
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

        {/* Sidebar Nav Items (1. Dashboard, 2. Settings) */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (onSelectItem) onSelectItem(item.id);
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
                    item.isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }
                `}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />

                {(isExpanded || isMobileOpen) && (
                  <span className="whitespace-nowrap transition-all duration-200 animate-in fade-in">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Area - Clean as requested */}
        <div className="h-4 shrink-0" />
      </aside>
    </>
  );
}
