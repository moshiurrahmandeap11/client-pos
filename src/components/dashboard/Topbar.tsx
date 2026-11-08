"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfileDropdown } from "./ProfileDropdown";

interface TopbarProps {
  onOpenMobileMenu: () => void;
  activeItemTitle?: string;
}

export function Topbar({ onOpenMobileMenu, activeItemTitle }: TopbarProps) {
  const t = useTranslations("dashboard");

  return (
    <header className="sticky top-0 z-20 h-14 w-full bg-background/85 backdrop-blur-md border-b border-border/80 flex items-center justify-between px-3 sm:px-5 select-none transition-colors">
      {/* Left Section: Mobile Menu Trigger + Clean Page/Section Title */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Hamburger Drawer Trigger */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenMobileMenu}
          className="md:hidden text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Clean Location Title without any pulse/dot */}
        <span className="text-xs font-normal text-foreground">
          {activeItemTitle || t("title")}
        </span>
      </div>

      {/* Right Section: Language, Theme, and Profile Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <div className="h-4 w-px bg-border/60 mx-0.5 sm:mx-1" />
        <ProfileDropdown />
      </div>
    </header>
  );
}
