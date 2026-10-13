# Magnevents Colour Design System Guidelines

> **Single Source of Truth** for all colour and visual styling decisions across the entire Magnevents digital ecosystem (`booking-platform`, `admin-portal`, marketing landing pages, and customer portals).
>
> **Version:** 1.0.0
> **Status:** Active & Mandatory
> **Target Audience:** Frontend Engineers, UI/UX Designers, Product Managers, and AI Coding Agents.

---

## Table of Contents

1. [Official Brand Colour Palette](#1-official-brand-colour-palette)
2. [Codebase Audit &amp; Discovered Inconsistencies](#2-codebase-audit--discovered-inconsistencies)
3. [Exact Colour Usage Rules](#3-exact-colour-usage-rules)
   - [Coral (`#E45F60`)](#coral--e45f60)
   - [Marigold (`#E8B943`)](#marigold--e8b943)
   - [Soft Charcoal (`#29272A`)](#soft-charcoal--29272a)
   - [Warm Ivory (`#F5F0E9`)](#warm-ivory--f5f0e9)
   - [Wine Red (`#7E3044`)](#wine-red--7e3044)
   - [Rose Stone (`#D8C4B7`)](#rose-stone--d8c4b7)
4. [Component Colour Matrix](#4-component-colour-matrix)
5. [Design Tokens &amp; Theme Architecture](#5-design-tokens--theme-architecture)
6. [Colour Accessibility &amp; WCAG 2.2 Standards](#6-colour-accessibility--wcag-22-standards)
7. [Gradients, Shadows, Glows &amp; Transparencies](#7-gradients-shadows-glows--transparencies)
8. [Strictly Prohibited Practices](#8-strictly-prohibited-practices)
9. [Implementation Roadmap &amp; Migration Checklist](#9-implementation-roadmap--migration-checklist)

---

## 1. Official Brand Colour Palette

Magnevents uses a curated six-colour palette inspired by Indian luxury, celebratory warmth, and contemporary high-end entertainment. Under no circumstances should these hex codes be altered or replaced with approximate variants.

| Colour Token            | Hex Code    | RGB                    | HSL                 | Semantic Role            | Primary Intent                                           |
| ----------------------- | ----------- | ---------------------- | ------------------- | ------------------------ | -------------------------------------------------------- |
| **Coral**         | `#E45F60` | `rgb(228, 95, 96)`   | `359°, 70%, 63%` | Primary Brand / Action   | Booking CTA buttons, confirmed badges, key highlights    |
| **Marigold**      | `#E8B943` | `rgb(232, 185, 67)`  | `43°, 78%, 59%`  | Secondary / Illumination | Star ratings, highlighted heading words, premium glows   |
| **Soft Charcoal** | `#29272A` | `rgb(41, 39, 42)`    | `280°, 4%, 16%`  | Dark Neutral / Surface   | Dark page canvas, glass card backings, navbar background |
| **Warm Ivory**    | `#F5F0E9` | `rgb(245, 240, 233)` | `35°, 38%, 94%`  | Light Neutral / Content  | Primary readable text, display headings, light accents   |
| **Wine Red**      | `#7E3044` | `rgb(126, 48, 68)`   | `345°, 45%, 34%` | Luxury Accent / Depth    | Premium badges, deep gradient stops, VIP borders         |
| **Rose Stone**    | `#D8C4B7` | `rgb(216, 196, 183)` | `24°, 32%, 78%`  | Border / Muted Neutral   | Card dividers, input outlines, muted secondary labels    |

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             BRAND SWATCHES                               │
│  [ #E45F60 ]   [ #E8B943 ]   [ #29272A ]   [ #F5F0E9 ]   [ #7E3044 ]   [ #D8C4B7 ]  │
│    Coral        Marigold      Charcoal       Ivory       Wine Red     Rose Stone │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Codebase Audit & Discovered Inconsistencies

An exhaustive audit of `booking-platform/` and `admin-portal/` revealed that while the core token definitions in [`tokens.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/tokens.css) and [`flow-unify.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/flow-unify.css) correctly declare the six official colours, several legacy, uncurated, and third-party colours have crept into individual stylesheets and components.

### 2.1 Confirmed Codebase Inconsistencies

| File Path                                                                                                                         | Off-Brand Colour Found                                                       | Context in Code                                                                         | Recommended Fix                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`ServicesPage.css:L6-16`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/ServicesPage.css#L6-L16)  | `#FF3D5E`, `#FF4FA2`, `#FFD166`, `#050505`, `#0F1117`, `#B9B9C8` | Local`:root` overriding global tokens with neon pink, neon red, and blue-tinted darks | Replace with`--color-coral`, `--color-marigold`, `--color-charcoal`, `--text-muted`                |
| [`AISearch.css:L10,27-28`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/AISearch.css#L10)         | `#07060d`, `rgba(139, 92, 246)`, `rgba(255, 46, 147)`                  | Cyberpunk purple/neon pink ambient glow and blue-black page background                  | Migrate to Wine Red (`#7E3044`) → Coral (`#E45F60`) → Marigold (`#E8B943`) luxury gradient         |
| [`Artists.css:L5,55-58`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/Artists.css#L5)             | `#000000`, `#D65050`, `rgba(214, 80, 80, 0.3)`                         | Pitch black page background and arbitrary dull brick-red active category filter button  | Replace`#000` with `--bg-base` (`#1c1a1d`), replace `#D65050` with `--color-coral` (`#E45F60`) |
| [`ArtistProfile.css:L2,18,38`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/ArtistProfile.css#L2) | `#030305`, `rgba(231, 40, 106, 0.1)`, `#0F1117`                        | Ink black background, hot pink spotlight glow, navy-black artist hero container         | Replace with Soft Charcoal (`#29272A`), Wine Red/Coral glow, and `--bg-card`                           |
| [`Book.css:L4,30,157`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/Book.css#L4)                  | `#0a0a0a`, `rgba(230, 126, 34, 0.05)`, `#EECE3B`                       | Cold grey page canvas, arbitrary carrot orange glow, yellow submit button               | Align page background with`--bg-base`, use Coral `#E45F60` for main submit button                      |
| [`PricingPage.css:L48,109`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/PricingPage.css#L48)     | `#8a8f98`                                                                  | Cool blue-grey muted text on subtitles and plan taglines                                | Replace with Warm Ivory muted:`rgba(245, 240, 233, 0.68)`                                                |
| [`Nav.css:L149-150,177,394`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/components/Nav.css#L149)      | `#1d1c1c`, `#070707`, `#313131`, `#080707`                           | Arbitrary near-black solids in mega-menu and mobile sliding panel                       | Replace with`var(--color-charcoal, #29272A)` and `var(--border-subtle)`                                |
| [`Nav.css:L540,547`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/components/Nav.css#L540)              | `#D65050`, `#b53e3e`                                                     | Arbitrary dull crimson in secondary mobile CTA                                          | Replace with`--color-coral` (`#E45F60`) or `--color-wine` (`#7E3044`)                              |
| [`Nav.css:L713,724`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/components/Nav.css#L713)              | `#8B5CF6`, `#EC4899`, `rgba(139, 92, 246, 0.4)`                        | Discord-purple and magenta in`.lux-nav-register-ai-btn`                               | Replace with luxury tri-color gradient: Wine Red → Coral → Marigold                                      |
| [`Footer.css:L2`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/components/Footer.css#L2)                | `#000000 !important`                                                       | Absolute stark black footer block                                                       | Soften to`--color-charcoal` (`#29272A`) or `--bg-base` (`#1c1a1d`)                                 |
| [`HomePage.css:L7060`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/HomePage.css#L7060)           | `#d64f50`, `#cf4f50`                                                     | Ad-hoc hover button darkeners scattered across CTA buttons                              | Use CSS`filter: brightness(0.92)` or structured token `--brand-coral-hover`                            |
| `admin-portal/`                                                                                                                 | `#6366F1`, `#06B6D4`, `#EEF2FF`                                        | Default Tailwind/shadcn indigo and cyan styling                                         | Phase 2 roadmap to incorporate Magnevents brand tokens into`tailwind.config.ts`                          |

---

## 3. Exact Colour Usage Rules

### Coral — `#E45F60`

**Psychological Role:** Excitement, celebratory energy, urgency, booking action.

#### Approved Uses

- **Primary CTA Buttons:** "Book Verified Artists", "Lock Slot", "Book Performance", "Register".
- **Primary Interactive States:** Hover states on key navigation items, active tab indicators, audio playing waves.
- **High-Priority Promotional Badges:** "Verified Pass", "Instant Booking Available", "Guaranteed Arrival".
- **Glow Accents:** Soft drop-shadow glow behind primary action buttons (`rgba(228, 95, 96, 0.35)`).
- **Subtle Decorative Elements:** Corner music note badges, notification dot alerts.

#### Prohibited Uses

- **Do not** use Coral for continuous body copy or paragraph blocks (causes extreme visual fatigue and fails readability).
- **Do not** use Coral for full page backgrounds or entire section backgrounds.
- **Do not** use Coral on every single heading, subheader, or divider line.
- **Do not** use Coral for secondary or tertiary buttons (demotes the visual hierarchy of the main CTA).

---

### Marigold — `#E8B943`

**Psychological Role:** Prestige, luxury, Indian wedding/event celebration, artistic excellence.

#### Approved Uses

- **Headline Highlights:** Specific emphasis words in main titles (e.g. "Top Punjabi Singer in *Delhi*", "Live Bands for *Weddings*").
- **Star Ratings:** 5-star review ratings, rating score counters (e.g. `★ 4.9/5`).
- **Artist Category & Genre Highlights:** Pill borders, genre titles (e.g. "SUFI & BOLLYWOOD"), verified star icons.
- **Pricing & Advance Numbers:** Exclusive rates, token amounts (e.g. `₹99 ONLY`, `Save ₹1,500`).
- **Interactive Focus & Hover Outlines:** Glow borders when focusing search inputs or hovering premium cards (`rgba(232, 185, 67, 0.45)`).

#### Prohibited Uses

- **Do not** use Marigold for small or fine body text on white/light backgrounds (contrast ratio is 1.61:1 — severe accessibility failure).
- **Do not** use Marigold for entire paragraph blocks.
- **Do not** use Marigold as a primary button background when Coral is available (Marigold is reserved for secondary distinction and ratings).

---

### Soft Charcoal — `#29272A`

**Psychological Role:** Premium theatre ambiance, deep acoustic contrast, cinematic luxury.

#### Approved Uses

- **Global Dark Page Canvas:** Background base for the entire application (`#1c1a1d` base to `#29272A` card layers).
- **Glassmorphic Cards & Modals:** Background for artist profile cards, search dropdowns, booking modals with blur (`rgba(41, 39, 42, 0.85)`).
- **Navigation Bar:** Fixed top bar and mobile bottom navigation backdrop.
- **Secondary/Ghost Buttons:** "View Profile", "Check Availability", "Cancel", filter chip buttons.
- **Dark Text on Light Surfaces:** When rendering content on Warm Ivory cards, Soft Charcoal is the primary high-contrast text color.

#### Prohibited Uses

- **Do not** replace Soft Charcoal with pure stark `#000000` (pitch black looks harsh, destroys depth, and causes harsh contrast halos on OLED displays).
- **Do not** use cool blue-blacks (e.g. `#0F1117`, `#07060d`) that conflict with the warm Indian celebratory palette.

---

### Warm Ivory — `#F5F0E9`

**Psychological Role:** Elegance, editorial sophistication, effortless legibility.

#### Approved Uses

- **Primary Body Copy & Headings:** H1, H2, H3, H4, and paragraph copy across all dark surfaces (achieves a 13.04:1 AAA contrast ratio).
- **Input Field Foreground:** Text entered by users in forms and search bars.
- **Light Theme / Contrast Panels:** Selected daytime event vouchers, receipt cards, and invoice modals.
- **Icon Colors:** Standard navigation icons, close `✕` buttons, and UI glyphs.

#### Prohibited Uses

- **Do not** use pure stark `#FFFFFF` (cold blue white) where Warm Ivory is intended; `#F5F0E9` preserves warmth.
- **Do not** use Warm Ivory as text on Marigold surfaces (causes severe contrast failure).

---

### Wine Red — `#7E3044`

**Psychological Role:** Royalty, deep richness, curated concierge exclusivity.

#### Approved Uses

- **Editorial & VIP Badges:** "Artist of the Month", "Celebrity Roster", "Curated Performer", Diwali Special Discount tags.
- **Deep Gradient Stops:** Foundation anchor in multi-color gradients (e.g. Wine Red `#7E3044` → Coral `#E45F60`).
- **Exclusive Booking Surfaces:** Special slot reservation cards, festival promotion headers.
- **Input Focus & Error State Outlines:** High-end validation outlines and subtle inner card borders.

#### Prohibited Uses

- **Do not** use Wine Red as small text directly over Soft Charcoal without a high-contrast container (contrast ratio is only 1.69:1).
- **Do not** use Wine Red to replace primary conversion buttons where immediate user eye-capture (Coral) is essential.

---

### Rose Stone — `#D8C4B7`

**Psychological Role:** Architecture, stone warmth, refined subtlety.

#### Approved Uses

- **Dividers & Borders:** Subtle 1px borders on cards, table separators, header bottom borders (`rgba(216, 196, 183, 0.18)` to `0.30`).
- **Secondary & Muted Copy:** Timestamp labels, location subtitles (e.g. "Delhi NCR • 50+ Shows"), input field placeholder text.
- **Neutral Card Outlines:** Non-hovered state card boundaries.
- **Progress Trackers & Inactive Dots:** Inactive slider dots, stepper line dividers.

#### Prohibited Uses

- **Do not** use Rose Stone for tiny low-contrast text (below 12px) in critical transactional areas.
- **Do not** use Rose Stone as a primary CTA button fill.

---

## 4. Component Colour Matrix

| Component                 | Element                 | Dark Theme (Primary Site Visuals)                                                  | Light Theme / Inverted Panels                                 |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Main Canvas**     | Page Background         | `var(--bg-base, #1c1a1d)`                                                        | `var(--color-ivory, #F5F0E9)`                               |
|                           | Radial Ambience         | Radial gradients of`#7E3044` & `#E45F60` at 10–18% opacity                    | Radial gradients of`#D8C4B7` at 20%                         |
| **Navbar**          | Background              | `rgba(41, 39, 42, 0.92)` + `backdrop-filter: blur(24px)`                       | `rgba(245, 240, 233, 0.94)`                                 |
|                           | Border Bottom           | `rgba(216, 196, 183, 0.16)`                                                      | `rgba(41, 39, 42, 0.12)`                                    |
|                           | Links (Default / Hover) | `#F5F0E9` (70%) → `#E8B943`                                                   | `#29272A` (75%) → `#E45F60`                              |
|                           | Primary Register CTA    | Fill:`#E45F60` • Text: `#FFFFFF` • Shadow: `rgba(228, 95, 96, 0.35)`       | Fill:`#E45F60` • Text: `#FFFFFF`                         |
|                           | AI Search Nav Button    | Fill:`rgba(126, 48, 68, 0.35)` • Border: `#E8B943` (45%) • Text: `#E8B943` | Fill:`rgba(126, 48, 68, 0.1)` • Border: `#7E3044`        |
| **Hero Section**    | Headline Primary Text   | `var(--color-ivory, #F5F0E9)`                                                    | `var(--color-charcoal, #29272A)`                            |
|                           | Headline Gold Highlight | `var(--color-marigold, #E8B943)`                                                 | `var(--color-wine, #7E3044)`                                |
|                           | Trust Badge             | Fill:`rgba(41, 39, 42, 0.7)` • Border: `#D8C4B7` (25%) • Text: `#F5F0E9`   | Fill:`#F5F0E9` • Border: `#D8C4B7`                       |
|                           | Primary Button          | Fill:`#E45F60` • Text: `#FFFFFF` • Hover: `filter: brightness(0.92)`       | Fill:`#E45F60` • Text: `#FFFFFF`                         |
|                           | Secondary Glass Button  | Fill:`#29272A` • Border: `#D8C4B7` (32%) • Text: `#F5F0E9`                 | Fill:`#FFFFFF` • Border: `#D8C4B7`                       |
| **Artist Cards**    | Card Background         | `rgba(41, 39, 42, 0.85)` + blur • Border: `#D8C4B7` (20%)                     | Fill:`#FFFFFF` • Border: `#D8C4B7` (50%)                 |
|                           | Card Hover State        | Border:`#E8B943` (45%) • Glow: `rgba(228, 95, 96, 0.16)`                      | Border:`#E45F60` • Shadow: `0 12px 30px rgba(0,0,0,0.1)` |
|                           | Artist Name             | `var(--color-ivory, #F5F0E9)` (700 weight)                                       | `var(--color-charcoal, #29272A)`                            |
|                           | Category / Genre Pill   | Fill:`rgba(126, 48, 68, 0.28)` • Border: `#E8B943` (25%) • Text: `#E8B943` | Fill:`rgba(126, 48, 68, 0.1)` • Text: `#7E3044`          |
|                           | Star Rating             | Stars:`var(--color-marigold, #E8B943)` • Text: `#E8B943`                      | Stars:`#E8B943` • Text: `#29272A`                        |
|                           | Card CTA Button         | Fill:`#E45F60` • Text: `#FFFFFF`                                              | Fill:`#E45F60` • Text: `#FFFFFF`                         |
| **Top Performer**   | Card Background         | `rgba(41, 39, 42, 0.88)` • Border: `#D8C4B7` (22%)                            | Fill:`#F5F0E9` • Border: `#D8C4B7`                       |
|                           | Award Badge             | Gradient:`#7E3044` → `#E45F60` • Text: `#FFFFFF`                           | Gradient:`#7E3044` → `#E45F60`                           |
|                           | Exclusive Price Row     | Fill:`rgba(126, 48, 68, 0.22)` • Border: `#E8B943` (35%) • Text: `#E8B943` | Fill:`rgba(126, 48, 68, 0.08)` • Text: `#7E3044`         |
| **Forms & Inputs**  | Field Background        | `rgba(255, 255, 255, 0.04)` to `#FFFFFF` (on beige cards)                      | `#FFFFFF`                                                   |
|                           | Field Border (Idle)     | `rgba(216, 196, 183, 0.25)`                                                      | `rgba(41, 39, 42, 0.2)`                                     |
|                           | Field Border (Focus)    | `1.5px solid var(--color-wine, #7E3044)` or `#E8B943` • Ring: 3px             | `1.5px solid #E45F60`                                       |
|                           | Field Border (Error)    | `1.5px solid var(--color-coral, #E45F60)` • Text: `#E45F60`                   | `1.5px solid #E45F60`                                       |
|                           | Placeholder Text        | `rgba(245, 240, 233, 0.45)`                                                      | `rgba(41, 39, 42, 0.45)`                                    |
| **Modals / Popups** | Backdrop                | `rgba(5, 7, 10, 0.85)` + `backdrop-filter: blur(24px)`                         | `rgba(41, 39, 42, 0.65)`                                    |
|                           | Modal Card Fill         | Radial:`#7E3044` (20%) → `#29272A` (98%) • Border: `#D8C4B7` (24%)         | Fill:`#D8C4B7` (Beige lux) • Border: `#7E3044` (25%)     |
|                           | Submit Button           | Fill:`#7E3044` to `#E45F60` • Text: `#FFFFFF`                               | Fill:`#7E3044` • Text: `#FFFFFF`                         |
|                           | Close Button (✕)       | Fill:`rgba(255, 255, 255, 0.08)` • Text: `#F5F0E9`                            | Fill:`rgba(126, 48, 68, 0.1)` • Text: `#7E3044`          |
| **Footer**          | Background              | `var(--color-charcoal, #29272A)` (80%) to `#1c1a1d`                            | `var(--color-charcoal, #29272A)`                            |
|                           | Heading / Body          | Headings:`#F5F0E9` • Links: `rgba(245, 240, 233, 0.65)`                       | Headings:`#F5F0E9` • Links: `rgba(245, 240, 233, 0.65)`  |
|                           | Social Icons Hover      | Fill:`#E45F60` • Border: `#E45F60` • Text: `#FFFFFF`                       | Fill:`#E45F60` • Text: `#FFFFFF`                         |
| **Third-Party**     | WhatsApp Widget         | Fill:`#25D366` to `#128C7E` (Platform standard) • Text: `#FFFFFF`           | Fill:`#25D366`                                              |

---

## 5. Design Tokens & Theme Architecture

### 5.1 CSS Variables Integration (`tokens.css`)

All applications must reference tokens from the central [`tokens.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/tokens.css) file. Do not invent duplicate token names.

```css
:root {
  /* =====================================================================
     1. OFFICIAL BRAND CORE PALETTE (IMMUTABLE HEX VALUES)
     ===================================================================== */
  --color-coral:      #E45F60;
  --color-marigold:   #E8B943;
  --color-charcoal:   #29272A;
  --color-ivory:      #F5F0E9;
  --color-wine:       #7E3044;
  --color-rose-stone: #D8C4B7;

  /* =====================================================================
     2. SEMANTIC ROLES
     ===================================================================== */
  --brand-primary:    var(--color-coral);      /* Primary action/CTA */
  --brand-secondary:  var(--color-marigold);   /* Highlighting/ratings */
  --brand-accent:     var(--color-wine);       /* VIP/curated accents */
  --brand-surface:    var(--color-charcoal);   /* Card & modal backings */
  --brand-canvas:     #1c1a1d;                 /* Deep baseline canvas */

  /* =====================================================================
     3. TYPOGRAPHY FOREGROUNDS
     ===================================================================== */
  --text-primary:     var(--color-ivory);
  --text-secondary:   rgba(245, 240, 233, 0.72);
  --text-muted:       rgba(245, 240, 233, 0.55);
  --text-faint:       rgba(245, 240, 233, 0.35);
  --text-inverse:     var(--color-charcoal);

  /* =====================================================================
     4. BORDERS & DIVIDERS
     ===================================================================== */
  --border-faint:     rgba(216, 196, 183, 0.12);
  --border-subtle:    rgba(216, 196, 183, 0.20);
  --border-default:   rgba(216, 196, 183, 0.32);
  --border-focus:     var(--color-marigold);
  --border-active:    var(--color-coral);
  --border-vip:       var(--color-wine);

  /* =====================================================================
     5. GLOWS & AMBIENCE (RESTRICTED OPACITIES)
     ===================================================================== */
  --glow-coral:       rgba(228, 95, 96, 0.25);
  --glow-marigold:    rgba(232, 185, 67, 0.20);
  --glow-wine:        rgba(126, 48, 68, 0.22);

  /* =====================================================================
     6. STATUS INDICATORS (FUNCTIONAL ACCESSIBILITY)
     ===================================================================== */
  --status-success:   #22C55E;
  --status-error:     var(--color-coral);
  --status-warning:   var(--color-marigold);
  --status-info:      #38BDF8;
}
```

### 5.2 Tailwind CSS Extension (for `admin-portal`)

To align [`admin-portal/tailwind.config.ts`](file:///c:/Users/avani/Desktop/magnivents/admin-portal/tailwind.config.ts) with the brand system without breaking existing dashboard functionality:

```typescript
// admin-portal/tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        magnevents: {
          coral:      '#E45F60',
          marigold:   '#E8B943',
          charcoal:   '#29272A',
          ivory:      '#F5F0E9',
          wine:       '#7E3044',
          rose:       '#D8C4B7',
        },
      },
    },
  },
}
```

---

## 6. Colour Accessibility & WCAG 2.2 Standards

All UI elements must comply with **WCAG 2.2 Level AA** (minimum contrast 4.5:1 for normal text, 3:1 for large text $\ge$ 18.5px bold or $\ge$ 24px regular, and 3:1 for graphical UI components/borders).

### 6.1 Contrast Ratio Validation Table

| Foreground Colour                     | Background Colour                     | Contrast Ratio      | WCAG 2.2 AA Result             | Permitted Use Cases                                                            |
| ------------------------------------- | ------------------------------------- | ------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| **Warm Ivory (`#F5F0E9`)**    | **Soft Charcoal (`#29272A`)** | **13.04 : 1** | **PASS (AAA)**           | Primary text, body copy, all headings on dark surfaces                         |
| **Marigold (`#E8B943`)**      | **Soft Charcoal (`#29272A`)** | **8.08 : 1**  | **PASS (AAA)**           | Heading accents, review scores, genre tags, badges                             |
| **Rose Stone (`#D8C4B7`)**    | **Soft Charcoal (`#29272A`)** | **8.82 : 1**  | **PASS (AAA)**           | Secondary labels, location tags, subtext on cards                              |
| **Warm Ivory (`#F5F0E9`)**    | **Wine Red (`#7E3044`)**      | **7.72 : 1**  | **PASS (AAA)**           | White/Ivory text inside Wine Red badges and buttons                            |
| **Coral (`#E45F60`)**         | **Soft Charcoal (`#29272A`)** | **4.29 : 1**  | **PASS (AA Large / UI)** | Headings$\ge$ 18.5px bold, icons, buttons. **Not** for body paragraphs |
| **White (`#FFFFFF`)**         | **Coral (`#E45F60`)**         | **3.46 : 1**  | **PASS (AA Large / UI)** | Primary button text ($\ge$ 14px bold, font-weight 700+ required)             |
| **Soft Charcoal (`#29272A`)** | **Warm Ivory (`#F5F0E9`)**    | **13.04 : 1** | **PASS (AAA)**           | Dark text on light theme voucher / print surfaces                              |
| **Soft Charcoal (`#29272A`)** | **Marigold (`#E8B943`)**      | **8.08 : 1**  | **PASS (AAA)**           | Dark text inside gold buttons/tags                                             |
| *Warm Ivory (`#F5F0E9`)*          | *Marigold (`#E8B943`)*            | *1.61 : 1*        | **FAIL**                 | **STRICTLY PROHIBITED.** Unreadable glare                                |
| *Wine Red (`#7E3044`)*            | *Soft Charcoal (`#29272A`)*       | *1.69 : 1*        | **FAIL**                 | **STRICTLY PROHIBITED.** Dark text on dark surface                       |

### 6.2 Key Accessibility Imperatives

1. **Never communicate state by colour alone:**
   - Error inputs must display both an outline highlight (`#E45F60`) **and** an inline text message or icon.
   - Verified performers must include a badge icon (`🛡️` or `✓`) in addition to any highlight color.
2. **Visible Focus Rings for Keyboard Navigation:**
   - Every interactive element (`<button>`, `<a>`, `<input>`) must feature an explicit focus ring:
     ```css
     :focus-visible {
       outline: 2px solid var(--color-marigold, #E8B943);
       outline-offset: 3px;
     }
     ```
3. **Muted Text Checks:**
   - Secondary text with opacity must never drop below `rgba(245, 240, 233, 0.55)` on `#29272A`. Any lower opacity violates AA standards.

---

## 7. Gradients, Shadows, Glows & Transparencies

All luminous effects must remain restrained and luxurious. Neon multi-color washes are strictly forbidden.

### 7.1 Official Gradients

#### 1. The Celebration Action Gradient (Primary CTA & Badges)

Blends Wine Red to Coral for organic depth:

```css
background: linear-gradient(135deg, var(--color-wine, #7E3044) 0%, var(--color-coral, #E45F60) 100%);
```

#### 2. The Golden Luminary Gradient (High-Ticket Prices & Rating Highlights)

Smooth metallic sheen without garish yellowing:

```css
background: linear-gradient(135deg, #FFF0B8 0%, var(--color-marigold, #E8B943) 50%, #C89427 100%);
```

#### 3. The Royal Concierge Tri-Gradient (Special Occasion / AI Widget)

Transitions from Wine to Coral to Marigold:

```css
background: linear-gradient(135deg, var(--color-wine, #7E3044) 0%, var(--color-coral, #E45F60) 60%, var(--color-marigold, #E8B943) 100%);
```

#### 4. The Theatre Canvas Ambient Glow (Page Backgrounds)

Subtle radial background drift:

```css
background: radial-gradient(circle at 50% 0%, rgba(126, 48, 68, 0.18) 0%, rgba(41, 39, 42, 0.95) 60%, var(--bg-base) 100%);
```

### 7.2 Shadows & Glow Rules

- **Card Hover Elevation:**
  ```css
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.70), 0 0 20px rgba(228, 95, 96, 0.15);
  ```
- **Primary CTA Button Glow:**
  ```css
  box-shadow: 0 6px 20px rgba(228, 95, 96, 0.35);
  ```
- **Max Glow Rule:** Never exceed `0.45` alpha on glows or box-shadows. Neon laser effects belong in sci-fi games, not luxury live performance booking.

---

## 8. Strictly Prohibited Practices

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROHIBITED PRACTICES                            │
├────────────────────────────────────────────────────────────────────────┤
│ ❌ Modifying brand hex values (#E45F60, #E8B943, #29272A, #F5F0E9,    │
│    #7E3044, #D8C4B7).                                                 │
│ ❌ Inventing random intermediary shades (e.g. #D65050, #b53e3e,        │
│    #cf4f50, #EECE3B).                                                  │
│ ❌ Introducing unapproved hues (Cyberpunk Purple #8B5CF6, Hot Pink     │
│    #FF4FA2, Neon Cyan #06B6D4) into consumer UI.                      │
│ ❌ Using pitch black (#000000) for large card surfaces or footers.    │
│ ❌ Setting Marigold (#E8B943) for entire multi-paragraph text blocks. │
│ ❌ Rendering Warm Ivory (#F5F0E9) text directly on Marigold.           │
│ ❌ Rendering Wine Red (#7E3044) text directly on Soft Charcoal.        │
│ ❌ Hardcoding raw hex values in individual component files instead    │
│    of using tokens.css variables.                                      │
│ ❌ Removing functional WhatsApp green (#25D366) in favor of brand red. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Implementation Roadmap & Migration Checklist

### 9.1 Architecture Overview

- **`booking-platform/`:** Pure CSS / Modern Vanilla CSS architecture. Global tokens are centralized in `app/styles/tokens.css` and imported into `app/layout.jsx`.
- **`admin-portal/`:** Tailwind CSS + shadcn-ui + Radix primitives.

### 9.2 Step-by-Step Migration Order

- [ ] **Phase 1: Token Unification in `booking-platform/app/styles/tokens.css`**

  - Verify that `--color-coral`, `--color-marigold`, `--color-charcoal`, `--color-ivory`, `--color-wine`, and `--color-rose-stone` are the root variables.
  - Deprecate old aliases (`--brand-ruby`, `--brand-gold`, `--glow-red`) by mapping them directly to official variables.
- [ ] **Phase 2: Remove Hardcoded Inconsistencies in Page Styles**

  - Refactor [`ServicesPage.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/ServicesPage.css): Delete duplicate `:root` (remove `#FF3D5E`, `#FF4FA2`, `#FFD166`, `#0F1117`).
  - Refactor [`AISearch.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/AISearch.css): Replace purple/pink ambient glows with Wine Red & Marigold glows.
  - Refactor [`Artists.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/Artists.css): Replace `#000` with `--bg-base` and `#D65050` with `--color-coral`.
  - Refactor [`Book.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/Book.css): Replace `#0a0a0a` and yellow button gradient with Coral CTA.
  - Refactor [`PricingPage.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/pages/PricingPage.css): Replace `#8a8f98` with `--text-muted`.
  - Refactor [`Nav.css`](file:///c:/Users/avani/Desktop/magnivents/booking-platform/app/styles/components/Nav.css): Remove purple gradient on `.lux-nav-register-ai-btn`.
- [ ] **Phase 3: Automated Validation & Linting**

  - Set up a stylelint rule or regex pre-commit hook to warn when hex values outside the official 6 brand codes are committed in `booking-platform/app/styles/`.
- [ ] **Phase 4: Guidance for Future Developers**

  - When introducing a new UI component, always use semantic tokens:
    - Primary Action: `var(--color-coral, #E45F60)`
    - Rating / Star / Keyword: `var(--color-marigold, #E8B943)`
    - Container Surface: `var(--color-charcoal, #29272A)`
    - Body Text: `var(--color-ivory, #F5F0E9)`
    - Border / Outline: `var(--border-subtle)` (derived from `#D8C4B7`)
    - VIP / Concierge Tag: `var(--color-wine, #7E3044)`
