import { useReducer } from "react";
import type { WeddingConfig } from "@/types/wedding";
import type { BuilderAction } from "@/components/builder/BuilderContext";
import { PALETTES, DESIGN_VARIANTS, getDefaultColors, getDefaultFonts } from "@/constants/palettes";

// ─── Default Config ───────────────────────────────────────────────────────────

export function createDefaultConfig(): WeddingConfig {
  return {
    meta: {
      siteTitle: "Our Wedding",
      siteUrl: "",
      ogImage: "",
      faviconUrl: "",
    },
    couple: {
      partner1: { name: "Name 1", fullName: "", nickname: "", photo: "" },
      partner2: { name: "Name 2", fullName: "", nickname: "", photo: "" },
      combinedName: "Name 1 & Name 2",
      hashtag: "#OurWedding",
    },
    event: {
      date: "",
      displayDate: "Date TBD",
      dayOfWeek: "",
      showCountdown: true,
    },
    theme: {
      design: "classic",
      colors: getDefaultColors("sage-garden"),
      fonts: getDefaultFonts("classic"),
      showFloralAccents: true,
      showBackgroundMusic: true,
    },
    sections: {
      hero: true,
      welcome: true,
      gallery: true,
      events: true,
      rsvp: true,
      attire: true,
      gifts: true,
      entourage: false,
      faqs: false,
      venue: true,
      footer: true,
    },
    hero: {
      backgroundImages: [],
      overlayOpacity: 0.4,
      tagline: "ARE GETTING MARRIED",
      showRsvpButton: true,
      rsvpButtonLabel: "RSVP Now",
    },
    welcome: {
      heading: "Hello, Family & Friends!",
      body: "We're thrilled to celebrate this special moment with you. Here you'll find all the details about our big day.",
    },
    gallery: {
      heading: "Our Story",
      images: [],
      layout: "grid",
    },
    events: {
      heading: "The Celebration",
      ceremony: {
        label: "Ceremony",
        time: "TBD",
        venueName: "Ceremony Venue",
        address: "Address TBD",
        mapUrl: "",
      },
      reception: {
        label: "Reception",
        time: "TBD",
        venueName: "Reception Venue",
        address: "Address TBD",
        mapUrl: "",
      },
    },
    rsvp: {
      heading: "RSVP",
      subheading: "We can't wait to celebrate with you",
      deadline: "",
      instructions: "Please RSVP by the deadline so we can plan accordingly.",
      formEndpoint: "",
      fields: ["name", "attendance"],
    },
    attire: {
      heading: "Attire & Colors",
      dresscode: {
        label: "Dress Code",
        value: "Semi-Formal",
        description: "We kindly encourage our guests to wear these colors for our special day.",
      },
      palette: [
        { name: "Color 1", hex: "#4a6a45" },
        { name: "Color 2", hex: "#7aa67a" },
        { name: "Color 3", hex: "#b8d4b8" },
      ],
      inspoImages: { female: [], male: [] },
    },
    gifts: {
      heading: "In Lieu of Gifts",
      message: "Your presence and prayers are the greatest gifts we could ask for.",
      showAccountDetails: false,
      accounts: [],
      registryLink: "",
    },
    entourage: {
      heading: "Our Entourage",
      bridesSide: {
        label: "Bride's Side",
        principalSponsors: [],
        bridesmaids: [],
        flowerGirls: [],
      },
      groomsSide: {
        label: "Groom's Side",
        principalSponsors: [],
        groomsmen: [],
        ringBearers: [],
      },
    },
    faqs: {
      heading: "FAQs",
      items: [],
    },
    venue: {
      backgroundImage: "",
      venueName: "Our Venue",
      overlayOpacity: 0.4,
    },
    music: {
      src: "",
      autoplay: false,
      loop: true,
      defaultVolume: 0.5,
    },
    footer: {
      backgroundColor: "",
      textColor: "",
      showHashtag: true,
      showDate: true,
      showVenue: true,
      copyrightText: "",
    },
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

/**
 * Set a nested value in an object using a dot-path string.
 * e.g. setPath({ a: { b: 1 } }, "a.b", 2) → { a: { b: 2 } }
 */
function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".");
  const result = { ...obj };
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...(current[key] as Record<string, unknown>) };
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

function builderReducer(state: WeddingConfig, action: BuilderAction): WeddingConfig {
  switch (action.type) {
    case "SET_DESIGN": {
      const variant = DESIGN_VARIANTS.find((d) => d.id === action.design);
      return {
        ...state,
        theme: {
          ...state.theme,
          design: action.design,
          fonts: variant?.fonts ?? state.theme.fonts,
        },
      };
    }

    case "SET_PALETTE": {
      const palette = PALETTES.find((p) => p.id === action.paletteId);
      if (!palette) return state;
      return {
        ...state,
        theme: {
          ...state.theme,
          colors: palette.colors,
        },
      };
    }

    case "SET_THEME_COLORS": {
      return {
        ...state,
        theme: { ...state.theme, colors: action.colors },
      };
    }

    case "SET_SECTION_TEXT":
    case "SET_SECTION_IMAGE":
    case "SET_FIELD": {
      const value = action.type === "SET_SECTION_IMAGE" ? action.src : action.value;
      return setPath(state as unknown as Record<string, unknown>, action.path, value) as unknown as WeddingConfig;
    }

    case "TOGGLE_SECTION": {
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: !state.sections[action.section],
        },
      };
    }

    case "LOAD_CONFIG": {
      return action.config;
    }

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBuilderState(initialConfig?: WeddingConfig) {
  const [config, dispatch] = useReducer(builderReducer, initialConfig ?? createDefaultConfig());
  return { config, dispatch };
}
