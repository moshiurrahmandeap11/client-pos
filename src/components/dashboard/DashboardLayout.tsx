"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DashboardContent } from "./DashboardContent";

interface DashboardLayoutProps {
  initialView?: "dashboard" | "settings";
}

export function DashboardLayout({ initialView }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Determine active view from pathname: "/settings" -> "settings", otherwise "dashboard"
  const resolvedView =
    initialView || (pathname === "/settings" ? "settings" : "dashboard");

  const [activeView, setActiveView] = useState<"dashboard" | "settings">(
    resolvedView
  );

  useEffect(() => {
    if (pathname === "/settings") {
      setActiveView("settings");
    } else {
      setActiveView("dashboard");
    }
  }, [pathname]);

  // Desktop pinned open state
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden">
      {/* 1. Left Sidebar with MongoDB-style hover expansion and pin toggle */}
      <Sidebar
        isPinnedExpanded={isPinnedExpanded}
        onTogglePin={() => setIsPinnedExpanded((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        activeItem={activeView}
        onSelectItem={(item) => setActiveView(item as "dashboard" | "settings")}
      />

      {/* 2. Main Work Area: Synchronized Topbar + Content Canvas (Right & Bottom blank) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          activeItemTitle={activeView === "settings" ? "Settings" : "Dashboard"}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <DashboardContent activeView={activeView} />
        </main>
      </div>
    </div>
  );
}
