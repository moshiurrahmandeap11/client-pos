"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { transitionThemeWithRipple } from "@/lib/themeTransition";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = e.clientX || (rect ? rect.left + rect.width / 2 : undefined);
    const y = e.clientY || (rect ? rect.top + rect.height / 2 : undefined);

    const origin = x !== undefined && y !== undefined ? { x, y } : undefined;
    transitionThemeWithRipple(nextTheme, setTheme, origin);
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
