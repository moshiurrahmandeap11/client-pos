"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DashboardContent } from "./DashboardContent";

interface DashboardLayoutProps {
  initialView?: "dashboard" | "settings";
  settingsTab?: string;
}

export function DashboardLayout({
  initialView,
  settingsTab,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  // Determine active view: "/settings" or "/settings/..." -> "settings", otherwise "dashboard"
  const isSettings = pathname.startsWith("/settings");
  const resolvedView = initialView || (isSettings ? "settings" : "dashboard");

  const [activeView, setActiveView] = useState<"dashboard" | "settings">(resolvedView);

  // Extract active subtab if on /settings/...
  const currentSubTab =
    settingsTab ||
    (isSettings
      ? pathname.replace("/settings/", "").replace("/settings", "") || "system-settings"
      : undefined);

  useEffect(() => {
    if (pathname.startsWith("/settings")) {
      setActiveView("settings");
    } else {
      setActiveView("dashboard");
    }
  }, [pathname]);

  // Desktop pinned open state
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const formattedSubTabTitle = currentSubTab
    ? currentSubTab
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "System Settings";

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden">
      {/* 1. Left Sidebar with MongoDB-style hover expansion and pin toggle */}
      <Sidebar
        isPinnedExpanded={isPinnedExpanded}
        onTogglePin={() => setIsPinnedExpanded((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        activeItem={activeView}
        activeSubItem={currentSubTab}
        onSelectItem={(item) => {
          if (item === "dashboard") {
            setActiveView("dashboard");
          } else {
            setActiveView("settings");
          }
        }}
      />

      {/* 2. Main Work Area: Synchronized Topbar + Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          activeItemTitle={
            activeView === "settings"
              ? `Settings / ${formattedSubTabTitle}`
              : "Dashboard"
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <DashboardContent
            activeView={activeView}
            activeSubTab={currentSubTab}
          />
        </main>
      </div>
    </div>
  );
}
