import type { DesignVariant, ThemeColors, ThemeFonts } from "@/types/wedding";

// ─── Color Palettes ───────────────────────────────────────────────────────────
// All color values use the HSL format WITHOUT the hsl() wrapper,
// matching the convention in index.css (e.g. "140 28% 45%")

export interface PaletteDefinition {
  id: string;
  name: string;
  description: string;
  swatches: string[]; // 5 hex colors for swatch display only
  colors: ThemeColors;
}

export const PALETTES: PaletteDefinition[] = [
  {
    id: "sage-garden",
    name: "Sage Garden",
    description: "Lush greens, champagne, and ivory — the current Prince & Ann palette",
    swatches: ["#4a6a45", "#7aa67a", "#b8d4b8", "#d4c090", "#f5f9f5"],
    colors: {
      primary: "140 28% 45%",
      primaryLight: "140 20% 65%",
      primaryDark: "140 35% 28%",
      neutral: "140 15% 88%",
      text: "140 30% 25%",
      textMuted: "140 15% 50%",
      white: "0 0% 100%",
      accent: "45 35% 82%",
      background: "140 12% 98%",
    },
  },
  {
    id: "dusty-rose",
    name: "Dusty Rose",
    description: "Soft blush, mauve, and champagne for a romantic, feminine feel",
    swatches: ["#c27b8e", "#e8a9bb", "#f5d0dc", "#e8d5c0", "#fdf6f8"],
    colors: {
      primary: "345 35% 60%",
      primaryLight: "345 30% 75%",
      primaryDark: "345 40% 40%",
      neutral: "345 20% 90%",
      text: "345 25% 28%",
      textMuted: "345 15% 55%",
      white: "0 0% 100%",
      accent: "30 40% 88%",
      background: "350 20% 98%",
    },
  },
  {
    id: "midnight-navy",
    name: "Midnight Navy",
    description: "Deep navy, gold, and ivory — timeless and sophisticated",
    swatches: ["#1a2744", "#2d4080", "#c9a84c", "#e8dfc8", "#f8f6f0"],
    colors: {
      primary: "220 55% 28%",
      primaryLight: "220 45% 45%",
      primaryDark: "220 65% 18%",
      neutral: "220 20% 88%",
      text: "220 40% 18%",
      textMuted: "220 20% 48%",
      white: "0 0% 100%",
      accent: "44 55% 55%",
      background: "40 30% 97%",
    },
  },
  {
    id: "terracotta",
    name: "Terracotta",
    description: "Warm rust, burned orange, and sandy beige — earthy and vibrant",
    swatches: ["#c2613a", "#e8916a", "#d4a87a", "#f0dcc8", "#fdf7f2"],
    colors: {
      primary: "18 52% 48%",
      primaryLight: "18 48% 65%",
      primaryDark: "18 60% 32%",
      neutral: "25 30% 90%",
      text: "18 40% 22%",
      textMuted: "18 20% 52%",
      white: "0 0% 100%",
      accent: "38 50% 78%",
      background: "30 25% 97%",
    },
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    description: "Soft purple, lilac, and silver — dreamy and ethereal",
    swatches: ["#8b6db0", "#b899d4", "#d8c4e8", "#c8c8d8", "#f7f4fb"],
    colors: {
      primary: "270 32% 55%",
      primaryLight: "270 28% 72%",
      primaryDark: "270 40% 38%",
      neutral: "270 18% 90%",
      text: "270 28% 25%",
      textMuted: "270 15% 52%",
      white: "0 0% 100%",
      accent: "260 22% 88%",
      background: "270 18% 98%",
    },
  },
  {
    id: "classic-monochrome",
    name: "Classic Monochrome",
    description: "Timeless black, charcoal, and warm white — bold and editorial",
    swatches: ["#1a1a1a", "#4a4a4a", "#8a8a8a", "#c8c0b8", "#f8f5f0"],
    colors: {
      primary: "0 0% 18%",
      primaryLight: "0 0% 38%",
      primaryDark: "0 0% 8%",
      neutral: "20 5% 88%",
      text: "0 0% 12%",
      textMuted: "0 0% 45%",
      white: "0 0% 100%",
      accent: "30 10% 78%",
      background: "30 8% 97%",
    },
  },
];

// ─── Design Variants ──────────────────────────────────────────────────────────

export interface DesignVariantDefinition {
  id: DesignVariant;
  name: string;
  description: string;
  tagline: string;
  fonts: ThemeFonts;
  previewBg: string; // tailwind color class for card background
}

export const DESIGN_VARIANTS: DesignVariantDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Centered layouts, generous whitespace, and timeless serif typography",
    tagline: "Elegant · Traditional · Timeless",
    fonts: {
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Inter', sans-serif",
      accent: "'Cormorant Garamond', Georgia, serif",
    },
    previewBg: "bg-stone-50",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold typography, asymmetric sections, and clean sans-serif confidence",
    tagline: "Bold · Minimal · Contemporary",
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      accent: "'Playfair Display', Georgia, serif",
    },
    previewBg: "bg-white",
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Full-bleed imagery, script accents, and soft dreamy overlays",
    tagline: "Dreamy · Soft · Intimate",
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Inter', sans-serif",
      accent: "'Dancing Script', cursive",
    },
    previewBg: "bg-rose-50",
  },
];

// ─── Default config factory ───────────────────────────────────────────────────

export function getDefaultColors(paletteId = "sage-garden"): ThemeColors {
  return PALETTES.find((p) => p.id === paletteId)?.colors ?? PALETTES[0].colors;
}

export function getDefaultFonts(design: DesignVariant = "classic"): ThemeFonts {
  return DESIGN_VARIANTS.find((d) => d.id === design)?.fonts ?? DESIGN_VARIANTS[0].fonts;
}
