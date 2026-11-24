# Salon Queue — Project Brief & Scope

## Problem
On weekends, customers sit 1–2 hours in the salon without knowing their turn. Some leave in frustration; others argue about who arrived first. Barbers have no visibility into waiting customers or their chosen services, and the receptionist struggles to track walk-ins and phone queues fairly.

## Users
1. **Customers**: View real-time queue length, select services & preferred barber, join queue remotely or as walk-ins, track live position, and receive notifications when it is their turn.
2. **Receptionist / Front Desk**: Oversee active queue, add walk-in customers, call next customer to an available barber, mark no-shows, and cancel spots.
3. **Barbers**: Individual phone view showing current customer in chair, timer, services, next customer in line, and toggle for break/available status.
4. **Salon Owner**: Manage service catalog (durations, pricing), barber duty toggles, emergency queue open/close switch, and daily performance metrics.

## Must-Have Features
1. **Join Queue Remotely**: Pick service(s) (multi-select up to 3) and select barber (specific barber or 'Any barber (fastest)'). Phone number validation (10 digits).
2. **Live Status Tracking**: View token number, exact queue position, live circular countdown, "Start coming to the salon" alert at 2nd in line, and pulsing full-screen gold "It's your turn!" notification when called.
3. **Receptionist Dashboard**: Optimized for tablet landscape view. Live barber status cards, waiting queue ordered by arrival, quick "+ Add walk-in" modal, Call Next action, No-show and Cancel actions, amber highlight for wait > 60 min.
4. **Barber Screen**: Dedicated phone view per barber (`/barber/:name`). Shows active client, service duration timer since start, Start/Done buttons, "Next for you" preview, and Break/Available toggle.
5. **Waiting Area TV Display**: Large format high-contrast screen (`/display`). Shows per-barber status ("Now: S-12"), up-next list of 5 tokens with estimated wait times, newly called token flashing in gold with audible sound chime.
6. **Owner Settings**: Manage services (name in EN & GU, duration, price, toggle active), barbers on duty today, open/close online joining toggle, and daily summary statistics (served, avg wait, no-shows).
7. **English & Gujarati Language Support**: Full bilingual localization toggle across every label and screen.
8. **Real-Time Cross-Screen Sync**: Instant synchronization across customer phones, tablet reception, barber view, and TV screen.

## Don't Build (Strict Scope Boundary)
- No online payments or billing gateway.
- No future-date scheduling or advance appointments (queue is strictly same-day live queue).
- No external SMS or WhatsApp APIs (use on-screen live updates and web notifications/vibrations).
- No customer loyalty points or marketing CRM.
- No multi-branch switching.

## Look & Feel
- Premium salon aesthetic: Dark Charcoal (`#1F2937` / `#111827`) + Elegant Gold accent (`#D4A017` / `#F59E0B`).
- Clean, rounded cards (`rounded-2xl`), smooth badge animations, mobile-first responsiveness.
- Seamless dual-language labels (English & Gujarati) throughout.
