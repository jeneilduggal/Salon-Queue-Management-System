/**
 * Core Queue Business Rules and Algorithmic Calculations
 * Centralized in one place per AGENTS.md and docs/03-flows-rules.md
 */

/**
 * Validate 10-digit Indian mobile number
 */
export function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Check if phone number already has an active ticket (waiting, called, or in_chair)
 */
export function findActiveTicketByPhone(phone, tickets) {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s-]/g, '');
  return tickets.find(
    t => t.phone.replace(/[\s-]/g, '') === cleaned &&
    ['waiting', 'called', 'in_chair'].includes(t.status)
  ) || null;
}

/**
 * Calculate total service duration (in minutes) and total price (₹)
 */
export function getServicesTotals(serviceIds, servicesList) {
  let duration = 0;
  let price = 0;
  
  if (!serviceIds || !servicesList) return { duration, price };

  serviceIds.forEach(id => {
    const s = servicesList.find(item => item.id === id);
    if (s) {
      duration += s.duration || 0;
      price += s.price || 0;
    }
  });

  return { duration, price };
}

/**
 * Calculate dynamic waiting time for a ticket based on docs/03-flows-rules.md:
 * "Waiting time ≈ total minutes of services ahead ÷ barbers working."
 * If customer chose a specific barber, wait time is the sum of minutes ahead for that barber.
 */
export function calculateEstimatedWait(targetTicket, allTickets, barbers, servicesList) {
  if (!targetTicket) return 0;
  if (targetTicket.status === 'in_chair') return 0;
  if (targetTicket.status === 'called') return 2; // Arriving now

  // Active barbers currently on duty and not on break
  const activeBarbers = barbers.filter(b => b.onDuty && !b.onBreak);
  const activeCount = Math.max(1, activeBarbers.length);

  // Filter only active waiting queue
  const waitingTickets = allTickets
    .filter(t => t.status === 'waiting')
    .sort((a, b) => a.createdAt - b.createdAt);

  const targetIndex = waitingTickets.findIndex(t => t.id === targetTicket.id);
  if (targetIndex === -1 && targetTicket.status !== 'waiting') return 0;

  // If specific barber preference
  if (targetTicket.barberPreference && targetTicket.barberPreference !== 'any') {
    const prefBarberId = targetTicket.barberPreference;
    const prefBarber = barbers.find(b => b.id === prefBarberId);
    
    // Check if barber is currently serving someone
    let currentInChairRemaining = 0;
    if (prefBarber && prefBarber.status === 'busy' && prefBarber.currentTicketId) {
      const activeTicket = allTickets.find(t => t.id === prefBarber.currentTicketId && t.status === 'in_chair');
      if (activeTicket) {
        const { duration } = getServicesTotals(activeTicket.serviceIds, servicesList);
        const elapsedMins = activeTicket.startedAt ? Math.floor((Date.now() - activeTicket.startedAt) / 60000) : 0;
        currentInChairRemaining = Math.max(5, duration - elapsedMins);
      } else {
        currentInChairRemaining = 15;
      }
    }

    // Minutes of customers ahead who are either assigned to this barber or picked 'any' before target
    let minutesAhead = currentInChairRemaining;
    const ahead = targetIndex > -1 ? waitingTickets.slice(0, targetIndex) : [];
    
    ahead.forEach(t => {
      if (t.barberPreference === prefBarberId || t.barberPreference === 'any') {
        const { duration } = getServicesTotals(t.serviceIds, servicesList);
        minutesAhead += duration;
      }
    });

    // Add extra buffer if barber is on break
    if (prefBarber && prefBarber.onBreak) {
      minutesAhead += 15;
    }

    return Math.max(5, minutesAhead);
  }

  // If 'Any barber (fastest)':
  // Sum minutes of all tickets waiting ahead of target + approximate remaining time of busy chairs
  const aheadTickets = targetIndex > -1 ? waitingTickets.slice(0, targetIndex) : waitingTickets;
  let totalServiceMinutesAhead = 0;

  aheadTickets.forEach(t => {
    const { duration } = getServicesTotals(t.serviceIds, servicesList);
    totalServiceMinutesAhead += duration;
  });

  // Also include remaining minutes from current in-chair customers
  barbers.forEach(b => {
    if (b.status === 'busy' && b.currentTicketId) {
      const activeTicket = allTickets.find(t => t.id === b.currentTicketId && t.status === 'in_chair');
      if (activeTicket) {
        const { duration } = getServicesTotals(activeTicket.serviceIds, servicesList);
        const elapsed = activeTicket.startedAt ? Math.floor((Date.now() - activeTicket.startedAt) / 60000) : 0;
        totalServiceMinutesAhead += Math.max(5, duration - elapsed);
      }
    }
  });

  // Wait time = total minutes ahead ÷ active barbers
  const estimated = Math.round(totalServiceMinutesAhead / activeCount);
  return Math.max(5, estimated);
}

/**
 * Get position index (1-based) in waiting queue
 */
export function getQueuePosition(ticketId, allTickets) {
  const waiting = allTickets
    .filter(t => t.status === 'waiting')
    .sort((a, b) => a.createdAt - b.createdAt);
  
  const index = waiting.findIndex(t => t.id === ticketId);
  return index >= 0 ? index + 1 : 0;
}

/**
 * Call Next Dispatch Algorithm
 * "Call next for barber X picks the earliest customer who chose X or 'Any'.
 *  A customer who chose Ravi is never given to another barber."
 */
export function getNextCustomerForBarber(barberId, allTickets) {
  const waiting = allTickets
    .filter(t => t.status === 'waiting')
    .sort((a, b) => a.createdAt - b.createdAt);

  return waiting.find(t => t.barberPreference === barberId || t.barberPreference === 'any') || null;
}
