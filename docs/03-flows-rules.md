# Salon Queue — Flows & Rules Specification

This document defines the business logic, status lifecycles, barber dispatch algorithms, wait time formulas, edge cases, and the test checklist.

---

## 1. Core User Flows

### Flow A: Remote Customer (Phone)
1. Customer opens Home (`/`) -> taps **[ Join Queue ]** (`/join`).
2. Enters Name, 10-digit Phone -> picks 1 to 3 services -> selects barber ('Any' or specific, e.g. Amit).
3. System assigns unique sequential token (e.g. `S-14`) and redirects to `/status/:id`.
4. Customer tracks My Status from home.
5. When customer reaches 2nd in line, system displays alert banner: *"Start coming to the salon!"*.
6. Receptionist or Barber taps **[ Call Next ]** -> S-14 status changes to `Called`.
7. Customer phone triggers full-screen gold celebration: *"It's your turn! Go to Amit"* + vibration.
8. Waiting TV display flashes token S-14 in gold with a chime.
9. Amit taps **[ Start ]** when customer sits in chair -> status `In chair`.
10. Amit taps **[ Done ]** -> status `Done` -> customer removed from active queue.

### Flow B: Walk-in Customer (In Salon)
1. Customer walks into the salon.
2. Receptionist taps **[ + Add walk-in ]** on `/reception`.
3. Receptionist enters Name, Phone, selects Services and preferred Barber.
4. Ticket joins the queue at the end following First-Come, First-Served (FCFS) order.
5. Customer can see their token appear immediately on the Waiting Area TV display (`/display`).

---

## 2. Queue Status Lifecycle

```
[ Waiting ] ──────> [ Called ] ──────> [ In chair ] ──────> [ Done ]
    │                     │
    ├──> [ Cancelled ]    └──> [ No-show ]
```

### Strict Transition Rules:
- Statuses advance strictly forward: `Waiting` -> `Called` -> `In chair` -> `Done`.
- A ticket never moves backward (e.g. `In chair` cannot revert to `Waiting`).
- `Waiting` can transition to `Cancelled` (by customer or receptionist).
- `Called` can transition to `No-show` (by receptionist if customer fails to show within 10 minutes).
- Once `Done`, `Cancelled`, or `No-show`, the ticket is closed and archived from active waiting lists.

---

## 3. Barber Dispatch Rules ("Call Next")

When **Barber X** is available and "Call Next" is triggered:
1. Search active queue in FIFO order (earliest joined timestamp first).
2. Look for the first customer whose preferred barber is either:
   - Exactly **Barber X**, OR
   - **'Any'** (fastest available).
3. **Barber Loyalty Rule**: A customer who explicitly picked **Barber Y** is NEVER assigned to Barber X. They remain waiting until Barber Y calls them.
4. If multiple barbers are free, 'Any' customers are matched to whoever clicks Call Next first.
5. A barber can only have **ONE** customer in the chair (`In chair`) at any given time.

---

## 4. Waiting Time Calculation Formula

The estimated wait time for an individual customer is calculated dynamically:
$$\text{Estimated Wait} \approx \frac{\text{Total minutes of services ahead of customer}}{\text{Count of active barbers on duty}}$$

- If a customer chose a specific barber (e.g. Ravi), the estimated wait is calculated from the sum of remaining service minutes for customers assigned to Ravi ahead of them.
- If a customer chose 'Any', the wait is distributed evenly across all active, non-break barbers.
- Minimum estimated wait shown for next in line is dynamic or ~5-10 minutes.

---

## 5. Edge Cases & Policies

1. **Duplicate Phone Number**:
   - A phone number can only have **ONE** active spot in the queue at a time.
   - If the same phone tries to join again, the app informs the customer: *"You already have an active ticket (S-XX)"* and offers a link to their status screen.
2. **No-Show Policy**:
   - If a customer is called and does not show up within 10 minutes, the receptionist marks them `No-show`.
   - If that customer later arrives and asks to be reinstated, they cannot jump the queue; they are added again as a fresh ticket at the **END** of the queue with a new token.
3. **Barber On Break**:
   - When a barber toggles `'On Break'`, they cannot be assigned new customers.
   - Customers waiting specifically for that barber see a status note: *"[Barber Name] is on a short break"*.
4. **Online Queue Cut-Off**:
   - Online joining via phone automatically disables 30 minutes before closing (or when toggled off by owner).
   - Walk-ins can still be added by the receptionist at their discretion.

---

## 6. Test Checklist (Verification Protocol)

- [ ] **TC-1**: Join with 2 services -> Correct sum of service time and price displayed in summary.
- [ ] **TC-2**: Same phone number joins twice -> System detects existing ticket and shows it without creating duplicates.
- [ ] **TC-3**: Barber preference filtering -> Calling next for Amit strictly skips a customer waiting specifically for Ravi.
- [ ] **TC-4**: Real-time Call Next alert -> Customer's phone updates to *"It's your turn!"* within 5 seconds.
- [ ] **TC-5**: Lifecycle synchronization -> Clicking Start/Done on Barber View updates Reception and TV instantly.
- [ ] **TC-6**: No-show re-addition -> Marking customer as No-show, then adding them again assigns a new token at the end of the queue.
- [ ] **TC-7**: Queue close restriction -> When owner toggles queue closed, the Join button on `/join` is disabled with an explanatory notice.
- [ ] **TC-8**: Language localization -> Toggling between English and Gujarati updates all labels, statuses, and service names without untranslated text.
- [ ] **TC-9**: Dynamic countdown -> Waiting time estimates decrement as earlier customers complete service.
- [ ] **TC-10**: Multi-window synchronization -> Customer phone view, Reception tablet view, and TV view stay in sync across separate windows.
