/**
 * Smooth circular ripple view transition for switching themes (Dark / Light / System).
 */
export function transitionThemeWithRipple(
  targetTheme: string,
  setTheme: (theme: string) => void,
  origin?: { x: number; y: number }
) {
  const normTheme = targetTheme.toLowerCase();
  const nextTheme = normTheme === "default" ? "system" : normTheme;

  if (typeof document === "undefined" || !(document as any).startViewTransition) {
    setTheme(nextTheme);
    return;
  }

  const x = origin?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const y = origin?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const endRadius = typeof window !== "undefined"
    ? Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
    : 1000;

  try {
    const transition = (document as any).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      (document.documentElement as any).animate(
        {
          clipPath,
        },
        {
          duration: 550,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }).catch(() => {
      setTheme(nextTheme);
    });
  } catch {
    setTheme(nextTheme);
  }
}
