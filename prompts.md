# Prompts Log — Salon Queue Management System

This document logs every prompt and directive executed throughout the vibe coding process, following the MSc IT Lab Handout guide.

---

### Step 1: Understand & Specification Authoring
**Prompt:**
> Read AGENTS.md and all of docs/. Summarise the app in 8 bullets and list questions. Then set up the project with empty pages for all 7 screens, the theme, and the EN/GU toggle.

**Action & Outcome:**
- Authored the core documentation:
  - `docs/01-brief.md`
  - `docs/02-screens.md`
  - `docs/03-flows-rules.md`
  - `AGENTS.md`
- Configured React + Vite + Tailwind CSS with charcoal `#1F2937` and gold `#D4A017` theme.
- Added bilingual dictionary in `src/i18n/translations.js` for seamless English and Gujarati localization.

---

### Step 2: Home + Join Queue
**Prompt:**
> Build Screen 1 (Home) and Screen 2 (Join Queue) from docs/02-screens.md with dummy services and barbers. Validate phone numbers and the 3-service limit.

**Action & Outcome:**
- Built `src/pages/Home.jsx` with live waiting counter, barber status indicators, and tracking input.
- Built `src/pages/JoinQueue.jsx` with 10-digit mobile number validation, 3-service selection enforcement, barber preference picker, live duration/price calculation, and duplicate phone check.

---

### Step 3: My Status
**Prompt:**
> After Confirm, give a token (S-1, S-2…) and open My Status. Show position and estimated wait using the rule in docs/03-flows-rules.md. Add the 'Start coming' and 'It's your turn' states.

**Action & Outcome:**
- Built `src/pages/MyStatus.jsx` featuring dynamic circular countdown ring, 2nd-in-line amber alert banner, full-screen gold celebration takeover with pulse animation and mobile phone vibration (`navigator.vibrate`), and cancellation modal.

---

### Step 4: Reception Dashboard
**Prompt:**
> Build the Reception Dashboard (Screen 4) for a 10-inch tablet in landscape. Customers who join from a phone must appear automatically. Call next must follow the barber-preference rules exactly.

**Action & Outcome:**
- Built `src/pages/ReceptionDashboard.jsx` featuring a two-panel layout: Left column with barber cards, service elapsed progress bars, and `[ Call Next ]` / `[ Start ]` / `[ Complete ]` controls. Right column with FIFO waiting list, amber warning highlights for customers waiting > 60 minutes, and quick "+ Add walk-in" modal.

---

### Step 5: Barber View + TV Display
**Prompt:**
> Build Barber View (Screen 5) and the Waiting Area TV (Screen 6). Start/Done and On break must update Reception, TV and the customer's phone within 5 seconds.

**Action & Outcome:**
- Built `src/pages/BarberView.jsx` with elapsed service timer (`mm:ss`), large 52px tap buttons, station switcher, and break toggle.
- Built `src/pages/WaitingDisplay.jsx` high-contrast TV view readable from 5 meters away, featuring active station cards, Up Next 5 tokens, and flashing gold call alert with synthesized Web Audio chime.

---

### Step 6: Owner Settings
**Prompt:**
> Build Screen 7. Turning off a service hides it from Join; closing the queue disables online joining with a clear message. Add today's stats cards.

**Action & Outcome:**
- Built `src/pages/AdminSettings.jsx` with service catalog management (duration, pricing, active/hidden toggles, add/edit), barber duty toggles, emergency online queue pause switch, today's performance metrics (served count, avg wait, no-shows, revenue), and demo data reset.

---

### Step 7: Rules, Edge Cases & Polish
**Prompt:**
> Implement the no-show, cancel and barber-on-break rules from docs/03-flows-rules.md. Add friendly empty states, e.g. 'No one waiting — walk right in!'. Check every screen in Gujarati.

**Action & Outcome:**
- Isolated all queue rules into `src/utils/queueRules.js`.
- Implemented `BroadcastChannel` reactive sync bus for instant multi-window coordination.
- Built test verification suite `tests/verifyRules.js` with 9 passing algorithmic checks.
