"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Settings,
  Store,
  PanelLeftClose,
  PanelLeft,
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
  activeItem = "settings",
  onSelectItem,
}: SidebarProps) {
  const t = useTranslations("sidebar");
  const [isHovered, setIsHovered] = useState(false);

  // MongoDB-style dynamic hover expansion:
  // If pinned open, stays open. If unpinned/shrunk, expands smoothly on hover and shrinks on mouse leave.
  const isExpanded = isPinnedExpanded || isHovered;

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
        <div className="h-14 shrink-0 flex items-center justify-between px-3 border-b border-sidebar-border/80">
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-4 w-4" />
            </div>

            {/* Brand Title (Fades in when expanded) */}
            <div
              className={`flex flex-col whitespace-nowrap transition-all duration-200 ${
                isExpanded || isMobileOpen
                  ? "opacity-100 max-w-[140px]"
                  : "opacity-0 max-w-0 overflow-hidden"
              }`}
            >
              <span className="text-sm font-normal text-sidebar-foreground tracking-tight">
                {t("brand")}
              </span>
            </div>
          </div>

          {/* Desktop Pin / Collapse Toggle Button */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onTogglePin}
              title={isPinnedExpanded ? t("collapse") : t("expand")}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer rounded-md"
            >
              {isPinnedExpanded ? (
                <PanelLeftClose className="h-3.5 w-3.5" />
              ) : (
                <PanelLeft className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          {/* Mobile Close Button */}
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
        </div>

        {/* Sidebar Nav Items (Only "Settings" as requested) */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <button
            type="button"
            onClick={() => {
              if (onSelectItem) onSelectItem("settings");
              if (isMobileOpen) onCloseMobile();
            }}
            className={`
              w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-normal
              transition-all duration-200 cursor-pointer outline-none
              ${
                activeItem === "settings"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs font-normal"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }
            `}
            title={!isExpanded ? t("settings") : undefined}
          >
            <Settings className="h-4 w-4 shrink-0" />

            <span
              className={`whitespace-nowrap transition-all duration-200 ${
                isExpanded || isMobileOpen
                  ? "opacity-100 max-w-[160px]"
                  : "opacity-0 max-w-0 overflow-hidden"
              }`}
            >
              {t("settings")}
            </span>
          </button>
        </div>

        {/* Bottom Status / Footer - Keep blank & clean as requested */}
        <div className="h-4 shrink-0" />
      </aside>
    </>
  );
}
