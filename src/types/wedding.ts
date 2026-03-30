// ─── Primitive building blocks ───────────────────────────────────────────────

export type DesignVariant = "classic" | "modern" | "romantic";

export interface ImageItem {
  src: string;
  alt: string;
}

export interface ThemeColors {
  /** HSL values only, e.g. "140 28% 45%" (no hsl() wrapper) */
  primary: string;
  primaryLight: string;
  primaryDark: string;
  neutral: string;
  text: string;
  textMuted: string;
  white: string;
  accent: string;
  background: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  accent: string;
}

// ─── Top-level config sections ────────────────────────────────────────────────

export interface MetaConfig {
  siteTitle: string;
  siteUrl: string;
  ogImage: string;
  faviconUrl: string;
}

export interface PartnerConfig {
  name: string;
  fullName: string;
  nickname: string;
  photo: string;
}

export interface CoupleConfig {
  partner1: PartnerConfig;
  partner2: PartnerConfig;
  combinedName: string;
  hashtag: string;
}

export interface EventConfig {
  date: string; // ISO YYYY-MM-DD
  displayDate: string;
  dayOfWeek: string;
  showCountdown: boolean;
}

export interface ThemeConfig {
  design: DesignVariant;
  colors: ThemeColors;
  fonts: ThemeFonts;
  showFloralAccents: boolean;
  showBackgroundMusic: boolean;
}

export interface SectionsVisibility {
  hero: boolean;
  welcome: boolean;
  gallery: boolean;
  events: boolean;
  rsvp: boolean;
  attire: boolean;
  gifts: boolean;
  entourage: boolean;
  faqs: boolean;
  venue: boolean;
  footer: boolean;
}

// ─── Per-section configs ──────────────────────────────────────────────────────

export interface HeroConfig {
  backgroundImages: string[];
  overlayOpacity: number;
  tagline: string;
  showRsvpButton: boolean;
  rsvpButtonLabel: string;
}

export interface WelcomeConfig {
  heading: string;
  body: string;
}

export interface GalleryConfig {
  heading: string;
  images: ImageItem[];
  layout: "grid" | "masonry";
}

export interface EventLocationConfig {
  label: string;
  time: string;
  venueName: string;
  address: string;
  mapUrl: string;
  wazeUrl?: string;
}

export interface EventsConfig {
  heading: string;
  ceremony: EventLocationConfig;
  reception: EventLocationConfig;
}

export interface RSVPConfig {
  heading: string;
  subheading: string;
  deadline: string;
  instructions: string;
  showNote: boolean;
  noteTitle: string;
  formEndpoint: string;
  fields: string[];
}

export interface DresscodeConfig {
  label: string;
  value: string;
  description: string;
}

export interface PaletteColor {
  name: string;
  hex: string;
}

export interface AttireInspoGroup {
  label: string;
  description?: string;
  looks: Array<{ title: string; image: string }>;
}

export interface AttireConfig {
  heading: string;
  dresscode: DresscodeConfig;
  palette: PaletteColor[];
  inspoGroups: AttireInspoGroup[];
  inspoImages: {
    female: ImageItem[];
    male: ImageItem[];
  };
}

export interface BankAccount {
  bank: string;
  accountName: string;
  accountNumber: string;
}

export interface GiftsConfig {
  heading: string;
  message: string;
  footnote: string;
  showAccountDetails: boolean;
  accounts: BankAccount[];
  registryLink: string;
}

export interface EntouragePerson {
  name: string;
  role?: string;
  photo?: string;
}

export interface EntourageSide {
  label: string;
  principalSponsors: EntouragePerson[];
  bridesmaids?: EntouragePerson[];
  groomsmen?: EntouragePerson[];
  flowerGirls?: EntouragePerson[];
  ringBearers?: EntouragePerson[];
}

export interface EntourageConfig {
  heading: string;
  bridesSide: EntourageSide;
  groomsSide: EntourageSide;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqsConfig {
  heading: string;
  items: FaqItem[];
}

export interface VenueConfig {
  backgroundImage: string;
  foregroundImage?: string;
  venueName: string;
  overlayOpacity: number;
}

export interface MusicConfig {
  src: string;
  autoplay: boolean;
  loop: boolean;
  defaultVolume: number;
}

export interface FooterConfig {
  backgroundColor: string;
  textColor: string;
  tagline: string;
  showHashtag: boolean;
  showDate: boolean;
  showVenue: boolean;
  copyrightText: string;
}

// ─── Master config ────────────────────────────────────────────────────────────

export interface WeddingConfig {
  meta: MetaConfig;
  couple: CoupleConfig;
  event: EventConfig;
  theme: ThemeConfig;
  sections: SectionsVisibility;
  hero: HeroConfig;
  welcome: WelcomeConfig;
  gallery: GalleryConfig;
  events: EventsConfig;
  rsvp: RSVPConfig;
  attire: AttireConfig;
  gifts: GiftsConfig;
  entourage: EntourageConfig;
  faqs: FaqsConfig;
  venue: VenueConfig;
  music: MusicConfig;
  footer: FooterConfig;
}

// ─── Supabase DB types ────────────────────────────────────────────────────────

export interface WeddingSiteRow {
  id: string;
  slug: string;
  config: WeddingConfig;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface RsvpGuestRow {
  id: string;
  slug: string;
  name: string;
  group_id: string | null;
  group_name: string | null;
  attendance: "Going" | "Not Going" | "Maybe" | null;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      wedding_sites: {
        Row: WeddingSiteRow;
        Insert: Omit<WeddingSiteRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<WeddingSiteRow, "id" | "created_at">>;
      };
      rsvp_guests: {
        Row: RsvpGuestRow;
        Insert: Omit<RsvpGuestRow, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<RsvpGuestRow, "id">>;
      };
    };
  };
};
