# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Nuxt dev server at http://localhost:3000
npm run build      # Build for production (Cloudflare Pages preset)
npm run preview    # Preview production build locally via Wrangler
npm run deploy     # Build + deploy to Cloudflare Pages
npm run cf-typegen # Regenerate Cloudflare Worker types
```

No linting or testing scripts are configured yet.

## Tech Stack

- **Nuxt 4** (Vue 3 Composition API, `<script setup>`) — SPA with no page routing, just scroll-based sections
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (not the PostCSS plugin)
- **GSAP 3** with ScrollTrigger for scroll-driven animations
- **Cloudflare Pages** deployment via Nitro's `cloudflare_pages` preset
- **Google Apps Script** for RSVP persistence (data flows to Google Sheets via a Web App endpoint)
- **Spotify API** — credentials configured in `.env`, endpoint stubbed but not wired to UI

## Architecture

The app is a single-page wedding invitation. `app/app.vue` is the root; all content is a vertical sequence of section components — no routing. Navigation is smooth-scroll by `#id`.

```
app/
  app.vue               # Root: SEO head, global layout, section ordering
  main.css              # Tailwind v4 theme: CSS variables, fonts (Cormorant Garamond + Outfit), glass utilities
  components/
    HeroSection.vue         # Countdown timer, CTA, fireworks trigger
    BackgroundStars.vue     # Canvas: animated stars + shooting stars
    BackgroundCanvas.vue    # Canvas: fireworks animation
    SectionHistory.vue      # GSAP timeline: vertical milestone timeline
    SectionLocation.vue     # Google Maps embeds, ceremony/reception details
    SectionParty.vue        # Bento grid: dress code, transport, hotel, playlist
    SectionPhotos.vue       # GSAP parallax masonry gallery
    SectionRsvp.vue         # RSVP form → /api/rsvp → Google Sheets
server/
  api/
    rsvp.post.ts            # Forwards POST body to $GOOGLE_SCRIPT_URL
```

## Key Patterns

**RSVP data flow:** `SectionRsvp.vue` POSTs `{ contact, attending, guests[], message }` via `$fetch('/api/rsvp')` → `server/api/rsvp.post.ts` → Google Apps Script Web App → Google Sheets. Submission state is persisted in `localStorage` (`wedding_rsvp_submitted`, `wedding_rsvp_data`) to show a success overlay on return visits.

**Animations:** GSAP ScrollTrigger is used for scroll-scrubbed parallax (History section line fill, Photos column offsets) and viewport-entry stagger reveals (Party bento items). Canvas animations (stars, fireworks) use raw `requestAnimationFrame` loops managed by Vue `ref`s and lifecycle hooks.

**Styling:** Dark-mode-only. Color tokens (`--wedding-dark`, `--wedding-light`, `--wedding-accent`) are defined as CSS variables in `main.css` and referenced via Tailwind. The custom `glass-dark` / `glass-light` utility classes are defined there too. Serif font (Cormorant Garamond) for display headings; Outfit for body text.

**Runtime config:** `GOOGLE_SCRIPT_URL` must be set in `.env` for RSVP submissions to reach Google Sheets. The server handler falls back gracefully when the URL is absent.

## Design Constraints

- 100% dark mode — no light mode support planned.
- No horizontal overflow allowed at root level (`overflow-x-hidden` on `<body>`).
- Canvas elements must handle `devicePixelRatio` scaling (capped at 1.5× for performance).
- Mobile-first responsive; star count and animation complexity are reduced on narrow viewports.
