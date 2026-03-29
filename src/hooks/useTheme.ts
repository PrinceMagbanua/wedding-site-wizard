import { useEffect } from "react";
import type { ThemeColors, ThemeFonts } from "@/types/wedding";

/**
 * Injects CSS custom properties from a WeddingConfig theme onto a specific
 * DOM element (identified by `selector`). Defaults to `[data-wedding-theme]`
 * so the builder chrome (toolbar, wizard) keeps its own Sage Garden colors.
 *
 * For /site/:slug, pass selector=":root" to apply theme globally.
 */
export function useTheme(
  colors: ThemeColors | undefined,
  fonts?: ThemeFonts,
  selector = "[data-wedding-theme]"
) {
  useEffect(() => {
    if (!colors) return;

    const el =
      selector === ":root"
        ? document.documentElement
        : (document.querySelector(selector) as HTMLElement | null);

    if (!el) return;

    // Map ThemeColors keys to CSS variable names
    const colorVarMap: Record<keyof ThemeColors, string> = {
      primary: "--primary",
      primaryLight: "--primary-light",
      primaryDark: "--primary-dark",
      neutral: "--neutral",
      text: "--foreground",
      textMuted: "--muted-foreground",
      white: "--background",
      accent: "--accent",
      background: "--section-bg",
    };

    const setVar = (varName: string, value: string) => {
      if (el === document.documentElement) {
        document.documentElement.style.setProperty(varName, value);
      } else {
        (el as HTMLElement).style.setProperty(varName, value);
      }
    };

    // Apply color vars
    (Object.keys(colorVarMap) as (keyof ThemeColors)[]).forEach((key) => {
      setVar(colorVarMap[key], colors[key]);
    });

    // Apply font vars
    if (fonts) {
      setVar("--font-heading", fonts.heading);
      setVar("--font-body", fonts.body);
      setVar("--font-accent", fonts.accent);
    }

    // Cleanup: remove inline styles when unmounting
    return () => {
      const allVars = [
        ...Object.values(colorVarMap),
        "--font-heading",
        "--font-body",
        "--font-accent",
      ];
      allVars.forEach((v) => {
        if (el === document.documentElement) {
          document.documentElement.style.removeProperty(v);
        } else {
          (el as HTMLElement).style.removeProperty(v);
        }
      });
    };
  }, [colors, fonts, selector]);
}
