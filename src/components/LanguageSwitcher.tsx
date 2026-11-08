"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTransition, useEffect } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.setAttribute("data-locale", locale);
    }
  }, [locale]);

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLocale;
      document.documentElement.setAttribute("data-locale", nextLocale);
    }
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 px-2.5 text-xs font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      onClick={toggleLanguage}
      disabled={isPending}
      aria-label="Switch language"
    >
      <Languages className={`h-3.5 w-3.5 transition-opacity ${isPending ? "opacity-50" : ""}`} />
      <span className="w-12 text-center inline-block select-none font-normal">
        {locale === "en" ? "বাংলা" : "English"}
      </span>
    </Button>
  );
}
