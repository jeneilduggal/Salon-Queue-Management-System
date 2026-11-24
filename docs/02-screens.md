# Salon Queue — Screens & Features Specification

This document details every screen, target audience, layout hierarchy, element interactions, responsive behavior, and empty/error states.

---

## Screen 1: Customer Home (`/`)
- **Target User**: Walk-in or prospective customer arriving at salon URL.
- **Header**:
  - Salon branding (Logo + "Royal Cuts Salon & Spa").
  - Status badge: `'Open · Closes 9 PM'` (green pulse) or `'Closed for Queue'` (amber).
  - Language toggle: `[ English | ગુજરાતી ]`.
  - Quick nav bar / staff shortcut drawer (Home, Join, My Status, Reception, Barber, TV Display, Admin).
- **Hero / Live Card**:
  - Waiting summary: e.g. `'6 people waiting · about 50 min wait'`.
  - Barber status chips with real-time indicators:
    - Ravi (Busy - in chair)
    - Amit (Free - ready)
    - Imran (On break)
- **Primary Action**:
  - Prominent gold button: `[ Join Queue ]` (navigates to `/join`).
  - Secondary check button: `[ Track Existing Token ]` if the customer already joined on this device.
- **Empty / Off-peak State**:
  - If 0 waiting: `'No one waiting — walk right in!'` with an instant join prompt.
- **Closed Queue State**:
  - If queue closed by owner: Join button disabled with text: `'Online queue closed. Walk-ins still welcome.'`

---

## Screen 2: Join Queue (`/join`)
- **Target User**: Customer joining the queue on smartphone.
- **Form Fields (Top to Bottom)**:
  1. **Customer Details**:
     - Full Name input (required, trimmed).
     - Phone Number input (required, strictly 10 digits validation).
     - *Duplicate Phone Rule*: If phone already has an active ticket, alert customer and offer one-click redirect to their existing spot.
  2. **Service Selection (Multi-select, Maximum 3 services)**:
     - Card per service with title, icon, duration (min), and price (₹):
       - Haircut (30 min · ₹150)
       - Beard Trim & Shape (15 min · ₹80)
       - Hair Spa & Treatment (45 min · ₹400)
       - Shave & Face Massage (25 min · ₹180)
       - Head Massage (20 min · ₹120)
       - Hair Coloring (45 min · ₹350)
     - Counter badge: `e.g. 2/3 selected`. Selecting a 4th triggers a helpful warning.
  3. **Barber Selection**:
     - Option A: `'Any barber (fastest)'` (recommended default).
     - Option B: Specific barber cards (Ravi, Amit, Imran) with avatar/photo, current status, and break notice if on break.
  4. **Live Dynamic Summary Card**:
     - Real-time calculated: `'Total: 45 min · ₹230 · Expected wait ~35 min'`.
     - Updates immediately upon service or barber selection.
- **Actions**:
  - Gold button: `[ Confirm & Join Queue ]`.
  - Generates next sequential token (e.g. `S-1`, `S-2`, `S-14`) and redirects to `/status/:id`.

---

## Screen 3: My Status (`/status/:id`)
- **Target User**: Customer waiting from home, car, nearby cafe, or waiting couch.
- **Elements**:
  - Large token badge: e.g. `'S-14'`.
  - Customer name, selected services, total estimated duration & price.
  - Position indicator: e.g. `'4th in line'` or `'Next in line!'`.
  - Circular countdown timer showing remaining estimated wait time (e.g. `'about 35 min'`), dynamically recalculating as earlier customers are served.
- **State Progression & Banners**:
  - **Normal Waiting**: Circular timer, position badge, assigned/preferred barber info.
  - **Second in line banner**: High-priority amber banner: `'🔔 Start coming to the salon! You are 2nd in line.'`
  - **Called state**: High-energy full-screen gold takeover:
    - Bold text: `'🎉 It's your turn! Go to Barber Ravi'`
    - Gentle pulsing animation + device vibration (`navigator.vibrate([200, 100, 200])`).
    - Chair number / station guidance.
  - **In Chair state**: Blue/gold status: `'Currently being served in Ravi's chair'`.
  - **Completed state**: Green checkmark with summary and option to return home.
- **Actions**:
  - Button: `[ Cancel my spot ]` with a confirmation modal (`"Are you sure you want to give up your spot in line?"`).
  - If barber is on break: `'Notice: Ravi is currently on a short break. Estimated wait updated.'`

---

## Screen 4: Reception Dashboard (`/reception`)
- **Target User**: Receptionist / Front Desk on a 10-inch tablet (landscape responsive) or desktop.
- **Top Bar**:
  - Salon header, current clock, active waiting count, average wait time.
  - Quick action: `[ + Add Walk-in Customer ]` button.
  - Emergency toggle: `[ Queue Status: Open / Closed ]`.
- **Layout (Two-Column on Tablet/Desktop)**:
  - **Left Column: Barber Station Cards (3 columns row on tablet)**:
    - Card per barber (Ravi, Amit, Imran):
      - Barber photo/avatar, name, duty badge (On Duty / Off Duty).
      - Status pill: `In Service`, `Available`, or `On Break`.
      - If busy: Current customer token, name, services, time elapsed / progress bar.
      - Action button: `[ Call Next ]` (disabled if barber busy, on break, or no matching waiting customers).
      - Action button: `[ Start Service ]` and `[ Complete / Done ]`.
  - **Right Column: Waiting Queue List**:
    - Ordered strictly by arrival sequence (FIFO).
    - Table/Card row:
      - Token number (badge), Customer name, phone.
      - Services selected + estimated minutes.
      - Preferred barber (or `'Any'`).
      - Time waiting so far.
      - *Amber highlight warning* if customer has been waiting > 60 minutes.
      - Action buttons: `[ Call to Barber ▾ ]`, `[ No-Show ]`, `[ Cancel ]`.
- **Add Walk-in Modal**:
  - Name, Phone, Service multi-select, Barber choice.
  - One-click submit adds walk-in to the end of the queue instantly.

---

## Screen 5: Barber View (`/barber/:name`)
- **Target User**: Barber on their smartphone mounted at their mirror/station.
- **Header**:
  - Barber Name & photo (Ravi / Amit / Imran).
  - Quick switcher to jump between barbers.
  - Toggle switch: `[ On Break / Available ]`.
- **Main Working Card (Active Customer)**:
  - If customer in chair:
    - Customer Token & Name (e.g. `'S-14 Kunal'`).
    - Services list: `'Haircut + Beard trim'`.
    - Elapsed timer counting up since service started (`mm:ss`).
    - Big tap button: `[ Done / Finish Service ]` (min height 48px, high tap target).
  - If customer called but not yet started:
    - Big green button: `[ Start Service ]`.
  - If idle:
    - Card showing `'Ready for next customer'`.
    - Button: `[ Call Next Customer ]`.
- **Upcoming Card**:
  - `'Next for you: S-15 Kunal (Haircut · 30 min)'`.
- **Break State**:
  - When toggled to `'On Break'`, interface dims and alerts customer-facing screens.

---

## Screen 6: Waiting Area TV Display (`/display`)
- **Target User**: Customers sitting in the salon waiting area looking at a wall-mounted TV.
- **Design Philosophy**: High contrast, large bold typography readable from 5 meters away, ambient animations.
- **Top Section**:
  - Salon branding, live clock, current queue volume.
- **Active Barber Stations (Rows or 3-column cards)**:
  - Barber avatar + name.
  - Large display badge: `'NOW SERVING: S-12 (Rahul)'` or `'AVAILABLE'`.
  - Service in progress.
- **Next in Line List ("Up Next")**:
  - Prominent horizontal or vertical cards for the next 5 tokens:
    - Token (e.g. `S-14`, `S-15`, `S-16`, `S-17`, `S-18`).
    - Barber preference (or `'Any'`).
    - Estimated wait time badge.
- **Audio & Visual Alerts on Call**:
  - When a token is called, its card flashes in bright gold with an alert chime sound.

---

## Screen 7: Owner Settings & Analytics (`/admin`)
- **Target User**: Salon owner / manager.
- **Metrics Summary Cards**:
  - Customers Served Today.
  - Average Waiting Time (mins).
  - No-Shows Recorded.
  - Total Estimated Revenue Today (₹).
- **Service Catalog Management**:
  - List of services with English and Gujarati names, duration (mins), price (₹).
  - Toggle Active/Inactive switch: Turning off a service immediately hides it from `/join`.
  - Add new service or edit existing service form.
- **Barber Staff Management**:
  - Toggle on-duty status for today for each barber.
  - Mark breaks or assign stations.
- **Queue Controls**:
  - Master switch: Open / Closed for online joining.
  - Demo Data Generator / Reset button: One-click "Load 8 Sample Customers" for testing.
