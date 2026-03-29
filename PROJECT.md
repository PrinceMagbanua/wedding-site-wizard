# Wedding Site Wizard — Project Context

## Purpose

A no-code wedding website builder that lets couples create and publish a fully customized wedding site in minutes. Guests visit the published site to view event details and RSVP. A separate admin view lets the couple or coordinator manage RSVPs.

This is a personal project — the site is built for real use (not as a SaaS product), deployed as a static site on GitHub Pages, with Supabase as the backend and Google Apps Script as the RSVP data layer.

---

## Current State (as of March 2026)

- Builder wizard is functional (3-step: Design → Palette → Editor)
- Published site rendering works via `/site/:slug`
- RSVP management page (`/manage`) is built with guest table, search/filter, and CSV export
- Deployed to GitHub Pages via `/docs` build output

---

## Direction / Roadmap

### What's working
- Design theme selection (classic, modern, romantic)
- Color palette selection (sage-garden, dusty-rose, navy, terracotta, etc.)
- Inline content editing (text, images, section visibility toggles)
- Site publishing to Supabase (config stored as JSON)
- Guest-facing published site with countdown, gallery, RSVP form
- RSVP management with update/export via Google Apps Script API

### Next priorities (to be continued)
- **Publish flow** — Finalize saving WeddingConfig to Supabase and generating a sharable slug URL
- **RSVP form → backend** — Wire the guest-facing RSVP form to actually submit to the Google Apps Script/Supabase backend
- **Authentication** — Add a simple password or magic-link auth so only the couple can access `/builder` and `/manage`
- **Image hosting** — Currently images are uploaded inline (base64 or blob); ideally move to Supabase Storage for hosted URLs
- **Mobile builder UX** — Builder is usable on desktop; mobile editing needs polish
- **More design variants** — Only 3 themes currently; expand to 5–6 with more layout diversity
- **Section order drag-and-drop** — Let users reorder sections in the editor step
- **Domain / CNAME** — Finalize custom domain config for GitHub Pages deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript 5 |
| Build tool | Vite 5 (output to `/docs` for GitHub Pages) |
| Styling | Tailwind CSS 3 + shadcn/ui + Radix UI |
| Routing | React Router DOM 6 |
| State | useReducer + React Context (no external store) |
| Data fetching | TanStack Query 5 + Supabase JS SDK |
| Forms | React Hook Form 7 + Zod |
| Animations | Framer Motion + Lenis (smooth scroll) |
| Database | Supabase (PostgreSQL) — stores `wedding_sites` and `rsvp_guests` |
| RSVP API | Google Apps Script (acts as a REST endpoint over Google Sheets) |
| Deployment | GitHub Pages (static, `/docs` folder) |

---

## Project Structure

```
wedding-site-wizard/
├── docs/                        # Built output → deployed to GitHub Pages
├── public/                      # Static assets (favicon, robots.txt, CNAME)
└── src/
    ├── assets/                  # Images (attire, music, photos)
    ├── components/
    │   ├── builder/             # Core builder logic
    │   │   ├── BuilderContext.tsx     # Context: config + dispatch + isEditing flag
    │   │   ├── BuilderWizard.tsx      # 3-step wizard shell
    │   │   ├── SiteLayout.tsx         # Renders wedding site from WeddingConfig
    │   │   ├── editor/                # In-place editing chrome
    │   │   │   ├── EditableText.tsx
    │   │   │   ├── EditableImage.tsx
    │   │   │   ├── EditorToolbar.tsx
    │   │   │   ├── ImageUploadModal.tsx
    │   │   │   └── SectionToggle.tsx
    │   │   └── steps/                 # Wizard step UIs
    │   │       ├── StepDesign.tsx     # Step 1: pick theme variant
    │   │       ├── StepPalette.tsx    # Step 2: pick color palette
    │   │       └── StepEditor.tsx     # Step 3: edit content + preview
    │   ├── rsvp-manager/        # Admin RSVP management UI
    │   │   ├── RsvpManagerDrawer.tsx
    │   │   ├── RsvpGuestTable.tsx
    │   │   └── RsvpCsvExport.tsx
    │   ├── ui/                  # shadcn/ui component library (~30 components)
    │   ├── AttireSection.tsx
    │   ├── BackgroundMusic.tsx
    │   ├── EventDetails.tsx
    │   ├── Footer.tsx
    │   ├── GiftsSection.tsx
    │   ├── GreetingSection.tsx
    │   ├── HeroSection.tsx      # Hero banner + countdown timer
    │   ├── ParallaxBackground.tsx
    │   ├── PhotoGallery.tsx
    │   ├── RSVPSection.tsx
    │   ├── SmoothScroll.tsx
    │   └── VenueSection.tsx
    ├── constants/
    │   └── palettes.ts          # Color palette definitions (HSL values)
    ├── hooks/
    │   ├── useBuilderState.ts   # useReducer — all builder state actions
    │   ├── useTheme.ts          # Applies theme colors as CSS variables
    │   ├── useWeddingSite.ts    # TanStack Query hook: fetch site by slug
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/
    │   ├── rsvpApi.ts           # Google Apps Script REST client (list/update)
    │   ├── supabase.ts          # Supabase client init
    │   └── utils.ts
    ├── pages/
    │   ├── Index.tsx            # Landing / demo page (/)
    │   ├── BuilderPage.tsx      # Builder wizard entry (/builder)
    │   ├── SiteRenderer.tsx     # Published site view (/site/:slug)
    │   ├── Manage.tsx           # RSVP admin (/manage)
    │   └── NotFound.tsx
    ├── types/
    │   └── wedding.ts           # All TypeScript types (WeddingConfig master type)
    ├── App.tsx                  # Router setup
    ├── index.css                # Tailwind base + CSS variable definitions
    └── main.tsx                 # React entry point
```

---

## Data Model

### `WeddingConfig` (stored as JSON in Supabase)
The single source of truth for a wedding site. Contains:
- `design` — theme variant + palette
- `themeColors` / `themeFonts` — resolved HSL colors + font names
- `hero` — couple names, date, background image
- `events` — ceremony and reception (time, location, map link)
- `gallery` — photo array
- `rsvp` — form config, deadline
- `attire` — dress code, color suggestions
- `gifts` — registry links or bank account info
- `entourage` — wedding party list
- `faqs` — Q&A pairs
- `venue` — background image + name
- `music` — background audio track
- `footer` — hashtag, copyright

### Supabase Tables
- `wedding_sites` — `id`, `slug`, `config` (JSON), `published`, `created_at`, `updated_at`
- `rsvp_guests` — `id`, `slug`, `name`, `group_id`, `group_name`, `attendance`, `updated_at`

### Google Apps Script
Acts as a secondary RSVP backend — exposes a REST endpoint over Google Sheets. `rsvpApi.ts` calls it with `list` and `update` operations. Includes retry logic with exponential backoff.

---

## Key Flows

### Builder flow
```
/builder
  → StepDesign (pick variant)
  → StepPalette (pick colors)
  → StepEditor (edit content inline, live preview via SiteLayout)
  → Publish → save WeddingConfig to Supabase → get slug URL
```

### Guest flow
```
/site/:slug
  → useWeddingSite fetches config from Supabase
  → SiteLayout renders read-only site
  → Guest fills RSVP → submits to Google Apps Script / Supabase
```

### Admin flow
```
/manage
  → Fetches RSVP list from Google Apps Script API
  → RsvpGuestTable: view, search, filter by attendance
  → Update attendance inline → POST back to API
  → Export to CSV
```

---

## Environment / Config Notes

- Dev server runs on port **8020** (`npm run dev`)
- Build output goes to `/docs` for GitHub Pages
- Supabase credentials go in `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Google Apps Script URL goes in `.env` as `VITE_RSVP_API_URL`
- CNAME file exists for custom domain setup on GitHub Pages
