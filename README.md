# AgriSmart BD

A farming intelligence platform for Bangladeshi farmers: AI crop-disease detection, a zero-middleman marketplace, live weather and market-price data, and Bangla-first smart alerts.

Built as two independently deployable applications — an Express/MongoDB API and a React SPA — in one repository.

```
AgriSmart/
├── AgriSmart-Backend/     Express + MongoDB + Socket.IO API
└── AgriSmart-Frontend/    React 19 + Vite + Tailwind CSS 4 SPA
```

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Frontend Structure](#frontend-structure)
- [AI & Intelligence Layer](#ai--intelligence-layer)
- [Real-Time Chat](#real-time-chat)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Project Layout](#project-layout)

---

## Features

### Crop Disease Detection
Farmers photograph an affected leaf and receive a disease classification. Two independent paths are available:

- `POST /api/predict` — base64 image, classified by a PlantVillage-trained MobileNetV2 model hosted on Hugging Face Inference.
- `POST /api/pest-identify` — multipart image upload for pest and disease identification.

The frontend also bundles `@tensorflow/tfjs`, allowing client-side inference without a round trip.

### Zero-Middleman Marketplace
Farmers post crop listings with quantity, price per kg (BDT), location, harvest date, and a photo. Buyers browse, filter, and open a direct conversation with the farmer. Listings move through `available` → `reserved` → `sold`. No intermediary takes a cut.

### Live Market Prices
A deterministic price model covering common Bangladeshi crops (rice, paddy, wheat, maize, potato, onion, garlic, tomato, chili, brinjal, lentils, mustard, jute, ginger, turmeric, mango, and more) with Bangla names and base wholesale rates in BDT/kg.

Prices are generated from an FNV-1a seeded hash combining a slow hourly trend (roughly ±6%, shown as the change percentage) with a fast five-minute jitter. The feed is stable within each time bucket but visibly ticks on every poll — no external price API, no keys, no quotas.

### Weather & Risk Intelligence
Location resolved via OpenStreetMap Nominatim geocoding, forecasts pulled from Open-Meteo. Neither service requires an API key.

The risk engine (`src/utils/riskEngine.js`) computes:
- `calculateETCL` — estimated time to crop loss from moisture, temperature, and weather conditions
- `generateRiskSummaryFromRow` — a per-batch risk classification (Critical / High / Moderate / Low, with Bangla equivalents)
- `generateBanglaSmartAlert` — a farmer-readable Bangla alert string

### Bangla Smart Alerts
`POST /api/smart-alert` (and `/batch` for bulk) produce natural-language Bangla advisories via an LLM, grounded in crop type, storage conditions, weather, and computed risk level. Severity labels are localized: সংকটপূর্ণ, উচ্চ, মাঝারি, কম.

### Buyer ↔ Farmer Chat
Real-time messaging over Socket.IO with JWT handshake authentication, backed by persisted conversations and messages with read receipts. Conversations can be anchored to a specific listing. Falls back to REST polling where WebSockets are unavailable.

### Bilingual Interface
Full Bangla and English support throughout, driven by `LanguageContext` and a `preferredLanguage` field on each farmer account (defaults to `bn`).

### Authentication & Accounts
Email and password registration with bcrypt hashing, JWT access and refresh tokens, email OTP verification, and a full forgot-password → verify-OTP → reset-password flow via Nodemailer.

### Admin Panel
Farmer directory with detail views, suspend/unsuspend, and delete. Crop batch management: list all, filter by farmer, view, update, and delete.

### Farming Tips
A curated library of agronomic guidance, surfaced as a preview on the home page and in full on `/tips`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  AgriSmart-Frontend  (React 19 · Vite · Tailwind 4)     │
│  Pages → Services (api.js) → Context (Auth, Language)   │
└────────────┬──────────────────────────┬─────────────────┘
             │ REST + JWT               │ Socket.IO
             ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│  AgriSmart-Backend  (Express 4 · ESM · Node 24)         │
│  Routes → Middleware → Controllers → Mongoose Models    │
└────┬──────────────┬──────────────┬─────────────────┬────┘
     │              │              │                 │
     ▼              ▼              ▼                 ▼
  MongoDB     Hugging Face     Open-Meteo        Nodemailer
  (Atlas)     Inference API    + Nominatim       (OTP email)
```

Requests flow through two guards before reaching a controller: `requireDB` confirms the MongoDB connection is live (important on serverless cold starts), and `isAuthenticated` validates the JWT on protected routes.

---

## Tech Stack

### Backend

| Concern | Choice |
|---|---|
| Runtime | Node.js 24.x, ES modules |
| Framework | Express 4.22 |
| Database | MongoDB via Mongoose 8.24 |
| Real-time | Socket.IO 4.8 |
| Auth | jsonwebtoken 9, bcryptjs 3 |
| Validation | Yup 1.7 |
| Email | Nodemailer 7 |
| Uploads | Multer 2 |
| AI | `@huggingface/inference` 4.13 |
| Templating | Handlebars 4.7 |
| Dev | Nodemon 3.1 |

### Frontend

| Concern | Choice |
|---|---|
| Framework | React 19.2 |
| Build | Vite 5 + `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4.1 via `@tailwindcss/vite` |
| Routing | react-router-dom 7.9 |
| Real-time | socket.io-client 4.8 |
| Animation | Framer Motion 12.23 |
| 3D | three 0.181, `@react-three/fiber` 9.4, `@react-three/drei` 10.7 |
| Client ML | `@tensorflow/tfjs` 4.22 |
| Maps | Leaflet 1.9 + react-leaflet 5 |
| Charts | d3-scale 4 |
| Icons | lucide-react, react-icons |
| Notifications | react-hot-toast 2.6 |
| Linting | ESLint 9 with react-hooks and react-refresh plugins |

---

## Getting Started

### Prerequisites

- Node.js 24.x
- A MongoDB connection string (Atlas or local)
- A Hugging Face API token for the AI features
- An SMTP account for OTP email

### Backend

```bash
cd AgriSmart-Backend
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # nodemon, http://localhost:8000
```

| Script | Action |
|---|---|
| `npm run dev` | Start with nodemon and file watching |
| `npm start` | Start with plain node |
| `npm run build` | No-op (nothing to compile) |

### Frontend

```bash
cd AgriSmart-Frontend
npm install
npm run dev               # Vite dev server, http://localhost:5173
```

| Script | Action |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint across the project |

With no `VITE_API_BASE` set, the frontend automatically targets `http://localhost:8000` when served from localhost — so the two dev servers connect with no extra configuration.

---

## Environment Variables

### Backend (`AgriSmart-Backend/.env`)

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | HTTP port (defaults to 8000) |
| `NODE_ENV` | `development` or `production` |
| `SECRET_KEY` | JWT access-token signing secret |
| `REFRESH_SECRET_KEY` | JWT refresh-token signing secret |
| `HF_API_TOKEN` | Hugging Face Inference token — required for disease detection and smart alerts |
| `GEMINI_API_KEY` | Optional alternate LLM provider |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials for OTP email |
| `MAIL_USER` / `MAIL_PASS` | Legacy SMTP credential aliases |

`VERCEL` is injected automatically by the platform and used to detect serverless execution.

### Frontend (`AgriSmart-Frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_BASE` | Backend origin. Optional in development. |

The API base is resolved in priority order, which makes it easy to repoint a deployed build without rebuilding:

1. `localStorage.API_BASE` — runtime override, useful for debugging against a different backend
2. `VITE_API_BASE` — build-time environment variable
3. `http://localhost:8000` — when the host is `localhost` or `127.0.0.1`
4. `https://agrismart-backend-lac.vercel.app` — production fallback, so API calls never resolve against the SPA origin and return HTML

> **Note:** anything prefixed `VITE_` is inlined into the client bundle and is publicly readable. Never put a secret behind that prefix.

---

## API Reference

All routes are mounted in `AgriSmart-Backend/index.js`. Routes marked **auth** require an `Authorization: Bearer <token>` header. Routes under `/user`, `/listing`, `/chat`, and `/panel` additionally pass through the `requireDB` guard.

### Authentication & Profile — `/user`

| Method | Path | Auth | Purpose |
|---|---|:---:|---|
| POST | `/user/register` | | Create a farmer account (Yup-validated) |
| POST | `/user/login` | | Issue access and refresh tokens |
| POST | `/user/logout` | ✓ | Invalidate the session |
| POST | `/user/forgot-password` | | Send an OTP by email |
| POST | `/user/verify-otp` | | Verify the emailed OTP |
| POST | `/user/reset-password` | | Set a new password |
| GET | `/user/me` | ✓ | Current farmer profile |
| PATCH | `/user/update` | ✓ | Update profile (Yup-validated) |
| GET | `/user/list` | ✓ | Directory of users, for starting a chat |

### Marketplace — `/listing`

| Method | Path | Auth | Purpose |
|---|---|:---:|---|
| GET | `/listing` | | Browse and filter public listings |
| GET | `/listing/:id` | | Single listing detail |
| GET | `/listing/mine/list` | ✓ | The caller's own listings |
| POST | `/listing` | ✓ | Create a listing (Yup-validated) |
| PATCH | `/listing/:id` | ✓ | Update fields or status |
| DELETE | `/listing/:id` | ✓ | Remove a listing |

### Chat — `/chat`

| Method | Path | Auth | Purpose |
|---|---|:---:|---|
| GET | `/chat/conversations` | ✓ | List the caller's conversations |
| POST | `/chat/conversations` | ✓ | Open a conversation, optionally about a listing |
| GET | `/chat/conversations/:id/messages` | ✓ | Message history |
| POST | `/chat/conversations/:id/messages` | ✓ | Send a message (REST fallback for Socket.IO) |

### Admin Panel — `/panel`

| Method | Path | Auth | Purpose |
|---|---|:---:|---|
| POST | `/panel/register` | | Create an admin account |
| POST | `/panel/login` | | Admin login |
| GET | `/panel/farmers` | ✓ | All farmers |
| GET | `/panel/farmers/:id` | ✓ | Farmer detail |
| DELETE | `/panel/farmers/:id` | ✓ | Delete a farmer |
| PATCH | `/panel/farmers/:id/suspend` | ✓ | Suspend an account |
| PATCH | `/panel/farmers/:id/unsuspend` | ✓ | Restore an account |
| GET | `/panel/crops` | ✓ | All crop batches |
| GET | `/panel/crops/farmer/:farmerId` | ✓ | Batches for one farmer |
| GET | `/panel/crops/:id` | ✓ | Batch detail |
| PATCH | `/panel/crops/:id` | ✓ | Update a batch |
| DELETE | `/panel/crops/:id` | ✓ | Delete a batch |

### Reference Data — `/data`

| Method | Path | Purpose |
|---|---|---|
| GET | `/data/options` | Every dropdown option in one payload |
| GET | `/data/crop-types` | Supported crop types |
| GET | `/data/storage-types` | Storage condition types |
| GET | `/data/divisions` | Bangladesh administrative divisions |

### Market Prices — `/market-price`

| Method | Path | Purpose |
|---|---|---|
| GET | `/market-price` | Full price feed. Accepts `?crop=Rice` to narrow. |

### AI Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/predict` | Health check for the classifier |
| POST | `/api/predict` | Classify a leaf disease from `{ imageBase64 }` |
| POST | `/api/pest-identify` | Classify a pest or disease from a multipart `image` field |
| POST | `/api/smart-alert` | Generate one Bangla advisory |
| POST | `/api/smart-alert/batch` | Generate advisories for many crop batches |

---

## Data Models

Defined with Mongoose in `AgriSmart-Backend/models/`.

### Farmer — `userModel.js`

The primary user document. `role` distinguishes farmers from admins, so one collection serves both.

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `phone` | String | required |
| `password` | String | bcrypt hash |
| `avatar` | String | image URL |
| `preferredLanguage` | String | `bn` \| `en`, defaults to `bn` |
| `location` | Object | `{ division, district, upazila }`, all required |
| `badges` | [String] | earned achievements |
| `role` | String | `farmer` \| `admin`, defaults to `farmer` |
| `isVerified` | Boolean | email OTP completed |
| `isLoggedIn` | Boolean | active session flag |
| `isSuspended` | Boolean | admin-set access block |
| `token` | String | current refresh token |
| `otp` / `otpExpiry` | String / Date | password reset state |

### Listing — `listingModel.js`

| Field | Type | Notes |
|---|---|---|
| `farmerId` | ObjectId → Farmer | required |
| `cropType` | String | required, constrained to `CROP_TYPES` |
| `title` | String | trimmed |
| `quantityKg` | Number | required, min 0 |
| `pricePerKg` | Number | required, min 0, BDT |
| `location` | Object | `{ division, district }`, both required |
| `harvestDate` | Date | |
| `photo` | String | base64 data URL or image URL |
| `description` | String | |
| `status` | String | `available` \| `reserved` \| `sold` |

### Conversation & Message — `chatModel.js`

**Conversation:** `participants[]` → Farmer (required), `listingId` → Listing, `lastMessage`, `lastMessageAt`. Denormalizing the last message keeps the conversation list to a single query.

**Message:** `conversationId` → Conversation (required, indexed), `senderId` → Farmer (required), `text` (required, trimmed), `readBy[]` → Farmer.

### Admin — `adminModel.js`

`email` (required, unique), `password`. A separate collection for panel-only credentials.

### Session — `sessionModel.js`

`userId` → User. Server-side session tracking alongside the JWT.

---

## Frontend Structure

### Routes

Every page is lazy-loaded behind a `Suspense` boundary, so the initial bundle carries only the home page.

| Path | Page | Purpose |
|---|---|---|
| `/` | composed sections | Hero, features, stats, live updates, how-it-works, tips, CTA |
| `/login` | `Login` | Email and password sign-in |
| `/register` | `Register` | Account creation |
| `/forgot` | `ForgotPassword` | Request an OTP |
| `/verify` | `Verify` | Confirm the OTP |
| `/reset-password` | `ResetPassword` | Set a new password |
| `/dashboard` | `Dashboard` | Own listings, market trend chart, summary stats |
| `/profile` | `Profile` | Account and location settings |
| `/marketplace` | `Marketplace` | Browse listings, or manage your own via `?tab=mine` |
| `/scan-crop` | `ScanCrop` | Upload a leaf photo for disease detection |
| `/chat` | `Chat` | Real-time buyer ↔ farmer messaging |
| `/prices` | `Prices` | Live market price feed |
| `/tips` | `Tips` | Farming guidance library |
| `/about` | `About` | Project background |

### Directory Layout

```
src/
├── components/            Home-page sections + shared UI
│   ├── HeroBanner.jsx        Split hero: headline, CTAs, live weather panel
│   ├── FeaturesSection.jsx   Capability grid
│   ├── StatsSection.jsx      Platform numbers
│   ├── LiveUpdatesSection.jsx Live weather and price proof
│   ├── HowItWorks.jsx        Three-step flow
│   ├── TipsPreview.jsx       Tips teaser
│   ├── CallToAction.jsx      Closing ink CTA
│   ├── Navbar.jsx / Footer.jsx
│   ├── PestUpload.jsx        Drag-and-drop image capture
│   └── common/               Button, Card, FeatureCard, StatCard,
│                             StatItem, HowItWorksStep, FooterSection
├── context/
│   ├── AuthContext.jsx       Token, current user, login/logout
│   └── LanguageContext.jsx   Bangla ⇄ English toggle
├── hooks/
│   ├── useWeatherSnapshot.js Nominatim geocode + Open-Meteo forecast
│   ├── usePestIdentification.js Upload, classify, surface result
│   └── useNavbarHooks.js     Scroll and headroom behaviour
├── services/
│   ├── api.js                Fetch wrapper, API base resolution
│   ├── authService.js        Auth calls
│   └── smartAlertService.js  Smart alert calls
├── utils/
│   └── riskEngine.js         ETCL, risk summary, Bangla alert text
├── data/
│   ├── bd-locations.json     Divisions, districts, upazilas
│   ├── bangladesh.js         Geo helpers
│   └── farmingTips.js        Tips content
└── styles/
    ├── index.css             Tailwind entry and tokens
    └── App.css
```

### State Management

No external store. State is deliberately kept at three levels:

- **Context** for cross-cutting, low-frequency values — auth and language
- **Local `useState`** inside pages for view state
- **Server state** fetched per page through `services/api.js`

---

## AI & Intelligence Layer

### Disease Classification

| | |
|---|---|
| Model | `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` |
| Training set | PlantVillage |
| Host | Hugging Face Inference API |
| Input | base64 image (`POST /api/predict`) or multipart upload (`POST /api/pest-identify`) |
| Output | Disease label with confidence |

The earlier model `wambugu71/crop_leaf_diseases_vit` was deprecated and is no longer served by `hf-inference`; the MobileNetV2 model above is actively hosted and replaced it.

### Bangla Advisory Generation

| | |
|---|---|
| Model | `nvidia/Llama-3.1-Nemotron-Nano-8B-v1:featherless-ai` |
| Host | Hugging Face Inference |
| Input | Crop type, storage type, weather, computed risk level |
| Output | Natural Bangla advisory text |

The LLM is not asked to assess risk. Risk is computed deterministically first — `calculateETCL` and `generateRiskSummaryFromRow` in the risk engine — and the LLM only renders that verdict into readable Bangla. The severity classification is therefore reproducible and auditable; only its phrasing is generated.

### Deterministic Market Model

External commodity price APIs need keys, impose quotas, and go down. The price feed instead models a market in code:

```
price = base × hourFactor(crop, hour) × jitter(crop, 5-min bucket)
```

Both factors derive from an FNV-1a 32-bit hash of `(time bucket + crop)`, which makes the feed stable inside a bucket, identical across all clients polling at the same moment, and visibly moving between buckets. The hourly component drifts roughly ±6% and is what the UI reports as the change percentage.

### Client-Side Inference

`@tensorflow/tfjs` ships with the frontend, enabling in-browser classification without a network round trip — useful on the intermittent connectivity common in rural deployments.

---

## Real-Time Chat

Socket.IO is initialized in `AgriSmart-Backend/socket.js` and attached to the same HTTP server as Express.

**Authentication.** Every socket presents a JWT in its handshake. The token is verified before any event is accepted, so socket identity matches REST identity.

**Flow.** Client connects → emits `conversation:join` with the active conversation id → messages are broadcast to that room and persisted through `persistMessage` in `chatController.js`. Persistence and broadcast share one code path, so history and live messages cannot diverge.

**Serverless fallback.** Vercel's serverless functions are request-scoped and expose no long-lived `/socket.io` endpoint. The frontend detects a Vercel host, skips the socket connection entirely, and falls back to REST polling against `POST /chat/conversations/:id/messages`. A `socketStatus` value of `connecting` / `online` / `offline` is surfaced in the UI so the transport in use is never ambiguous. For true WebSocket support, deploy the backend to a persistent host — the included `render.yaml` covers this.

---

## Design System

The home page and auth screens follow an explicit design contract, documented in the header comment of `src/App.jsx`.

| Token | Value | Role |
|---|---|---|
| Ink | `#0b3b2a` | Deep forest, primary text and dark panels |
| Ground | `#f6f8f5` | Clean near-white background |
| Action | `#7cc24a` | Leaf lime, single accent — CTAs and focus rings |
| Brand green | `#0b6b3a` | Buttons and primary surfaces |

**Type.** Sora for display, Hind Siliguri for Bangla — an editorial pairing that renders both scripts with real character.

**Rules.** Hairline borders instead of shadows. 14px radii. Lucide line icons throughout. No emoji, no gradients used as decoration, no stock-photo hero, no floating badges or pills.

**Structure.** A split hero carries the headline and two CTAs on the left with a deep-ink "Today's Snapshot" panel on the right showing live weather. The page then moves through capabilities → numbers → live proof → how-it-works → tips → an ink CTA that closes the loop. Login and register reuse the split: ink brand panel left, cleanly bordered form right, neutral fields, lime focus ring.

**Navbar.** Fixed on the home and auth pages; absolute-at-top elsewhere.

---

## Deployment

### Frontend — Vercel

`AgriSmart-Frontend/vercel.json` rewrites all paths to `/index.html` so client-side routing survives a hard refresh on any deep link.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Set `VITE_API_BASE` in the Vercel project settings to point at your backend. Without it, the production fallback in `api.js` applies.

### Backend — Vercel (serverless)

`AgriSmart-Backend/vercel.json` builds `api/index.js` as the serverless entry point and applies permissive CORS headers. Note the two constraints this imposes:

- **No WebSockets.** Socket.IO cannot hold a connection; the frontend falls back to REST polling as described above.
- **Cold starts.** MongoDB may not be connected when a request arrives, which is exactly why `requireDB` guards every database-backed route.

### Backend — Render (persistent)

`AgriSmart-Backend/render.yaml` deploys to a long-running process, which restores full Socket.IO support and removes cold-start connection gaps. Prefer this if real-time chat matters for your deployment.

### Checklist

1. Provision MongoDB (Atlas free tier is sufficient) and copy the connection string
2. Deploy the backend, setting every variable from [Environment Variables](#environment-variables)
3. Deploy the frontend with `VITE_API_BASE` pointed at the backend URL
4. Confirm `GET /` on the backend returns its status page
5. Register a test account and confirm the OTP email arrives

---

## Project Layout

```
AgriSmart/
├── README.md                        ← this file
│
├── AgriSmart-Backend/
│   ├── index.js                     Express app, route mounts, /api/predict
│   ├── api/index.js                 Vercel serverless entry
│   ├── socket.js                    Socket.IO setup and JWT handshake
│   ├── database/db.js               Mongoose connection
│   ├── routes/
│   │   ├── userRoute.js             Auth and profile
│   │   ├── listingRoute.js          Marketplace
│   │   ├── chatRoute.js             Conversations and messages
│   │   ├── adminRoute.js            Admin panel
│   │   ├── dataRoute.js             Reference data
│   │   ├── marketPriceRoute.js      Deterministic price feed
│   │   ├── smartAlertRoute.js       Bangla LLM alerts
│   │   └── pestServer.js            Multipart pest identification
│   ├── controllers/                 One controller per route group,
│   │                                plus adminCrop / adminFarmer splits
│   ├── models/                      Farmer, Listing, Conversation,
│   │                                Message, Admin, Session
│   ├── middleware/
│   │   ├── isAuthenticated.js       JWT verification
│   │   └── requireDB.js             Connection guard
│   ├── validators/                  Yup schemas for user and listing
│   ├── data/                        CROP_TYPES, STORAGE_TYPES,
│   │                                DIVISIONS, BASE_PRICES
│   ├── vercel.json                  Serverless config
│   └── render.yaml                  Persistent-host config
│
└── AgriSmart-Frontend/
    ├── src/                         See Frontend Structure above
    ├── vite.config.js
    ├── vercel.json                  SPA rewrites
    └── eslint.config.js
```

---

## License

ISC

