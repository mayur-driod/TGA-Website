# TGA — The Green Alliance Website
## Frontend Build Specification (AGENTS.md)
### RV University, Bengaluru

> This document is the single source of truth for the AI agent building the TGA frontend.
> Work through each section in order. Do not skip sections. Each section references the ones before it.
> Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · ShadCN/ui · Framer Motion

---

## SECTION 0 — Project context and constraints

### Who this is for
The Green Alliance (TGA) is an environmental student club at RV University (RVU), Bengaluru. Activities include birdwatching, cleanup drives, expert talks, participation in global events (Great Backyard Bird Count, World Migratory Bird Day), and an ongoing biodiversity assessment of the RVU campus. Partner organisations: Ataavi Bird Foundation, Nature Conservation Foundation (NCF).

### What the site must do
- Showcase TGA's work, events, people, and mission (public)
- Allow RVU students to sign up and register for events (auth-gated, @rvu.edu.in only)
- Host a blog for writeups, trip reports, and awareness content
- Feature the biodiversity assessment with species counts and iNaturalist data
- Provide a contact channel for external collaborators and media
- Link out to the WhatsApp community for informal updates

### Hard constraints
- Auth is restricted to @rvu.edu.in email addresses only — enforced at the NextAuth signIn callback level
- No sensitive data (student details, exact locations) is exposed publicly
- All pages must be responsive — mobile is the primary device for most RVU students
- The site must be deployable on Vercel free tier
- Images are served via Cloudinary (not stored locally or in the DB)
- Google Forms links are used for event registrations in Phase 1 (native registration comes later)

### Design principles
- Earthy, nature-forward colour palette: forest green primary, amber and teal as accents
- Clean, modern typography — no decorative fonts
- Minimal UI chrome — whitespace is intentional
- Every public page must be readable without JavaScript (SSR/SSG)
- Animations are subtle and purposeful — use Framer Motion sparingly

---

## SECTION 1 — Repository setup and project scaffold

### 1.1 Initialise the project

Run the following exactly:

```bash
npx create-next-app@latest tga-website \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
cd tga-website
```

### 1.2 Install all dependencies

```bash
# ShadCN init (accept all defaults, use 'slate' as base colour — we'll override)
npx shadcn@latest init

# ShadCN components needed
npx shadcn@latest add button card badge separator sheet navigation-menu dialog tabs accordion avatar

# Animation
npm install framer-motion

# Icons
npm install lucide-react

# Fonts (already available via next/font — no extra install needed)

# Utilities
npm install clsx tailwind-merge class-variance-authority

# Email (for contact form — Phase 1 placeholder)
npm install resend

# Form handling
npm install react-hook-form zod @hookform/resolvers
```

### 1.3 Tailwind config — extend with TGA design tokens

Replace the contents of `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#EAF3DE',
          100: '#C0DD97',
          200: '#97C459',
          400: '#639922',
          600: '#3B6D11',
          800: '#27500A',
          900: '#173404',
        },
        amber: {
          50:  '#FAEEDA',
          100: '#FAC775',
          400: '#BA7517',
          600: '#854F0B',
          800: '#633806',
        },
        teal: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3B6D11',
          foreground: '#EAF3DE',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'count-up': 'countUp 1.5s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
export default config
```

Also install the typography plugin: `npm install @tailwindcss/typography tailwindcss-animate`

### 1.4 Font setup

In `src/app/layout.tsx`, import and use Geist font:

```typescript
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
```

Install: `npm install geist`

### 1.5 Global CSS variables

In `src/app/globals.css`, define:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  --primary: 96 30% 25%;
  --primary-foreground: 96 52% 93%;
  --secondary: 96 20% 96%;
  --secondary-foreground: 96 30% 20%;
  --muted: 96 10% 96%;
  --muted-foreground: 96 5% 45%;
  --accent: 96 25% 93%;
  --accent-foreground: 96 30% 15%;
  --border: 96 10% 90%;
  --input: 96 10% 90%;
  --ring: 96 30% 25%;
  --radius: 0.75rem;
}
```

---

## SECTION 2 — Folder structure

Create this exact structure inside `src/`:

```
src/
├── app/
│   ├── (public)/                    ← Route group: no auth required
│   │   ├── page.tsx                 ← Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx             ← Events listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx         ← Single event
│   │   ├── blog/
│   │   │   ├── page.tsx             ← Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx         ← Single post
│   │   ├── team/
│   │   │   └── page.tsx
│   │   ├── biodiversity/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── layout.tsx               ← Public layout (Navbar + Footer)
│   ├── (auth)/                      ← Route group: auth pages
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (protected)/                 ← Route group: requires session
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx               ← Middleware-protected layout
│   ├── api/                         ← API routes (Phase 2+, stubs only in Phase 1)
│   │   └── contact/
│   │       └── route.ts
│   ├── layout.tsx                   ← Root layout (fonts, metadata, providers)
│   └── globals.css
├── components/
│   ├── ui/                          ← ShadCN auto-generated components (do not edit)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── sections/                    ← Full-page sections used on home and other pages
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── ActivitiesGrid.tsx
│   │   ├── EventsPreview.tsx
│   │   ├── BiodiversityPreview.tsx
│   │   ├── PartnersBar.tsx
│   │   └── JoinSection.tsx
│   ├── cards/
│   │   ├── EventCard.tsx
│   │   ├── BlogCard.tsx
│   │   ├── TeamCard.tsx
│   │   └── ActivityCard.tsx
│   └── common/
│       ├── SectionLabel.tsx         ← Reusable "WHAT WE DO" uppercase label
│       ├── AnimatedCounter.tsx      ← Framer Motion number counter
│       ├── PageHeader.tsx           ← Hero banner for inner pages
│       └── ContactForm.tsx
├── lib/
│   ├── utils.ts                     ← cn() helper from ShadCN
│   ├── constants.ts                 ← NAV_LINKS, ACTIVITY_LIST, PARTNER_LIST, etc.
│   └── types.ts                     ← TypeScript interfaces for Event, BlogPost, Member, etc.
├── data/                            ← Static JSON data files (Phase 1 — no DB yet)
│   ├── events.json
│   ├── blog-posts.json
│   ├── team.json
│   └── biodiversity.json
└── hooks/
    └── useScrollAnimation.ts        ← IntersectionObserver hook for scroll reveals
```

---

## SECTION 3 — Static data files (Phase 1 seed data)

### 3.1 `src/data/events.json`

Create an array of at least 6 event objects. Each event object must match this shape exactly:

```typescript
{
  id: string,                 // e.g. "gbbc-2025"
  slug: string,               // URL-safe, e.g. "gbbc-2025-bird-count"
  title: string,
  type: "Birdwatch" | "Cleanup" | "Talk" | "Workshop" | "Campaign" | "Global event",
  date: string,               // ISO 8601, e.g. "2025-05-10"
  time: string,               // e.g. "6:00 AM – 8:30 AM"
  location: string,
  shortDescription: string,   // 1–2 sentences, shown on cards
  fullDescription: string,    // paragraph, shown on detail page
  spotsTotal: number,
  spotsLeft: number,
  registrationUrl: string,    // Google Form link for Phase 1
  coverImage: string,         // Cloudinary URL or placeholder string
  tags: string[],
  featured: boolean           // true for the one shown large on home page
}
```

Seed with these real events for TGA:
1. Summer dawn bird walk — RVU campus (featured: true)
2. Great Backyard Bird Count 2025 participation
3. Kengeri lake cleanup drive
4. Expert talk: Urban wildlife corridors in Bengaluru (NCF)
5. World Migratory Bird Day walk
6. Biodiversity assessment field day — open to volunteers

### 3.2 `src/data/blog-posts.json`

At least 4 posts. Each post object:

```typescript
{
  id: string,
  slug: string,
  title: string,
  excerpt: string,            // 2–3 sentences shown on card
  content: string,            // Full markdown/MDX content
  author: string,             // member name
  authorRole: string,
  date: string,               // ISO 8601
  coverImage: string,
  tags: string[],
  readingTimeMinutes: number
}
```

Seed with:
1. "What the GBBC taught us about Bengaluru's bird diversity"
2. "How to start birdwatching as a complete beginner"
3. "Our Kengeri lake cleanup: what we found and what it means"
4. "Meet the 68 bird species living on our campus"

### 3.3 `src/data/team.json`

Two arrays: `students` and `faculty`. Each member object:

```typescript
{
  id: string,
  name: string,
  role: string,               // e.g. "President", "Birdwatching Lead", "Faculty Advisor"
  department: string,         // RVU department/school
  year: string | null,        // "3rd Year" for students, null for faculty
  bio: string,                // 2–3 sentences
  avatar: string,             // Cloudinary URL or initials placeholder key
  interests: string[],        // e.g. ["Raptors", "Wetland birds", "Photography"]
  instagram: string | null,
  email: string | null
}
```

### 3.4 `src/data/biodiversity.json`

```typescript
{
  lastUpdated: string,        // ISO date
  totalSpecies: number,
  iNaturalistProjectUrl: string,
  groups: [
    {
      name: string,           // e.g. "Birds"
      count: number,
      icon: string,           // emoji or icon key
      highlight: string,      // e.g. "Indian Pitta sighted Dec 2024"
      color: string           // Tailwind color class string
    }
  ],
  recentObservations: [
    {
      species: string,
      commonName: string,
      date: string,
      observer: string,
      imageUrl: string | null
    }
  ]
}
```

---

## SECTION 4 — TypeScript types

Create `src/lib/types.ts` with interfaces that exactly match the JSON shapes defined in Section 3. Export all interfaces. Also add:

```typescript
export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  iconType: 'bird' | 'cleanup' | 'talk' | 'biodiversity' | 'campaign' | 'globe'
  colorScheme: 'forest' | 'amber' | 'teal'
  href: string
}

export interface StatItem {
  value: number
  suffix: string
  label: string
}

export interface Partner {
  name: string
  shortName: string
  url: string
}
```

---

## SECTION 5 — Constants file

Create `src/lib/constants.ts`. This is the single place all static config lives — never hardcode these values in components.

```typescript
export const SITE_NAME = "The Green Alliance"
export const SITE_TAGLINE = "A student led initiative to raise awareness"
export const SITE_URL = "https://thegreenalliancervuniversity.vercel.app/"
export const RVU_EMAIL_DOMAIN = "@rvu.edu.in"
export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/JfhVgBdd1wS0InWopFaBal?mode=gi_t"
export const INATURALIST_PROJECT_URL = "https://www.inaturalist.org/projects/wildlife-of-rv-university"

export const NAV_LINKS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Biodiversity", href: "/biodiversity" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
]

export const STATS: StatItem[] = [
  { value: 120, suffix: "+", label: "Active members" },
  { value: 48, suffix: "", label: "Events conducted" },
  { value: 200, suffix: "+", label: "Species documented" },
  { value: 3, suffix: "", label: "Partner organisations" },
]

export const PARTNERS: Partner[] = [
  { name: "Ataavi Bird Foundation", shortName: "Ataavi", url: "#" },
  { name: "Nature Conservation Foundation", shortName: "NCF", url: "https://ncf-india.org" },
  { name: "RV University", shortName: "RVU", url: "https://rvu.edu.in" },
  { name: "eBird India", shortName: "eBird", url: "https://ebird.org/india" },
]

export const ACTIVITIES: ActivityItem[] = [
  {
    id: "birdwatching",
    title: "Birdwatching walks",
    description: "Weekly campus birding sessions and participation in the Great Backyard Bird Count and eBird events.",
    iconType: "bird",
    colorScheme: "forest",
    href: "/events?type=Birdwatch",
  },
  {
    id: "cleanup",
    title: "Cleanup drives",
    description: "Campus and city-wide waste collection drives in partnership with local organisations and municipal bodies.",
    iconType: "cleanup",
    colorScheme: "amber",
    href: "/events?type=Cleanup",
  },
  {
    id: "talks",
    title: "Expert talks",
    description: "Regular seminars from field ecologists, wildlife photographers, policy experts, and conservation scientists.",
    iconType: "talk",
    colorScheme: "teal",
    href: "/events?type=Talk",
  },
  {
    id: "biodiversity",
    title: "Biodiversity assessment",
    description: "Ongoing systematic documentation of flora and fauna on the RVU campus using iNaturalist and field surveys.",
    iconType: "biodiversity",
    colorScheme: "forest",
    href: "/biodiversity",
  },
  {
    id: "campaigns",
    title: "Awareness campaigns",
    description: "Social media drives, workshops, and on-campus installations around World Environment Day and Earth Day.",
    iconType: "campaign",
    colorScheme: "amber",
    href: "/blog",
  },
  {
    id: "global",
    title: "Global events",
    description: "TGA participates in GBBC, World Migratory Bird Day, and coordinates with Ataavi Bird Foundation and NCF.",
    iconType: "globe",
    colorScheme: "teal",
    href: "/events?type=Global+event",
  },
]
```

---

## SECTION 6 — Root layout and metadata

### 6.1 `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'The Green Alliance — RV University',
    template: '%s | TGA',
  },
  description: 'The Green Alliance is RV University\'s student-led environmental club. We birdwatch, run cleanup drives, host expert talks, and conduct biodiversity assessments.',
  keywords: ['TGA', 'Green Alliance', 'RV University', 'birdwatching', 'conservation', 'Bengaluru', 'NCF', 'Ataavi'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tga.rvu.edu.in',
    siteName: 'The Green Alliance',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

### 6.2 `src/app/(public)/layout.tsx`

Wraps all public pages with Navbar and Footer:

```typescript
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

---

## SECTION 7 — Navbar component

File: `src/components/layout/Navbar.tsx`

### Requirements
- Sticky at the top (`sticky top-0 z-50`)
- White/translucent background with backdrop blur on scroll
- Left: TGA leaf logo + site name + "RV University, Bengaluru" subtext
- Centre (desktop): nav links from `NAV_LINKS` constant
- Right: "Join TGA" primary button
- Mobile: hamburger → Sheet (ShadCN) slide-out with all links + CTA
- Active link gets a subtle forest-green underline

### Scroll behaviour
Use a `useEffect` + `window.scrollY` listener to add a `border-b` class when scrolled past 10px. Start transparent, become `bg-white/90 backdrop-blur-md` on scroll.

### Logo mark
The leaf logo is an SVG: a rounded square rotated 45°, filled `#3B6D11`. See mockup in design context. Keep it as an inline SVG component `<LeafLogo />` in the same file.

### Mobile menu
Use ShadCN `Sheet` component. Trigger is a `Menu` icon (lucide-react). Sheet opens from the right. Contains: logo at top, all nav links as large text links, "Join TGA" button at the bottom, WhatsApp community link.

---

## SECTION 8 — Footer component

File: `src/components/layout/Footer.tsx`

### Layout (3-column on desktop, stacked on mobile)

Column 1 — Brand:
- Leaf logo + site name
- One-line mission statement
- "A student initiative at RV University, Bengaluru"
- Copyright line

Column 2 — Quick links:
- All NAV_LINKS
- Plus: "Join TGA", "Admin login"

Column 3 — Connect:
- Instagram link (icon + handle)
- WhatsApp community join link (icon + "Join our WhatsApp")
- Contact email: tga@rvu.edu.in (placeholder)
- iNaturalist project link

### Style
- `border-t border-forest-50`
- Background: `bg-forest-50/30` (very light green tint)
- All text: muted, small
- Leaf motif: subtle large leaf SVG in the background (opacity 3–5%) — position it absolute at bottom-right of the footer

---

## SECTION 9 — Home page sections

File: `src/app/(public)/page.tsx`

Import and render sections in this order:
1. `<HeroSection />`
2. `<StatsBar />`
3. `<ActivitiesGrid />`
4. `<EventsPreview />`
5. `<BiodiversityPreview />`
6. `<PartnersBar />`
7. `<JoinSection />`

Each section is a separate component file in `src/components/sections/`.

---

## SECTION 10 — HeroSection component

File: `src/components/sections/HeroSection.tsx`

### Layout
Two-column grid (desktop), stacked (mobile). Left: text. Right: photo mosaic.

### Left column content
- Badge pill: green dot + "Biodiversity assessment ongoing — RVU campus"
- `<h1>`: "Where *nature* meets student action" — the word "nature" in `text-forest-600`
- Subheading paragraph: TGA's mission in 2–3 sentences
- Two CTA buttons:
  - Primary (forest green, rounded-full): "Join the club →" → links to `/sign-up`
  - Secondary (outline, rounded-full): "Upcoming events" → links to `/events`

### Right column — photo mosaic
A 2×2 CSS grid with one tall cell (spans 2 rows). Each cell is a rounded div with a colored background placeholder. In production these become `next/image` components with Cloudinary URLs.

- Cell 1 (tall, forest-600): shows label "Birdwatching"
- Cell 2 (forest-200): "GBBC 2024"
- Cell 3 (forest-400): "Campus cleanup"

Add a subtle SVG bird silhouette watermark inside cell 1.

### Animation
On mount, left column fades up (`fadeUp` keyframe, 0.5s). Right column fades in with 0.2s delay. Use Framer Motion `motion.div` with `initial={{ opacity: 0, y: 30 }}` and `animate={{ opacity: 1, y: 0 }}`.

### Background
Very subtle dot grid pattern on the hero background using a CSS `background-image: radial-gradient(circle, #C0DD97 1px, transparent 1px)` at `background-size: 28px 28px` and `opacity: 0.3`.

---

## SECTION 11 — StatsBar component

File: `src/components/sections/StatsBar.tsx`

### Layout
Horizontal grid: `grid-cols-2 md:grid-cols-4`. Each cell is separated by a 1px border. Centered text.

### Data
Import `STATS` from constants. Each stat:
- Number: `text-3xl font-medium text-forest-600`
- Suffix: same style, inline
- Label: `text-sm text-muted-foreground`

### AnimatedCounter
Create `src/components/common/AnimatedCounter.tsx`. This component:
- Uses `IntersectionObserver` to detect when it enters the viewport
- Once visible, animates from 0 to `value` over 1.5s using `requestAnimationFrame`
- Only triggers once (disconnect observer after first trigger)
- Renders the number + suffix

Use this inside StatsBar instead of a static number.

---

## SECTION 12 — ActivitiesGrid component

File: `src/components/sections/ActivitiesGrid.tsx`

### Layout
`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`

### Header
Above the grid:
- `<SectionLabel>What we do</SectionLabel>`
- `<h2>Conservation through community</h2>`
- Subtitle paragraph

### ActivityCard component

File: `src/components/cards/ActivityCard.tsx`

Props: `ActivityItem` type from Section 4.

Each card:
- White background, `border border-border rounded-xl p-6`
- Hover: `hover:border-forest-100 hover:shadow-sm transition-all`
- Icon area: 36×36px rounded square, background matches `colorScheme`
  - `forest` → `bg-forest-50`
  - `amber` → `bg-amber-50`
  - `teal` → `bg-teal-50`
- Icon: inline SVG matching `iconType`. Build 6 SVG icons:
  - `bird`: simplified bird silhouette
  - `cleanup`: trash bag with leaf detail
  - `talk`: monitor/screen with person
  - `biodiversity`: magnifying glass over leaf
  - `campaign`: star/starburst
  - `globe`: globe with latitude lines
- Title: `text-sm font-medium`
- Description: `text-xs text-muted-foreground leading-relaxed`
- The entire card is a `<Link href={activity.href}>` wrapper

### Scroll animation
Each card fades up on scroll using `useScrollAnimation` hook. Stagger each card by `index * 0.08s` delay.

---

## SECTION 13 — EventsPreview component

File: `src/components/sections/EventsPreview.tsx`

### Data source
Import events from `src/data/events.json`. Filter to upcoming events (date >= today). Sort by date ascending. Take first 3. The one with `featured: true` is the large card.

### Layout
`grid-cols-1 lg:grid-cols-3 gap-5`. Featured event spans `lg:col-span-2` (or `lg:col-span-1` and the two small cards take `lg:col-span-2` — your call, but featured must be visually dominant).

### FeaturedEventCard (inline in EventsPreview or extract to cards/)
- Background: `bg-forest-50 border border-forest-100 rounded-xl p-6`
- Top row: `type` badge (forest pill) + date string right-aligned
- Title: `text-xl font-medium text-forest-900`
- Description paragraph
- Meta row: time · location · spots left
- "Register now" button → opens `event.registrationUrl` (Google Form) in new tab
- If `spotsLeft < 10`: show a "Only X spots left" warning badge in amber

### SmallEventCard
File: `src/components/cards/EventCard.tsx`

- White background, border, rounded-xl, p-5
- Date: small, muted
- Title: `text-sm font-medium`
- Description: `text-xs text-muted-foreground`
- Tag pill at bottom: event type
- Entire card links to `/events/[slug]`

### Section footer
"View all events →" right-aligned, links to `/events`.

---

## SECTION 14 — BiodiversityPreview component

File: `src/components/sections/BiodiversityPreview.tsx`

### Layout
Two-column (desktop). Left: text + species group tags. Right: visual mosaic.

### Left column
- Section label: "Biodiversity assessment"
- H2: "Mapping life on our campus"
- Paragraph: describe the ongoing survey
- Species group tags (from `biodiversity.json`): each is a pill with the group name + count
  - Birds: forest theme
  - Butterflies: amber theme
  - Reptiles: teal theme
  - Flora: purple (`#534AB7` from design palette)
- "Explore the assessment →" link → `/biodiversity`

### Right column — mosaic visual
A 4×4 CSS grid of small rounded cells. Each cell's opacity and shade of green is randomised from the forest palette. This creates an abstract heatmap-like visual. Underneath: "Ongoing · iNaturalist + field surveys" caption.

In a future iteration this becomes a real iNaturalist observation map. For now, static mosaic.

---

## SECTION 15 — PartnersBar component

File: `src/components/sections/PartnersBar.tsx`

### Layout
`border-t border-b border-border`. Horizontal flex row, wraps on mobile.

Contents:
- Left: "Associated with" label in `text-xs text-muted-foreground`
- Partner pills from `PARTNERS` constant: each is a `<a href={partner.url} target="_blank">` wrapped pill with `border rounded-full px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors`

---

## SECTION 16 — JoinSection component

File: `src/components/sections/JoinSection.tsx`

### Layout
Centred, `bg-forest-50/40`, `py-20 px-8`

### Contents
- Section label: "Become a member"
- H2: "Be part of the change"
- Subtext paragraph
- Email input row:
  - `<input type="email" placeholder="yourname@rvu.edu.in" />`
  - "Get started" button → on click, navigate to `/sign-up?email={value}`
- Below the row: `text-xs text-muted-foreground` — "Only @rvu.edu.in emails are accepted"
- WhatsApp link below that: "Or join our WhatsApp community →"

### Client component
This section must be `'use client'` because of the input state. All other sections can be server components.

---

## SECTION 17 — Events listing page

File: `src/app/(public)/events/page.tsx`

### Metadata
```typescript
export const metadata = { title: 'Events' }
```

### Layout
- `<PageHeader>` component at top: title "Events", subtitle, background uses a subtle leaf pattern
- Filter pills below header: "All" | "Birdwatch" | "Cleanup" | "Talk" | "Workshop" | "Campaign" | "Global event"
  - Clicking a pill filters the grid client-side (use `'use client'` + `useState` for active filter)
- Event grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Each event uses `EventCard` component
- Upcoming events section first, then Past events section (separated by a `<Separator>` with label)

### PageHeader component

File: `src/components/common/PageHeader.tsx`

Props: `{ title: string, subtitle?: string, badge?: string }`

- Full-width banner, `bg-forest-50`, `py-16 px-8`
- Subtle dot grid background (same as hero)
- Badge pill (optional)
- H1: large, `font-medium`
- Subtitle: muted paragraph

---

## SECTION 18 — Single event page

File: `src/app/(public)/events/[slug]/page.tsx`

### Data fetching (static)
```typescript
export async function generateStaticParams() {
  // return all event slugs from events.json
}
```

### Layout
- Back link: "← Back to events"
- Hero area: full-width cover image placeholder (or Cloudinary image)
- Two-column below: main content left, sidebar right

### Main content (left)
- Event type badge + date
- H1: event title
- Full description (with proper line breaks)
- "About this event" section

### Sidebar (right)
- Event details card:
  - Date and time
  - Location
  - Spots left (with progress bar if < 50% remaining)
  - "Register now" button → `event.registrationUrl` — opens Google Form in new tab
  - WhatsApp community link

---

## SECTION 19 — Blog listing page

File: `src/app/(public)/blog/page.tsx`

### Layout
- PageHeader: "Blog" with subtitle "Trip reports, spotting notes, and awareness writing from TGA members"
- Featured post: large card spanning full width at the top (most recent post)
- Grid below: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

### BlogCard component

File: `src/components/cards/BlogCard.tsx`

- Cover image area (placeholder div with forest-50 background)
- Tag pills
- Title: `text-base font-medium hover:text-forest-600 transition-colors`
- Excerpt: `text-sm text-muted-foreground`
- Bottom row: author name · date · reading time

### Featured BlogCard variant
Same component, `variant="featured"` prop. Larger, horizontal layout (image left, text right on desktop).

---

## SECTION 20 — Single blog post page

File: `src/app/(public)/blog/[slug]/page.tsx`

### Layout
- Max-width `max-w-2xl mx-auto px-4`
- Back link
- Tags
- H1
- Author row: avatar initials circle + name + role + date + reading time
- Separator
- Body: render `post.content` — use `@tailwindcss/typography` `prose prose-sm` class for automatic styling
- At the bottom: "More from TGA" — 3 related post cards

---

## SECTION 21 — Team page

File: `src/app/(public)/team/page.tsx`

### Layout
- PageHeader: "The team" with subtitle
- Faculty section first (usually 2–4 cards)
- Student section below with a `<Separator>` and "Student members" heading

### TeamCard component

File: `src/components/cards/TeamCard.tsx`

- Avatar: circle with initials (or real image if Cloudinary URL provided)
  - Initials background colour is derived from the person's name (simple hash → pick from palette)
- Name: `text-sm font-medium`
- Role: `text-xs text-forest-600`
- Department + year: `text-xs text-muted-foreground`
- Bio: `text-xs text-muted-foreground leading-relaxed`
- Interest tags: small pills at bottom
- Social icons: Instagram (if handle provided), Email (if provided)

### Grid
Faculty: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
Students: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` (slightly smaller cards)

---

## SECTION 22 — Biodiversity page

File: `src/app/(public)/biodiversity/page.tsx`

### Layout
- PageHeader: "Campus biodiversity assessment" with badge "Ongoing"

### Section 1 — Overview stats
4-card stat row (species group counts from `biodiversity.json`). Same AnimatedCounter pattern as StatsBar.

### Section 2 — Species groups
Grid of group cards. Each shows: group name, species count, highlight observation, color-themed icon.

### Section 3 — Recent observations
Table or card list of `recentObservations` from the JSON. Each row: species name, common name, observer, date. If `imageUrl` exists, show a small thumbnail.

### Section 4 — iNaturalist CTA
A full-width banner:
- "Follow our iNaturalist project for live data"
- Button: "View on iNaturalist →" → external link
- The button opens `INATURALIST_PROJECT_URL` in a new tab

### Section 5 — Methodology note
Simple prose section explaining how the survey is conducted (field transects, iNaturalist, eBird checklists). Pull content from a static string or a small markdown file.

---

## SECTION 23 — About page

File: `src/app/(public)/about/page.tsx`

### Layout (all sections stacked)

1. PageHeader: "About TGA"

2. Mission section (two-column):
   - Left: H2 "Our mission" + 2 paragraphs about TGA's founding, goals, philosophy
   - Right: a pull-quote or highlight stat block

3. What we do — short summary of activities (reuse `ActivitiesGrid` or a simplified version)

4. History / timeline section:
   - Simple vertical timeline component
   - 4–6 milestones: TGA founding, first GBBC participation, NCF partnership, biodiversity assessment launch, etc.
   - Each milestone: dot + year + title + one-line description

5. Partners section (reuse `PartnersBar`)

6. Join CTA (reuse `JoinSection`)

### Timeline component
Build inline in the page file. CSS: `border-l-2 border-forest-100 pl-6` with `relative before:absolute before:left-[-9px] before:top-1 before:w-4 before:h-4 before:rounded-full before:bg-forest-200` for each milestone dot.

---

## SECTION 24 — Contact page

File: `src/app/(public)/contact/page.tsx`

### Layout (two-column on desktop)

Left column — contact info:
- H1 "Get in touch"
- Subtitle: for media, collaborations, and questions
- Contact detail rows (icon + text):
  - Email: tga@rvu.edu.in
  - Location: RV University, Mysuru Road, Bengaluru 560059
  - WhatsApp: community join link
  - Instagram: @tga_rvu (placeholder)
- Partner reach-out note: for Ataavi/NCF collaborations, cc the faculty advisor

Right column — contact form:
Use `ContactForm` component.

### ContactForm component

File: `src/components/common/ContactForm.tsx`

This is a `'use client'` component. Fields:
- Name (required)
- Email (required, any domain — this is for external contacts)
- Subject (required)
- Message (required, textarea)
- Enquiry type: "Collaboration" | "Media" | "Student" | "Other" (radio or select)

Validation: `react-hook-form` + `zod` schema. On submit: POST to `/api/contact`. Show success/error state.

The `/api/contact/route.ts` stub should accept the body and for now just return `{ ok: true }`. Wire up Resend in Phase 2.

---

## SECTION 25 — Shared utility components

### SectionLabel component

File: `src/components/common/SectionLabel.tsx`

```typescript
// Renders: uppercase, letter-spaced, small, forest-green text
// Props: children (string), className?
// Example output: <p class="text-xs font-medium text-forest-600 tracking-widest uppercase">What we do</p>
```

### useScrollAnimation hook

File: `src/hooks/useScrollAnimation.ts`

```typescript
// Uses IntersectionObserver
// Returns: { ref, isVisible }
// Usage: attach ref to a container, use isVisible to conditionally apply animation classes
// Threshold: 0.1 (triggers when 10% of element is visible)
// Once: true (only triggers once, doesn't un-trigger on scroll up)
```

### AnimatedCounter component

File: `src/components/common/AnimatedCounter.tsx`

```typescript
// Props: value (number), suffix (string), duration (ms, default 1500)
// Uses useScrollAnimation internally — starts counting when visible
// Uses requestAnimationFrame for smooth animation
// Easing: ease-out (counts fast at first, slows down at the end)
```

---

## SECTION 26 — Icons

Create `src/components/icons/` folder with individual SVG icon components. All icons accept `className?: string` and `size?: number` (default 20) props. All use `currentColor` for fill/stroke so they inherit text colour.

Required icons:
- `BirdIcon.tsx` — simple bird silhouette
- `LeafIcon.tsx` — single leaf
- `GlobeIcon.tsx` — globe with latitude/longitude lines
- `CleanupIcon.tsx` — bag with leaf
- `BinocularsIcon.tsx` — binoculars (for birdwatching)
- `TalkIcon.tsx` — speech bubble or monitor
- `LeafLogo.tsx` — the TGA logo mark (rotated rounded square, filled)

Use these inside ActivityCard and anywhere an icon is needed. Do not use emoji.

---

## SECTION 27 — Responsive behaviour rules

Apply these breakpoint rules consistently across all components:

| Context | Mobile | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| Navbar | Hidden links, hamburger | Hidden links, hamburger | All links visible |
| Hero | Stacked, text first | Stacked | Two-column |
| Stats bar | 2×2 grid | 4-column | 4-column |
| Activities grid | 1 column | 2 columns | 3 columns |
| Events preview | Stacked | Stacked | 3-column |
| Team grid (students) | 2 columns | 3 columns | 4 columns |
| Blog grid | 1 column | 2 columns | 3 columns |
| Footer | Stacked | 2 columns | 3 columns |
| Contact | Stacked | Stacked | 2 columns |

All padding: `px-4 md:px-8 lg:px-12` unless the section is full-bleed.
Max content width: `max-w-7xl mx-auto` applied to a wrapper inside each section.

---

## SECTION 28 — Animation guidelines

Use Framer Motion only where it adds clear value. Do not animate everything.

### Use Framer Motion for:
- Hero section entrance (text slides up, image fades in)
- Page transitions (`AnimatePresence` with `opacity` only — no sliding pages)
- Modal/sheet open/close (ShadCN handles this, don't override)

### Use CSS animations + IntersectionObserver for:
- Cards fading up on scroll (Section 12 stagger)
- Stats counter (AnimatedCounter)
- Any repeated element (avoids large JS payload)

### Rules
- Duration: 0.3–0.5s for entrances, 0.15–0.2s for interactions (hover, click)
- Easing: `ease-out` for entrances, `ease-in-out` for hover
- `prefers-reduced-motion`: wrap all animations with `useReducedMotion()` from Framer Motion and skip animation if true
- Never animate `width`, `height`, or `background-color` — these cause layout thrash. Only animate `transform` and `opacity`

---

## SECTION 29 — Image handling rules

All images must be handled with `next/image` for optimisation.

### Cloudinary URLs
When a Cloudinary URL is present, use it directly in `next/image` `src`. Add `cloudinary.com` to `next.config.ts` remote patterns:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' },
    { protocol: 'https', hostname: 'www.inaturalist.org' },
  ],
}
```

### Placeholder state
When no image URL is available (most Phase 1 content), render a placeholder div:
- Background: `bg-forest-50`
- Overlay a subtle SVG pattern or leaf watermark
- Show the event/post title as text over it
- Never use broken `<img>` tags

### Aspect ratios
- Event cover: `aspect-video` (16:9)
- Blog cover: `aspect-[4/3]`
- Team avatars: `aspect-square`, `rounded-full`

---

## SECTION 30 — Accessibility requirements

Every component must meet these minimum requirements:

- All interactive elements must be focusable and have visible focus rings (`ring-2 ring-forest-400 ring-offset-2`)
- All images must have descriptive `alt` text. Placeholder divs need `role="img" aria-label="..."`
- Form inputs must have associated `<label>` elements (not just placeholder text)
- Colour contrast: all text on coloured backgrounds must meet WCAG AA (4.5:1 for body text, 3:1 for large text)
  - `text-forest-800` on `bg-forest-50` passes. Test any new combinations.
- Navigation must be keyboard-navigable. Tab order must be logical.
- Mobile menu must trap focus when open and restore focus when closed (ShadCN Sheet handles this automatically)
- Page `<h1>` must exist on every page, appear once, and describe the page

---

## SECTION 31 — SEO and metadata

Each page must export a `metadata` object. Use this pattern:

```typescript
// events/page.tsx
export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events from The Green Alliance — birdwalks, cleanup drives, expert talks, and more.',
}

// blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  }
}
```

All public pages must be statically rendered (SSG). Use `generateStaticParams` for dynamic routes. No `'use client'` on page files themselves — push interactivity down to leaf components.

---

## SECTION 32 — Phase 1 completion checklist

Before handing off Phase 1 as complete, verify every item:

**Pages**
- [ ] Home page — all 7 sections render correctly
- [ ] Events listing — filter pills work, cards render
- [ ] Single event — static params generated for all events in JSON
- [ ] Blog listing — featured + grid renders
- [ ] Single blog post — prose styles apply correctly
- [ ] Team page — faculty and students sections
- [ ] Biodiversity page — all 5 sections
- [ ] About page — timeline renders
- [ ] Contact page — form validates and submits (returns ok:true)

**Components**
- [ ] Navbar — desktop links + mobile sheet both work
- [ ] Footer — all links present and correct
- [ ] AnimatedCounter — counts up on scroll, not before
- [ ] ActivityCard — all 6 icons render
- [ ] EventCard (featured + small variants)
- [ ] BlogCard (featured + grid variants)
- [ ] TeamCard — initials avatar fallback works
- [ ] ContactForm — validation error states show correctly

**Quality**
- [ ] No TypeScript errors (`npx tsc --noEmit` passes)
- [ ] No console errors in browser
- [ ] Responsive on 375px (iPhone SE), 768px (iPad), 1280px (desktop)
- [ ] All external links open in `target="_blank" rel="noopener noreferrer"`
- [ ] All Google Form links open in new tab
- [ ] `next build` completes without errors
- [ ] Deployed to Vercel and accessible at preview URL

---

## SECTION 33 — What is NOT in Phase 1

Do not build these in Phase 1. They are Phase 2+ and will be specified separately:

- NextAuth integration (sign-in, sign-up, session, protected routes)
- Database (Prisma + Neon)
- Real event registration (native, not Google Forms)
- Member dashboard
- Admin panel (create/edit events and posts)
- Email sending (Resend integration)
- iNaturalist API live data pull
- Blog post CMS (all content is static JSON in Phase 1)
- Image upload via Cloudinary (images are hardcoded Cloudinary URLs or placeholders)
- WhatsApp Business API (just a join link)

---

## APPENDIX A — Colour quick reference

| Token | Hex | Use |
|---|---|---|
| `forest-50` | `#EAF3DE` | Backgrounds, badges |
| `forest-100` | `#C0DD97` | Borders, dividers |
| `forest-200` | `#97C459` | Icon backgrounds |
| `forest-400` | `#639922` | Mid-weight text on light bg |
| `forest-600` | `#3B6D11` | Primary colour, buttons, highlights |
| `forest-800` | `#27500A` | Dark text on coloured bg |
| `forest-900` | `#173404` | Darkest, headings on coloured bg |
| `amber-50` | `#FAEEDA` | Amber backgrounds |
| `amber-600` | `#854F0B` | Amber text on amber bg |
| `teal-50` | `#E1F5EE` | Teal backgrounds |
| `teal-600` | `#0F6E56` | Teal text on teal bg |

---

## APPENDIX B — Key third-party component sources

When the base ShadCN component is insufficient, use components from these sources. Always read the installation instructions for each before copying code.

- **21st.dev** — `NumberTicker` (stats counter), `AnimatedCard` variants
- **aceternity UI** — `AuroraBackground` (hero), `SpotlightCard` (featured event)
- **magic UI** — `ShimmerButton`, `AnimatedList` (recent observations)
- **ShadCN/ui** — Sheet, Dialog, Tabs, Accordion, Badge, Separator, Avatar, Card, Button

When using third-party components: copy only what you need, convert to TypeScript, ensure it respects `prefers-reduced-motion`, and verify dark mode compatibility.

---

## APPENDIX C — File naming conventions

- Pages: `page.tsx` (Next.js convention)
- Components: PascalCase, e.g. `EventCard.tsx`, `HeroSection.tsx`
- Hooks: camelCase, prefix `use`, e.g. `useScrollAnimation.ts`
- Data files: kebab-case, e.g. `blog-posts.json`
- Constants/types/utils: camelCase, e.g. `constants.ts`, `types.ts`
- CSS: global only in `globals.css` — all other styling via Tailwind classes inline

---

*End of TGA AGENTS.md — Phase 1 Frontend Specification*
*Version 1.0 · Generated for Codex / GitHub Copilot agent use*