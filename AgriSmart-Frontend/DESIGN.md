---
name: AgriSmart BD
description: Smart farming & direct marketplace — deep forest ink, leaf-lime action, editorial ledger.
colors:
  forest-ink: "#0b3b2a"
  leaf-lime: "#7cc24a"
  mist-ground: "#f6f8f5"
  sage-hairline: "#e4eae3"
  stone-slate: "#9aa79e"
  stone-moss: "#6f7d73"
  stone-soil: "#47564c"
  near-black: "#14231b"
  on-primary: "#ffffff"
typography:
  display:
    fontFamily: "Sora, 'Hind Siliguri', system-ui, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Hind Siliguri', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "15px"
    lineHeight: "1.8"
  label:
    fontFamily: "'Hind Siliguri', system-ui, sans-serif"
    fontWeight: 700
    fontSize: "13px"
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "16px"
  hero: "18px"
spacing:
  container: "1280px"
  section-y: "96px"
  leder-row: "28px"
components:
  button-primary:
    backgroundColor: "{colors.forest-ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#0d4a34"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  button-accent:
    backgroundColor: "{colors.leaf-lime}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-accent-hover:
    backgroundColor: "#8ed25e"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  nav-login-chip:
    backgroundColor: "{colors.leaf-lime}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# Design System: AgriSmart BD

## Overview

**Creative North Star: "The Field Ledger"**

AgriSmart BD is built like a careful farmer's ledger kept in a clean field office: deep forest ink marks on near-white harvest paper, everything ruled with hairline lines, and exactly one leaf-lime accent where the hand reaches to act. The world refuses the category's saturated greens and rounded-card softness in favor of an editorial, evidence-first voice — numbers stand in tabular rows, live data reads like a snapshot you can trust, and the interface stays quiet so the farm's own facts carry the authority.

The layout is open and airy: generous section padding (96px), a centered 1280px stage, and editorial left-aligned columns capped near 60ch so lines never run away. Density concentrates only inside data panels — the live weather snapshot, price tables, the feature grid — where hairline rules and tabular numerals do the organizing. Motion is restrained: content eases up as it scrolls into view, and buttons answer hover with a one-pixel spring lift. Light and ink alternate the page's rhythm: clean white capability bands, one deep-ink live-data panel in the first viewport, and an ink closing band that asks the farmer to act.

**Key Characteristics:**
- Deep forest ink (`#0b3b2a`) on a near-white harvest ground (`#f6f8f5`); one leaf-lime action color (`#7cc24a`) used sparingly
- Hairline borders instead of shadows — flat, ruled, legible
- Editorial display type (Sora) over a warm humanist body (Hind Siliguri); Bengali and English share one system
- Uppercase letter-spaced kickers and eyebrows; Lucide line icons only, never emoji
- Numbers are always tabular; live data always labeled
- Rounding is softly geometric (8–18px), never pill-shaped except tiny meta chips

## Colors

A two-ink system on paper: dark forest ink carries structure and emphasis, near-white harvest ground carries the page, and one leaf-lime marks every actionable moment.

### Primary
- **Forest Ink** (`#0b3b2a`): the structural color. Headlines, the logo tile, primary buttons, the live-data snapshot panel, the closing CTA band, and the entire footer. Any surface that must feel settled and trustworthy is ink.
- **Leaf Lime** (`#7cc24a`): the single action color. Login CTA, accent buttons, focus rings, live/status markers, small icon tints, and the highlighted phrase inside the hero headline. Rarity is its power — it is never a fill for whole sections.

### Neutral
- **Mist Ground** (`#f6f8f5`): page background and the light fixed navbar. A faint cool green-white, never pure gray.
- **Sage Hairline** (`#e4eae3`): every 1px rule — input borders, feature-grid separators, card outlines, and the navbar's bottom border.
- **Stone Slate** (`#9aa79e`): placeholder text, subdued map/location pins.
- **Stone Moss** (`#6f7d73`): secondary labels under stat values, muted supporting copy, the "BD" superscript.
- **Stone Soil** (`#47564c`): body copy, secondary paragraphs, weather meta.
- **Near Black** (`#14231b`): base body text color for maximum legibility on the ground.
- **On-Primary** (`#ffffff`): text on ink surfaces; footer body text uses white at reduced opacity (`white/60`–`white/85`).

### Named Rules
**The One Accent Rule.** Leaf lime appears on a small minority of any screen — an action, a live marker, a focus ring. If a layout leans on lime as a fill, the accent has lost its job.

**The Ink Anchor Rule.** The heaviest moments are ink, not accent: the hero snapshot panel, the CTA band, and the footer all rest on forest ink with white text and a faint lime glow. Dark closes the loop; light opens it.

## Typography

**Display Font:** Sora (with Hind Siliguri for Bengali glyphs, then system-ui)
**Body Font:** Hind Siliguri (with system-ui / -apple-system / Segoe UI fallbacks)

**Character:** An editorial pairing — Sora's geometric, slightly technical letterforms give headlines a confident, modern-agri voice; Hind Siliguri's humanist warmth carries long-form copy and Bengali fluently. Headlines are tight (tracking −0.02em to −0.03em) and heavy (extrabold 800); body copy is unhurried at 15px/1.8 line height.

### Hierarchy
- **Display** (Sora 800, clamp 38–58px, leading 1.06, tracking −0.03em): the hero headline only. Set on ink, with a single lime-highlighted phrase.
- **Headline** (Sora 800, 30–38px, leading 1.12–1.15, tracking −0.02em): section headings, 560px-max editorial column.
- **Title** (Sora 700, 22–28px, tracking tight): card titles and the stat numerals row.
- **Body** (Hind Siliguri 400, 15–16px, leading 1.8): paragraphs, capped near 60ch.
- **Label** (Hind Siliguri 700, 13px, uppercase, tracking 0.08–0.1em): kickers, eyebrows, panel section labels, footer column heads.

### Named Rules
**The Kicker Rule.** Uppercase labels at 13px with 0.08em tracking open every major block — "Smart Farming · Direct Marketplace", "Core capabilities", "Today's Snapshot". They are text, not chips: no fill, no border, just ink on the ground with a small lime dot or icon where rhythm needs one.

**The Tabular Ledger Rule.** Every number a farmer might compare — temps, prices, stats — uses `font-variant-numeric: tabular-nums` so columns line up like a ledger.

## Layout

A centered 1280px stage on the home page (1200px for inner grids, 1400px for the navbar bar), padded 20–32px at the edges. Sections breathe at 96px vertical rhythm (`py-24`), with the hero opening wider at `py-14 md:py-24`. Editorial columns are capped (`max-w-[560px]`–`[820px]`) so headlines and copy stay readable on large screens.

Grids snap cleanly: the hero splits 7/12 (copy) and 5/12 (snapshot panel) at `lg`; capabilities run 1→2→3 columns; footer runs 5 columns at `lg`. The fixed navbar occupies 72px; redesigned pages pad their first section (`pt-[72px]`) to clear it. Key mobile behaviors: stacks to single column, the snapshot panel drops below the copy, and the nav collapses to a hamburger menu.

## Elevation & Depth

This system is **flat by default**: depth comes from ink-on-paper contrast and hairline rules, not shadows. Three deliberate exceptions: (1) ink surfaces carry a soft radial lime glow (`blur-3xl` at 8–15% opacity) as an internal atmosphere, never an outer shadow; (2) primary and accent buttons carry light ambient shadows that deepen slightly on hover; (3) the navbar uses a faint bottom rule plus, on non-design pages, a soft drop shadow when scrolled. The "shadow" in this world is the weight difference between ink and ground, not a lifted card.

## Shapes

Softly geometric corners across a narrow scale — 8px (tiny icon tiles, meta chips, the footer tagline), 12px (inputs, nav chips, dropdown), 14px (all buttons, canonical), 16px (the feature grid frame), 18px (the hero snapshot panel, the largest surface). Hairline borders (`1px` sage or `white/10`) define every card and grid; nothing floats, nothing is pill-shaped at button scale. The only fully rounded elements are avatars and small 8–9px chips.

## Components

### Buttons
- **Shape:** softly curved 14px, Sora bold, flex-centered, full `transition-all duration-300`.
- **Primary:** ink fill, white text. Hover deepens to `#0d4a34` and lifts 1px via a spring; carries a soft `rgba(11,59,42,0.18)` shadow that grows on hover.
- **Accent:** leaf-lime fill, ink text. Hover brightens to `#8ed25e`; used for the hero panel's full-width action and the closing CTA.
- **Secondary:** transparent, 1px `ink/25` hairline border, ink text; border and 5% fill appear on hover. Used beside primary ("Explore Marketplace").
- **Outline:** 1px ink border, ink text; fills ink on hover (white text). Used for dark-band secondary actions ("Scan Your Crop" on ink).
- **Motion:** `whileHover` y:−1 and `whileTap` scale 0.98 with a 320-stiffness spring; disabled at 50% opacity.

### Inputs / Fields
- **Style:** white fill, 1px sage-hairline border, 12px corners, 12px/16px padding, ink text, slate placeholder.
- **Focus:** border shifts to leaf lime with a 2px lime ring at 20% opacity (`ring-[#7cc24a]/20`) — the whole form's focus language is lime, never blue.
- **Icons:** lead icons sit inside the field with left padding (`pl-11`).
- **Form layout:** login/register use a split layout — ink brand panel (feature bullets, brand mark) on the left at `lg`, the clean bordered form on the right; the brand panel collapses to a compact row on mobile.

### Navigation
- **Style:** always-fixed on the redesigned pages — mist-ground at 90% with `backdrop-blur`, 1px `ink/8` bottom rule, 72px tall. (Other pages keep the original absolute-at-top, ink-on-transparent behavior.)
- **Logo:** an 8×8 ink tile with rounded 10px corners carrying a leaf-lime wheat glyph, beside "AgriSmart" in Sora 800 with a stone-moss "BD" superscript.
- **Links:** 14px semibold ink text, lime on hover; a globe toggle flips English/Bengali. The auth chip is the leaf-lime "Login" button; when signed in it becomes the ink "Dashboard" button plus an avatar menu.
- **Mobile:** hamburger collapses to a full mist-ground panel with hairline rules and a full-width lime Login row.

### Cards / Containers
- **Feature grid:** a 1px sage frame with the grid itself ruled by `gap-px` hairline separators (cards are the gaps' negative space — a joined, ledger-like sheet rather than lifted tiles).
- **Stat band:** a top hairline rule opening the stat row; numerals in display face, labels in stone moss — a ledger entry, not a badge.
- **Corner style:** 14–16px; background white or mist; hairline border; internal padding 24px and up. No shadows.

### The Ink Snapshot Panel (signature)
The hero's right-hand panel is the system's signature object: a deep ink surface (18px corners) with a soft lime radial glow, an uppercase lime kicker ("Today's Snapshot") with a "LIVE" marker, a huge tabular temperature with max/min/rain meta on a `white/10` rule, four feature bullets each led by a 28px lime-tinted icon tile, and a full-width leaf-lime accent button. It is the product proof — live data made physical — and the model for every ink band that follows (CTA, footer).

### Footer
A deep ink band (`#0b3b2a`) with white text: brand column (logo tile, mission line, circular social buttons), three link columns, then a bottom rule splitting copyright, contact meta, and a small "The farmer's light" tagline chip (`white/5` fill, hairline border, lime wheat). Links warm to lime on hover.

## Do's and Don'ts

### Do:
- **Do** set ink (`#0b3b2a`) text and headings on the mist ground; reserve white for on-ink.
- **Do** use hairline borders (`#e4eae3` or `white/10`) to separate cards and grids instead of drop shadows.
- **Do** keep numbers tabular and label live data ("LIVE", "Today's Snapshot") so the platform reads as evidence.
- **Do** open blocks with uppercase letter-spaced kickers.
- **Do** use Lucide line icons; a 20px lime-tinted icon tile is the house way to lead a bullet.
- **Do** keep the login/register split: ink brand panel beside a clean bordered form, lime focus rings.

### Don't:
- **Don't** use emoji anywhere — icons are Lucide line glyphs only.
- **Don't** float badges, pills, or info cards over content; surfaces belong to the page flow (a footer tagline chip is an exception only inside the footer).
- **Don't** decorate with gradients — the only fills are flat ink, lime, white, and faint blur-3xl radial atmosphere inside ink panels.
- **Don't** reach for saturated green fills or heavy rounded-card shadows; the category's generic agri look is this world's explicit anti-reference.
- **Don't** use a stock-photo hero with a dark overlay; proof is live data, not imagery.
- **Don't** let the lime accent fill whole sections — its rarity is the point.
- **Don't** invent new palette entries; the ink/lime/neutral system above is closed.
