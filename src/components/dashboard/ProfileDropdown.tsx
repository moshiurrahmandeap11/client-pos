"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, ChevronDown, ShieldCheck, Loader2 } from "lucide-react";
import { ProfileDialog } from "./ProfileDialog";

export function ProfileDropdown() {
  const t = useTranslations("topbar");
  const { user, logout, isSubmitting } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  // Extract initials for avatar display
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-border/80 bg-background hover:bg-muted/60 transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-normal leading-none shrink-0">
          {initials || "OP"}
        </div>
        <span className="hidden sm:inline-block text-xs font-normal text-foreground max-w-[100px] truncate">
          {user.name}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover/95 text-popover-foreground shadow-lg backdrop-blur-md p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Overview Header */}
          <div className="px-3 py-2 space-y-1 border-b border-border/60">
            <p className="text-xs font-normal text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              {user.email}
            </p>
            <div className="pt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-normal">
                <ShieldCheck className="h-2.5 w-2.5" />
                {user.roleDisplayName || user.role}
              </span>
            </div>
          </div>

          {/* Action Menu List */}
          <div className="py-1 space-y-0.5">
            {/* 1. Profile Option */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setShowProfileDialog(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-foreground hover:bg-muted/70 transition-colors cursor-pointer select-none font-normal"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t("profile")}</span>
            </button>

            {/* 2. Log Out Option */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer select-none font-normal disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{t("loggingOut")}</span>
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t("logout")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Operator Detailed Profile Modal */}
      <ProfileDialog
        user={user}
        isOpen={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />
    </div>
  );
}
