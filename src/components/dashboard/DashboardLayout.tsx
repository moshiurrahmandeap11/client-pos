"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DashboardContent } from "./DashboardContent";

interface DashboardLayoutProps {
  initialItem?: string;
}

export function DashboardLayout({ initialItem = "settings" }: DashboardLayoutProps) {
  // Desktop pinned open state (toggleable via the collapse/expand icon)
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Active navigation item (defaults to "settings" as requested)
  const [activeItem, setActiveItem] = useState(initialItem);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden">
      {/* 1. Left Sidebar with MongoDB-style hover expansion and pin toggle */}
      <Sidebar
        isPinnedExpanded={isPinnedExpanded}
        onTogglePin={() => setIsPinnedExpanded((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        activeItem={activeItem}
        onSelectItem={(item) => setActiveItem(item)}
      />

      {/* 2. Main Work Area: Synchronized Topbar + Content Canvas (Right & Bottom blank) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          activeItemTitle={activeItem === "settings" ? "Settings" : "Dashboard"}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <DashboardContent activeItem={activeItem} />
        </main>
      </div>
    </div>
  );
}
