"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLocale;
    }
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      onClick={toggleLanguage}
      disabled={isPending}
      aria-label="Switch language"
    >
      <Languages className={`h-3.5 w-3.5 transition-opacity ${isPending ? "opacity-50" : ""}`} />
      <span>{locale === "en" ? "বাংলা" : "English"}</span>
    </Button>
  );
}
