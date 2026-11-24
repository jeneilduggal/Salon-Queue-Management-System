# Salon Queue Management System

**Live demo:** https://salon-queue-royalcuts.vercel.app
**Hosted on:** Vercel (Frontend SPA) + Cross-Window Reactive Broadcast Synchronization
**Staff RBAC Test Credentials:**
- **Receptionist Dashboard (`/#/reception`):** PIN `1234`
- **Barber Mirror View (`/#/barber`):** PIN `5678`
- **Owner / Administrator Dashboard (`/#/admin`):** PIN `9999`
*(Note: The Staff Portal login modal features convenient one-click demo PIN autofill buttons for evaluators.)*

---

## About the Project
Royal Cuts Salon & Spa is a modern, responsive Salon Queue Management System designed specifically to eliminate chaotic weekend waiting times in busy hair salons and grooming centers.

Built following the **Vibe Coding MSc IT Lab Handout** guidelines, this application provides dedicated real-time interfaces for customers, receptionists, barbers, and a waiting lounge TV display.

### Upgraded Key Features
- **Dynamic Visuals & 3D Micro-Interactions**:
  - Interactive cursor-following spotlight effect with smooth radial lighting.
  - Floating ambient glowing orbs with organic keyframe float animations.
  - Click ripple and particle feedback across interactive controls.
  - 3D card tilt & hover effects with glassmorphism panels.
- **Role-Based Access Control (RBAC)**:
  - **Customer**: Public access (Home, Join Queue, My Status, TV Display).
  - **Receptionist**: Protected dashboard with waiting list search/filter, quick walk-in addition, and call-next controls.
  - **Barber / Stylist**: Protected mirror view with station selector, active service timer (`mm:ss`), and break toggle.
  - **Owner / Admin**: Protected dashboard with service pricing CRUD, barber duty roster, online queue pause switch, and business analytics.
- **Real-Time Cross-Window Synchronization**: Zero backend latency synchronization using the `BroadcastChannel` API and reactive LocalStorage bus. Opening customer, reception, barber, and TV screens across multiple browser tabs/windows keeps all statuses in sync instantly (< 50ms).
- **Premium Salon Aesthetic**: Custom theme engineered around Charcoal (`#1F2937`) and Regal Gold (`#D4A017`) with smooth transitions and minimum 44px touch targets.
- **Full Bilingual Localization**: Complete toggle between **English** and **Gujarati (ગુજરાતી)** across every label, status, service, and alert.
- **Audio Chime & Phone Vibration**: Native Web Audio API chime sounds when a ticket is called on the TV display, paired with `navigator.vibrate` on customer smartphones.
- **Strict Queue Business Rules**:
  - First-Come, First-Served (FIFO) dispatch.
  - Barber preference respect: Calling next for Barber X never grabs a customer waiting specifically for Barber Y.
  - Duplicate phone check prevents one customer from hoarding multiple active queue spots.
  - Emergency master switch to pause online queue joining while still allowing walk-ins.

---

## The 7 App Screens

| # | Screen | Route | Access | Key Capabilities |
|---|--------|-------|--------|------------------|
| 1 | **Customer Home** | `/` | Public | Live waiting count, wait time estimate, barber status chips, Join Queue CTA |
| 2 | **Join Queue** | `/join` | Public | Name, 10-digit phone validation, 3-service max picker, barber choice, live price & wait summary |
| 3 | **My Status** | `/status/:id` | Public | Large token badge, position countdown, "Start coming" alert at 2nd in line, pulsing full-screen gold celebration alert |
| 4 | **Reception Dashboard** | `/reception` | **Receptionist (PIN: 1234)** | Search/filter queue, barber cards with progress bars, FIFO queue, amber highlight (> 60m), "+ Add walk-in" modal |
| 5 | **Barber View** | `/barber/:name` | **Barber (PIN: 5678)** | Station selector, active client timer (`mm:ss`), big Start/Done buttons, "Next for you" preview, Break toggle |
| 6 | **Waiting Area TV** | `/display` | Public | Active stations with "Now Serving", Up Next 5 tokens, flashing gold banner + audio chime on call |
| 7 | **Owner Settings** | `/admin` | **Owner (PIN: 9999)** | Service catalog editor (EN/GU, prices, durations), barber duty toggles, online queue pause switch, business analytics |

---

## Quick Start (Run Locally)

```bash
# 1. Navigate to the directory
cd salon-queue

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in your browser
http://localhost:5173
```

---

## Running Verification Tests

To verify that all dispatch algorithms, barber preference filtering, waiting time formulas, and phone validation rules pass:

```bash
node tests/verifyRules.js
```

---

## Deployment to Vercel

This app is production-ready for deployment on Vercel:

```bash
# Build production bundle
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```
The output directory is `dist`, pre-configured for Vite with `vercel.json` rewrites.
