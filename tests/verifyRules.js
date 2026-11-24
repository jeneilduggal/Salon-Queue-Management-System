import { 
  validatePhone, 
  findActiveTicketByPhone, 
  getServicesTotals, 
  calculateEstimatedWait, 
  getQueuePosition, 
  getNextCustomerForBarber 
} from '../src/utils/queueRules.js';

import { initialServices, initialBarbers } from '../src/data/initialData.js';

console.log("=== RUNNING L'ÉLITE STYLEQ VERIFICATION TESTS ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// TC-1: Multi-service totals
const testServices = ['bespoke_cut', 'royal_shave'];
const totals = getServicesTotals(testServices, initialServices);
assert(totals.duration === 75, `TC-1: Total duration for Bespoke Cut (45m) + Royal Shave (30m) is 75 min (got ${totals.duration})`);
assert(totals.price === 1070, `TC-1: Total price is ₹1070 (₹650 + ₹420) (got ₹${totals.price})`);

// TC-2: Duplicate phone detection
const existingTickets = [
  { id: 'Q-101', token: 'Q-101', phone: '9876543210', status: 'waiting' },
  { id: 'Q-102', token: 'Q-102', phone: '9825012345', status: 'done' }
];
const duplicate = findActiveTicketByPhone('9876543210', existingTickets);
const completedPhone = findActiveTicketByPhone('9825012345', existingTickets);
assert(duplicate !== null && duplicate.token === 'Q-101', 'TC-2: Duplicate active phone detected with Q-101');
assert(completedPhone === null, 'TC-2: Concluded ticket allows new booking (not duplicate)');

// TC-3: Stylist preference dispatching
const queueForDispatch = [
  { id: 'Q-110', token: 'Q-110', barberPreference: 'alexandre', status: 'waiting', createdAt: 1000 },
  { id: 'Q-111', token: 'Q-111', barberPreference: 'any', status: 'waiting', createdAt: 2000 },
  { id: 'Q-112', token: 'Q-112', barberPreference: 'marcus', status: 'waiting', createdAt: 3000 }
];

const nextForMarcus = getNextCustomerForBarber('marcus', queueForDispatch);
assert(nextForMarcus !== null && nextForMarcus.token === 'Q-111', `TC-3: Marcus call-next skips Q-110 (prefers Alexandre) and picks Q-111 (Any) (got ${nextForMarcus?.token})`);

const nextForAlexandre = getNextCustomerForBarber('alexandre', queueForDispatch);
assert(nextForAlexandre !== null && nextForAlexandre.token === 'Q-110', `TC-3: Alexandre call-next picks Q-110 (earliest FIFO) (got ${nextForAlexandre?.token})`);

// TC-4: Phone validation
assert(validatePhone('9876543210') === true, 'TC-4: Phone validation validates 10-digit mobile');
assert(validatePhone('12345') === false, 'TC-4: Phone validation rejects incomplete numbers');

// TC-5: Dynamic wait time calculation
const sampleWaitingTicket = {
  id: 'Q-120',
  token: 'Q-120',
  serviceIds: ['bespoke_cut'],
  barberPreference: 'any',
  status: 'waiting',
  createdAt: 5000
};
const waitTime = calculateEstimatedWait(sampleWaitingTicket, queueForDispatch, initialBarbers, initialServices);
assert(waitTime > 0, `TC-5: Dynamic wait time is positive (~${waitTime} min)`);

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED.`);
if (failed > 0) process.exit(1);
