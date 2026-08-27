# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Vite + Tailwind CSS v4 frontend; Node.js + Express backend; MongoDB (via Mongoose); Socket.io for real-time chat; JWT-based auth; Framer Motion for animations.

## Users

**Primary:** Bangladeshi farmers (small and medium-scale) who face crop disease, unfair middleman pricing, and lack of timely market/weather information. Speaking both Bengali (primary) and English.

**Secondary:** Buyers/consumers looking for direct farm produce; agricultural extension officers.

## Product Purpose

AgriSmart BD is a unified platform that helps Bangladeshi farmers detect crop diseases by photo, sell produce directly to buyers without middlemen, and make informed decisions with live weather and market-price data. Success means farmers earn more per harvest, lose less to disease, and have a direct channel to buyers.

## Positioning

Al-powered crop disease detection and zero-middleman direct selling, paired with live weather and market intelligence — all in one platform, in Bengali and English. Not a single-purpose tool (disease-only or marketplace-only), but an integrated farming companion.

## Key Capabilities

- AI crop disease detection via photo upload (scan crop page)
- Direct marketplace for selling/buying produce (no middlemen)
- Live weather and market price updates
- Real-time chat between farmers and buyers
- Multilingual support (English / বাংলা)
- Location-aware (Bangladesh divisions, districts, upazilas)
- Farmer support hotline: 16123 (24/7)
- Account system with JWT auth, password reset, email verification

## Product Name

AgriSmart BD (also referred to as HarvestGuard in some places — the login page says "Login to HarvestGuard", but the primary brand is AgriSmart BD).

## Design Language Dependencies

- Tailwind CSS v4 with custom CSS variables in `index.css`
- Framer Motion for animations
- Lucide React for icons
- Custom Button component with primary/secondary/outline variants
- Bangladesh-specific location data (divisions, districts, upazilas)

## Constraints

- Must remain bilingual (English + Bengali) — all user-facing text has both translations
- API proxy in Vite config points to localhost:8000; production API at `hackethon-server-side-br4m.vercel.app`
- Deployed on Vercel (frontend) and Render (backend)
- No real AI model for disease detection — uses a mock/placeholder endpoint
- Mobile-responsive design required (farmers use phones)