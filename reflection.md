# Vibe Coding Reflection — Salon Queue Management System

**Student/Author:** MSc IT Lab Candidate  
**Project:** Salon Queue Management System (Royal Cuts)  
**Tool Used:** Google Antigravity 2.0  

---

## 1. The Challenge Encountered: Barber Preference & Call-Next Dispatching
During initial vibe coding of Screen 4 (Reception Dashboard) and Screen 5 (Barber View), the AI agent initially implemented a standard naive queue dispatch: when any barber clicked **[ Call Next ]**, it simply pulled the first customer at the top of the waiting list (`queue[0]`), ignoring which barber the customer had selected on Screen 2.

### How I Noticed It
While testing with the sample dataset, customer **S-10** had explicitly selected **Barber Ravi** for their styling, while customer **S-11** selected **'Any barber'**. When I opened Amit's mirror station on `/barber/amit` and tapped **[ Call Next ]**, Amit's station immediately claimed customer S-10! 

This violated Rule #3 of `docs/03-flows-rules.md`:
> *"A customer who chose Ravi is never given to another barber. Call next for barber X picks the earliest customer who chose X or 'Any'."*

Customer S-10 would have arrived at the salon expecting Ravi, only to be redirected to Amit, leading to customer disputes and salon dissatisfaction.

---

## 2. Root Cause Analysis
The prompt for the Reception Dashboard was too generic: *"Customers who join must appear and call next must work."* The AI agent assumed a single shared queue where any free barber pulls the top ticket.

Because queue rules were initially scattered between screen components, the agent wrote conflicting dispatch logic in different views.

---

## 3. How I Fixed It (Prompt & Architecture Refactoring)
To fix this permanently, I took the following two steps:

1. **Centralized Business Rules**: I mandated that all queue dispatch rules live in a dedicated utility file (`src/utils/queueRules.js`) rather than inside component event handlers. I wrote the exact algorithmic criteria in `docs/03-flows-rules.md`:
   ```javascript
   export function getNextCustomerForBarber(barberId, waitingTickets) {
     return waitingTickets.find(
       t => t.barberPreference === barberId || t.barberPreference === 'any'
     ) || null;
   }
   ```
2. **Targeted Verification Prompt**:
   > *"Refactor 'Call Next' logic into `src/utils/queueRules.js`. Calling next for Amit must strictly skip any customer who requested Ravi and take the earliest customer who picked either Amit or 'Any'. Add an automated test in `tests/verifyRules.js` asserting this exact scenario."*

3. **Validation**:
   Running `node tests/verifyRules.js` confirmed:
   ```
   [PASS] TC-3: Amit call-next skips S-10 (prefers Ravi) and picks S-11 (Any) (got S-11)
   [PASS] TC-3: Ravi call-next picks S-10 (earliest FIFO) (got S-10)
   ```

---

## 4. Key Takeaways from the Vibe Coding Process
- **Docs First Saves Hours**: Having `docs/02-screens.md` and `docs/03-flows-rules.md` explicitly documented meant every edge case (duplicate phone validation, no-show reinstatement at end of line, 60-min amber warning) had clear criteria.
- **Automated Rule Tests Provide High Confidence**: Writing lightweight algorithmic test assertions ensures that UI changes never break core business rules.
- **Client-Side Real-Time Primitives**: Utilizing the `BroadcastChannel` API allows full real-time synchronization between phones, tablets, and TV screens without the complexity or cost of hosting external WebSocket servers.
