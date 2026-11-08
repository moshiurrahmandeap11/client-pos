"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/auth.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User as UserIcon,
  ShieldCheck,
  Mail,
  Phone,
  KeyRound,
  X,
  CheckCircle2,
} from "lucide-react";

interface ProfileDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDialog({ user, isOpen, onClose }: ProfileDialogProps) {
  const t = useTranslations("topbar");
  const tAuth = useTranslations("auth");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <Card className="relative z-10 w-full max-w-md border-border bg-card shadow-lg p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-normal">
                {t("profileTitle")}
              </CardTitle>
              <CardDescription className="text-xs font-normal">
                {user.email}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="h-3.5 w-3.5" />
              {tAuth("operatorName")}
            </span>
            <span className="font-normal text-foreground">{user.name}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {tAuth("operatorEmail")}
            </span>
            <span className="font-mono text-foreground font-normal">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </span>
              <span className="font-normal text-foreground">{user.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              {tAuth("operatorRole")}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 font-normal text-primary">
              {user.roleDisplayName || user.role}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" />
              {t("permissionsCount")}
            </span>
            <span className="font-normal text-foreground">
              {user.role === "SUPER_ADMIN"
                ? "Full Master Access"
                : `${user.permissions?.length || 0} permissions`}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {tAuth("terminalStatus")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-normal">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {tAuth("statusOnline")}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full h-8 text-xs font-normal cursor-pointer"
            onClick={onClose}
          >
            {t("close")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
