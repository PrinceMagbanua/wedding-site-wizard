# Wedding Site Wizard — Claude Context

> Full project overview: [PROJECT.md](PROJECT.md)
> Dev server: `npm run dev` → port **8020**
> Type check: `npx tsc --noEmit`

---

## What This Is

A no-code wedding website builder. Couples use `/builder` to customize a wedding site inline, then publish it to Supabase. Guests visit `/site/:slug` to view details and RSVP. `/manage` is the RSVP admin dashboard.

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion + Supabase

---

## Builder Architecture

### State
- `src/hooks/useBuilderState.ts` — `useReducer` with a `WeddingConfig` state
- Actions: `SET_SECTION_TEXT`, `SET_FIELD`, `SET_CONFIG`, `RESET`
- `SET_FIELD` takes a `path` (dot-notation string) and `value` — handles nested updates via `setPath` utility
- `SET_SECTION_TEXT` is the same, used for text fields specifically
- Example: `dispatch({ type: "SET_FIELD", path: "venue.backgroundImage", value: url })`

### Context
- `src/components/builder/BuilderContext.tsx` exports `useBuilderContext()`
- Returns `{ isEditing: boolean }` — **defaults to `false`** outside the builder, so all sections render safely on the public site
- Only sections in the builder (via `SiteLayout`) get `isEditing: true`

### SiteLayout
- `src/components/builder/SiteLayout.tsx` — renders the full wedding site from config
- Wires all section props + callbacks
- Helper pattern: `const setText = (path) => (value) => dispatch({ type: "SET_SECTION_TEXT", path, value })`
- Helper for objects: `const setField = (path) => (value) => dispatch({ type: "SET_FIELD", path, value })`

---

## Editable Components (src/components/builder/editor/)

### EditableText
```tsx
<EditableText
  as="h1" | "h2" | "h3" | "h4" | "p" | "span"  // default "p"
  value={string}
  onChange={(v) => dispatch(...)}
  className="..."
  multiline={false}  // true allows Enter key for newlines
/>
```
- In **edit mode**: wraps in `div`/`span` with hover ring + pencil badge, `contentEditable`
- In **live mode**: renders plain `<Tag className={className}>{value}</Tag>` — zero overhead
- Hover ring: white ring + dark shadow (visible on both dark/light backgrounds)
- Badge: top-left, `opacity-0 → opacity-100` on group hover
- **Always put inside Framer Motion elements** (`<EditableText as="span">` inside `motion.h1`) — never replace the motion element itself

### EditableImage
```tsx
<EditableImage
  src={string}
  alt={string}
  onChange={(url) => dispatch(...)}
  className="..."
/>
```
- Edit mode: hover shows "Image" badge + click opens `ImageUploadModal`
- Uses `ImageUploadModal` internally

### EditableUrl
```tsx
<EditableUrl value={url} onChange={(url) => ...} addLabel="Maps Link">
  <a href={url}>Open Maps</a>  {/* rendered when URL is set */}
</EditableUrl>
```
- Edit + no URL: ghost dashed "Add X Link" button
- Edit + URL set: children with hover ring + "Edit link" badge
- Opens a Popover with URL input (Save / Clear / Enter / Escape)

### ImageManagerModal
```tsx
<ImageManagerModal
  open={boolean}
  onClose={() => ...}
  images={string[]}
  onChange={(srcs: string[]) => ...}
  title="Gallery Photos"
  maxImages={9}   // default 10
  minImages={0}   // default 0
/>
```
- Grid of thumbnails; each has Replace + × remove
- "Add" slot when `images.length < maxImages`
- Reuses `ImageUploadModal` internally for actual file picking
- **Render after `</section>` in a Fragment** (`<>...<section>...</section><ImageManagerModal/></>`)

---

## Section-by-Section Edit Capabilities

| Section | Editable fields | Image editing |
|---|---|---|
| HeroSection | Names, tagline, date | Background images (slideshow, via ImageManagerModal) |
| VenueSection | Venue name | Background + foreground images (via ImageManagerModal) |
| EventDetails | Day, date, ceremony/reception: label, time, venueName, address, mapUrl, wazeUrl | — |
| RSVPSection | Heading, subheading, instructions, noteTitle | — |
| AttireSection | Dresscode label/value/description, palette colors, inspoGroup label/description/looks | Inspo look images (inline) |
| GiftsSection | Heading, message, footnote | — |
| PhotoGallery | Gallery heading | Gallery photos (via ImageManagerModal, max 9) |
| Footer | Tagline | — |

---

## Key Gotchas

### Framer Motion stacking contexts
Framer Motion's `transform` (e.g. `style={{ y }}`) creates a new CSS stacking context. **z-index inside a motion div is scoped to that div's stacking context** — siblings outside it will stack above it regardless of z-index value. Fix: move interactive buttons *outside* animated divs, directly into the parent `<section>`.

Example: HeroSection's "Edit Background" button is a direct child of `<section>` at `z-40`, NOT inside the parallax `motion.div`.

### VenueSection pointer-events
- The foreground image container div has `pointer-events-none` — required or it blocks clicks to the venue name title above it
- The venue name title has `z-20` in edit mode, `z-10` in live mode

### Fragment wrapping for modals after `<section>`
When a modal needs to render after a `<section>` tag, the component's return must be `<>...<section>...</section><Modal/></>`.

### AttireSection inspoGroups
- Stored in `attire.inspoGroups` in config (not component-local state)
- Falls back to two default groups (For her / For him) when `inspoGroups` is empty
- Max 4 groups, max 4 looks per group, min 1 look per group
- Dispatched via `SET_FIELD path="attire.inspoGroups" value={newArray}`

### RSVP note toggle
- `rsvp.showNote: boolean` — toggle via `SET_FIELD path="rsvp.showNote" value={!current}`
- Hidden in live mode when false; in edit mode shows "Show note box" ghost button

---

## Data Model Quick Reference

`WeddingConfig` lives in `src/types/wedding.ts`. Key sections:
- `hero.backgroundImages: string[]` (array for slideshow)
- `venue.backgroundImage: string`, `venue.foregroundImage?: string`
- `events.ceremony` / `events.reception`: `{ label, time, venueName, address, mapUrl, wazeUrl? }`
- `attire.inspoGroups: AttireInspoGroup[]` — `{ label, description?, looks: { title, image }[] }`
- `rsvp.showNote: boolean`, `rsvp.noteTitle: string`
- `gifts.footnote: string`
- `footer.tagline: string`
- `gallery.images: ImageItem[]` — `{ src, alt }`

---

## Pending / Known Issues

- No auth on `/builder` or `/manage` — any user can access
- RSVP form on the guest site is not yet wired to the backend
- Images are Supabase Storage URLs (upload via `ImageUploadModal`) — base64 uploads should be avoided for performance
- `attire.inspoGroups` won't exist on sites saved before this field was added — `AttireSection` falls back to defaults when array is empty, so it degrades gracefully
