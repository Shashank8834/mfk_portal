# MFK Portal — Project Context Document

> **Last Updated:** 2026-04-02  
> **Purpose:** Complete context for any AI model or developer continuing work on this project.

---

## 1. What Is This Project?

**Mentors for Kids (MFK) Foundation** website — a premium not-for-profit platform by **BCL India**, backed by **Zerodha**. URL: `mentorsforkids.in`

The portal connects donors, volunteers, and schools across Bangalore. It lets visitors **discover government schools, watch student stories via video, and optionally support students through donations**.

### Core Philosophy (IMPORTANT)
> **This is a STORY-FIRST platform, NOT a donation platform.**  
> The primary experience is watching student videos, reading their progress, and celebrating their journeys. Donations are a natural outcome of being moved by stories — they should NEVER feel like the primary CTA or focus. Think YouTube/Netflix for student stories, with an optional "support" layer.

---

## 2. Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| **Next.js** | Framework (App Router) | 16.2.2 |
| **TypeScript** | Language | 5.x |
| **Tailwind CSS** | Styling (v4 via `@tailwindcss/postcss`) | 4.x |
| **Framer Motion** | Animations & transitions | Latest |
| **Zustand** | Client state (favorites store) | Latest |
| **React Query** | Data fetching (planned, not yet wired) | Latest |
| **clsx + tailwind-merge** | Utility class merging | Latest |

### Planned Integrations (NOT yet implemented — using mocks)
| Service | Purpose | Status |
|---|---|---|
| Mapbox GL JS | Interactive school map | **MOCK** — using CSS dot-based map |
| UPI QR Code | Payment processing | **MOCK** — QR placeholder, swap with real UPI QR image |
| Firebase Auth | Phone OTP login | **MOCK** — UI flow only |
| Cloudinary | Video/image hosting | **MOCK** — using picsum.photos placeholders |
| Vercel | Deployment | Not deployed yet |

---

## 3. Project Structure

```
d:\Mfk_portal\app\                    ← Next.js project root (run npm commands here)
├── public/
│   └── mfk-logo.png                 ← MFK logo (purple + gold chevron figure)
├── src/
│   ├── app/                          ← Next.js App Router pages
│   │   ├── layout.tsx                ← Root layout (fonts, SEO metadata, providers)
│   │   ├── providers.tsx             ← Client providers (Navbar, Footer, Toast, etc.)
│   │   ├── template.tsx              ← Framer Motion page transitions
│   │   ├── globals.css               ← All styles: Tailwind @theme tokens, glassmorphism, scrollbar, mesh animations
│   │   ├── page.tsx                  ← Homepage (Hero + FeaturedStory + TrendingStories + ImpactNumbers + MissionStrip)
│   │   ├── stories/page.tsx          ← Student Stories feed (individual student grid with videos)
│   │   ├── map/page.tsx              ← School Map page (mock CSS map with pins)
│   │   ├── schools/page.tsx          ← Schools listing grid with search/filter
│   │   ├── schools/[id]/page.tsx     ← Individual school profile
│   │   ├── students/[id]/page.tsx    ← Individual student profile
│   │   ├── favorites/page.tsx        ← Saved favorites (localStorage, no login)
│   │   ├── donate/page.tsx           ← 5-step donation flow (mock)
│   │   └── auth/page.tsx             ← Phone OTP login (mock)
│   ├── components/
│   │   ├── home/
│   │   ├── Hero.tsx              ← Animated hero with gradient mesh, "Watch Stories" CTA
│   │   │   ├── FeaturedStory.tsx     ← Large spotlight card for a featured student + video
│   │   │   ├── TrendingStories.tsx   ← Netflix-style horizontal scroll of StudentCards
│   │   │   ├── ImpactNumbers.tsx     ← Animated counter metrics section
│   │   │   └── MissionStrip.tsx      ← 4-step "How It Works" flow
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            ← Desktop + mobile nav, glassmorphism on scroll
│   │   │   ├── MobileBottomNav.tsx   ← Fixed bottom bar (mobile only)
│   │   │   ├── Footer.tsx            ← Footer with Zerodha badge, WhatsApp, 80G notice
│   │   │   └── CommandPalette.tsx    ← Cmd+K search across students & schools
│   │   └── ui/
│   │       ├── AnimatedCounter.tsx   ← Scroll-triggered count-up with easing
│   │       ├── Badge.tsx             ← Colored tag/pill (teal/mint/gold/orange/muted)
│   │       ├── Button.tsx            ← 5 variants (primary/secondary/ghost/outline/gold)
│   │       ├── FavoriteButton.tsx    ← Animated heart toggle, Zustand-backed
│   │       ├── GlassCard.tsx         ← Glassmorphism card with hover glow
│   │       ├── Skeleton.tsx          ← Loading skeleton primitives
│   │       ├── StudentCard.tsx       ← Reusable card: thumbnail, play icon, badges, "Watch Story"
│   │       └── Toast.tsx             ← Toast notification system (success/error/info)
│   ├── data/
│   │   ├── schools.ts               ← 28 real Bangalore schools from PDF (with coords)
│   │   ├── students.ts              ← ~120 procedurally generated students
│   │   └── donors.ts                ← 12 mock donors
│   ├── hooks/
│   │   ├── useInView.ts             ← IntersectionObserver for scroll-triggered effects
│   │   └── useMediaQuery.ts         ← Responsive breakpoint detection
│   ├── lib/
│   │   └── utils.ts                 ← cn(), formatCurrency(), formatNumber(), getInitials()
│   ├── stores/
│   │   └── favoritesStore.ts        ← Zustand + localStorage persistence for favorites
│   └── types/
│       └── index.ts                 ← All TypeScript interfaces (School, Student, Video, Donor, etc.)
├── next.config.ts                    ← External image domains (picsum, dicebear, unsplash)
├── package.json
└── tsconfig.json
```

---

## 4. Design System

### Color Palette (defined in `globals.css` via `@theme`)
```
--bg-deep:      #050D1A    (page background)
--bg-card:      #0D1F35    (card surfaces)
--bg-elevated:  #132840    (hover / elevated)
--teal:         #00B4D8    (primary CTAs, links)
--teal-glow:    #00D4FF    (hover glow)
--mint:         #06D6A0    (success, impact numbers)
--gold:         #FFB703    (highlights, badges)
--orange:       #FB8500    (warmth, secondary accent)
--text-primary: #F0F6FF
--text-muted:   #7A94B0
--border:       rgba(0,180,216,0.15)
```

### Typography (Google Fonts, loaded in `layout.tsx`)
- **Display:** Plus Jakarta Sans — hero titles, stats, headings
- **Body:** Inter — paragraphs, labels, UI text
- **Mono:** JetBrains Mono — codes, IDs, tags, durations

### Style Patterns
- **Glassmorphism:** `backdrop-filter: blur(20px)`, semi-transparent bg, subtle border — via `.glass` / `.glass-elevated` CSS classes and `<GlassCard>` component
- **Hover glow:** `translateY(-4px)` + teal box-shadow — via `.card-hover-glow`
- **Gradient text:** `.gradient-text` class (teal → mint → gold)
- **Hero mesh:** Animated radial gradients in `.hero-mesh`
- **Custom scrollbar:** Thin, teal-tinted (`::-webkit-scrollbar`)

---

## 5. Current State — What's DONE

### ✅ Phase 1: Foundation + Homepage + Global Components
- [x] Next.js 16 project with TypeScript, Tailwind v4, Framer Motion
- [x] All fonts loaded (Plus Jakarta Sans, Inter, JetBrains Mono)
- [x] `globals.css` with full design system (colors, animations, glass effects, scrollbar)
- [x] TypeScript types for all data models
- [x] Mock data: 28 real schools, ~120 students, 12 donors
- [x] All UI components: Button, Badge, GlassCard, StudentCard, AnimatedCounter, FavoriteButton, Skeleton, Toast
- [x] Layout: Navbar (desktop + mobile), MobileBottomNav, Footer, CommandPalette (Cmd+K)
- [x] Zustand favorites store with localStorage persistence
- [x] Page transitions via Framer Motion `template.tsx`
- [x] Homepage: Hero, TrendingStories, ImpactNumbers, MissionStrip
- [x] Build succeeds with 0 errors (verified)

### ✅ Phase 2: Pages (all built and working)
- [x] `/map` — Mock map with positioned school dots, side drawer, search/filter
- [x] `/schools` — Grid listing with images, fund progress, status badges, search/filter
- [x] `/schools/[id]` — Profile with hero banner, about, student list, activity timeline, impact stats, fund progress
- [x] `/students/[id]` — Profile with avatar, video feed, progress panel, sponsor block, donor wall
- [x] `/favorites` — Masonry grid, empty state, sort controls, localStorage persistence
- [x] `/donate` — 5-step flow (choose type → select recipient → amount → confirm → success)
- [x] `/auth` — Phone OTP login with 6-digit auto-focus, countdown, WhatsApp option

### ✅ Story-First Rebalancing (COMPLETE)
The user flagged that the site felt "too donation-focused." All changes completed:
- [x] Hero: "Watch Stories" is primary CTA, "Explore Map" secondary (was "Donate Now")
- [x] Stat pills show "Stories Shared" instead of "₹ Donated"
- [x] **NEW `/stories` page** — grid feed of individual students with video thumbnails, play count badges, avatars, progress badges, search/sort/filter by school
- [x] **FeaturedStory section** added to homepage — large cinematic spotlight on one student
- [x] StudentCard: "Watch Story" button replaces "Sponsor" button, shows video count
- [x] Navbar: "Stories" link points to `/stories` (individual student feed)
- [x] MobileBottomNav: "Stories" tab with play icon as first tab
- [x] Student Profile: Hero video at top, journey narrative, support CTA pushed to subtle sidebar
- [x] School Profile: "Latest Stories" video feed leads main content, fund progress in sidebar
- [x] Schools page reverted to "All Schools" (directory), separate from stories
- [x] Softer donation language: "Support a Student" instead of "Donate Now" in mobile menu

---

## 6. What's NOT Built Yet (Future Phases)

### Phase 3: Auth + Integrations
- [ ] Firebase Auth: real phone OTP (currently mock UI)
- [ ] UPI QR: replace placeholder QR with real UPI QR code image
- [ ] WebAuthn biometric login
- [ ] Web OTP API (SMS autocomplete on mobile)

### Phase 4: Dashboards
- [ ] **Donor Dashboard** — impact header, sponsored students, donation history, CSR report download
- [ ] **Volunteer/Teacher Dashboard** — video upload portal, assigned students, journal log
- [ ] **School Admin Dashboard** — student roster, activity feed, fund status, CSV download
- [ ] Shared dashboard layout with sidebar navigation

### Phase 5: Admin + CSR + Polish
- [ ] **MFK Admin Dashboard** — overview, school management, bulk student upload, user roles, analytics
- [ ] **CSR Dashboard** — corporate portfolio, impact metrics, branded PDF reports, team management
- [ ] **Video Upload Portal** — drag-drop, Cloudinary direct upload, review queue
- [ ] Mapbox GL JS integration (replace mock CSS map)
- [ ] Cloudinary integration (replace picsum.photos placeholders)
- [ ] PWA manifest for mobile
- [ ] OG images for social sharing
- [ ] Error boundaries, 404/500 pages
- [ ] Lighthouse performance audit
- [ ] WCAG AA accessibility pass
- [ ] Vercel deployment

---

## 7. Data Sources

### Schools (real data)
- Source: `high_schools (1).pdf` in workspace root (`d:\Mfk_portal\`)
- Contains 35 Bangalore government high schools with names, addresses, headmasters, phone numbers
- 28 schools are loaded into `src/data/schools.ts` with approximate geo-coordinates

### Students (generated)
- Procedurally generated in `src/data/students.ts`
- ~120 students with realistic Indian names spread across all 28 schools
- Each has 2-5 mock videos with random activity types and dates
- Thumbnails from `picsum.photos`, avatars from `dicebear.com`

### Logo
- File: `MFK_Logo (1).png` in workspace root, copied to `public/mfk-logo.png`
- Design: Purple + gold chevron figure with "Mentors for Kids" text

---

## 8. How to Run

```bash
cd d:\Mfk_portal\app
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build (should complete with 0 errors)
```

### Routes (all working)
| Route | Description |
|---|---|
| `/` | Homepage |
| `/stories` | **Student Stories feed** (individual student grid) |
| `/map` | School map (mock) |
| `/schools` | Schools directory listing |
| `/schools/[id]` | School profile (e.g., `/schools/sch-001`) |
| `/students/[id]` | Student profile (e.g., `/students/stu-001`) |
| `/favorites` | Saved favorites |
| `/donate` | Donation flow (mock) |
| `/auth` | Phone login (mock) |

---

## 9. Key Design Decisions

1. **Tailwind v4** — Using `@theme` in CSS instead of `tailwind.config.ts`. All tokens defined in `globals.css`.
2. **No real backend** — All data is static/mock. React Query is installed but not wired. Easy to swap mock data for API calls later.
3. **Favorites without login** — Zustand + localStorage. Works immediately, no auth required.
4. **Glassmorphism everywhere** — `.glass` / `.glass-elevated` CSS classes + `<GlassCard>` component.
5. **External images** — Using `picsum.photos` for thumbnails and `dicebear.com` for avatars. Configured in `next.config.ts`.
6. **Story-first UX** — Primary CTAs are "Watch Story" / "Watch Stories". Donations are accessible but not aggressive.

---

## 10. Known Issues / Warnings

1. **Console warning** about logo image aspect ratio (minor, doesn't affect UX)
2. **Map is a mock** — CSS dots positioned by lat/lon math, not real Mapbox. Needs Mapbox API key to upgrade.
3. **No real video playback** — Thumbnails load from picsum.photos, video URLs point to sample files. Need Cloudinary integration.
4. **Hydration** — Favorites page has SSR-safe hydration handling (mounted state check) since localStorage is client-only.
5. **Mobile bottom nav** overlaps with sticky CTAs on school/student profile pages — needs z-index/spacing cleanup.

---

## 11. Original Spec Reference

The full original spec is in conversation history (conversation ID: `e0e10b88-33b8-41be-b2bc-7e490a7f44be`). It covers:
- Complete visual identity (palette, typography, effects)
- 13 pages with detailed feature requirements
- Performance rules (LCP < 2s, CLS < 0.1)
- Mobile-first rules (48px tap targets, bottom nav, swipe)
- Accessibility (WCAG AA, focus rings, ARIA labels)
- Integration specs (Mapbox, UPI, Firebase, Cloudinary)

The workspace also contains `MFK_Portal_v4.pptx` which may have additional design references.
