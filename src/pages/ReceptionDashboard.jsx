import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Users, 
  Clock, 
  PhoneCall, 
  AlertTriangle, 
  Check, 
  X, 
  Scissors, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Play,
  CheckCircle2,
  Coffee,
  Search,
  Filter,
  DollarSign,
  UserCheck
} from 'lucide-react';

export function ReceptionDashboard({ onNavigate }) {
  const { 
    t, 
    language,
    tickets, 
    barbers, 
    services, 
    stats,
    queueOpen, 
    toggleQueueOpen, 
    callNextForBarber, 
    startService, 
    completeService, 
    markNoShow, 
    cancelTicket, 
    reassignTicket,
    joinQueue,
    getServicesTotals 
  } = useQueue();

  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Walk-in modal state
  const [showAddWalkIn, setShowAddWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInServices, setWalkInServices] = useState(['bespoke_cut']);
  const [walkInBarber, setWalkInBarber] = useState('any');
  const [modalError, setModalError] = useState('');

  // Active waiting queue (FIFO)
  const waitingQueue = useMemo(() => {
    return tickets
      .filter(t => t.status === 'waiting')
      .sort((a, b) => a.createdAt - b.createdAt)
      .filter(t => {
        const matchesQuery = 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.phone.includes(searchQuery);
        
        const matchesService = serviceFilter === 'all' || t.serviceIds.includes(serviceFilter);
        return matchesQuery && matchesService;
      });
  }, [tickets, searchQuery, serviceFilter]);

  const activeServices = services.filter(s => s.active);

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    setModalError('');

    if (!walkInName.trim()) {
      setModalError(t.nameValidationErr);
      return;
    }
    const cleanPhone = walkInPhone.replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setModalError(t.phoneValidationErr);
      return;
    }
    if (walkInServices.length === 0 || walkInServices.length > 3) {
      setModalError(t.servicesValidationErr);
      return;
    }

    const res = joinQueue({
      name: walkInName.trim(),
      phone: cleanPhone,
      serviceIds: walkInServices,
      barberPreference: walkInBarber
    });

    if (res.success) {
      setWalkInName('');
      setWalkInPhone('');
      setWalkInServices(['bespoke_cut']);
      setWalkInBarber('any');
      setShowAddWalkIn(false);
    } else if (res.error === 'duplicate_phone') {
      setModalError(`${t.duplicatePhoneErr} (Token: ${res.existingTicket.token})`);
    } else {
      setModalError(res.error);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Concierge Header */}
      <div className="heritage-panel rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-copper-500 animate-pulse"></span>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-900 tracking-tight font-editorial">
              {t.receptionTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-forest-800 text-ivory-100 text-[10px] font-black uppercase tracking-widest">
              L'ÉLITE Concierge
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Active Host: <strong className="text-forest-900">{user?.name || 'Concierge'}</strong> • Real-time seating ledger & client orchestration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAddWalkIn(true)}
            className="flex-1 md:flex-none btn-copper px-5 py-2.5 rounded-2xl font-bold text-xs shadow-copper-glow flex items-center justify-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addWalkInBtn}</span>
          </button>

          <button
            onClick={toggleQueueOpen}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-colors ${
              queueOpen 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            {queueOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span>{queueOpen ? t.queueToggleOpen : t.queueToggleClosed}</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-forest-800/10 shadow-sm">
          <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">Clients in Queue</p>
          <p className="text-2xl font-black text-forest-900 font-editorial mt-0.5">{tickets.filter(t => t.status === 'waiting').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-forest-800/10 shadow-sm">
          <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">Attended Today</p>
          <p className="text-2xl font-black text-emerald-700 font-editorial mt-0.5">{stats.servedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-forest-800/10 shadow-sm">
          <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">Average Wait</p>
          <p className="text-2xl font-black text-copper-600 font-editorial mt-0.5">{stats.avgWait}m</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-forest-800/10 shadow-sm">
          <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">No-Show Expirations</p>
          <p className="text-2xl font-black text-amber-700 font-editorial mt-0.5">{stats.noShowCount}</p>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Stylist Suites (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-1.5">
              <Scissors className="w-4 h-4" />
              <span>{t.barbersOverview}</span>
            </h2>
            <span className="text-xs text-charcoal-500 font-semibold">
              {barbers.filter(b => b.onDuty).length} Suites Active
            </span>
          </div>

          <div className="space-y-4">
            {barbers.map((barber) => {
              const currentTicket = tickets.find(t => t.id === barber.currentTicketId && ['called', 'in_chair'].includes(t.status));
              const isBusy = barber.status === 'busy' && currentTicket;
              const isOnBreak = barber.onBreak;
              const { duration: serviceDuration } = currentTicket ? getServicesTotals(currentTicket.serviceIds) : { duration: 0 };
              
              const elapsedMins = currentTicket?.startedAt 
                ? Math.floor((Date.now() - currentTicket.startedAt) / 60000) 
                : 0;
              const progressPct = serviceDuration > 0 ? Math.min(100, Math.round((elapsedMins / serviceDuration) * 100)) : 0;

              return (
                <div 
                  key={barber.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isOnBreak
                      ? 'bg-ivory-100 border-forest-800/10 opacity-75'
                      : isBusy
                      ? 'bg-white border-forest-900 shadow-md'
                      : 'bg-white border-forest-800/10'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-1 bg-ivory-100 rounded-xl">{barber.avatar}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-forest-900 font-editorial">{barber.name}</h3>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-ivory-100 text-charcoal-600 font-bold">
                            Suite #{barber.chair}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-500">
                          {barber.onDuty ? barber.specialty : 'Off duty'}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isOnBreak
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : isBusy
                        ? 'bg-forest-50 text-forest-800 border-forest-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {isOnBreak ? t.onBreak : isBusy ? (currentTicket.status === 'in_chair' ? t.inChair : t.statusCalled) : t.available}
                    </span>
                  </div>

                  {currentTicket ? (
                    <div className="mt-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-copper-600 bg-copper-50 px-2 py-0.5 rounded-lg border border-copper-200 font-editorial">
                            {currentTicket.token}
                          </span>
                          <span className="text-sm font-bold text-forest-900 ml-2 font-editorial">
                            {currentTicket.name}
                          </span>
                        </div>
                        <span className="text-xs text-charcoal-500 font-medium">
                          {currentTicket.status === 'in_chair' ? `${elapsedMins}/${serviceDuration}m` : 'Seating pending'}
                        </span>
                      </div>

                      {currentTicket.status === 'in_chair' && (
                        <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-copper-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {currentTicket.status === 'called' ? (
                          <button
                            onClick={() => startService(currentTicket.id, barber.id)}
                            className="w-full py-2 px-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{t.startBtn}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => completeService(currentTicket.id, barber.id)}
                            className="w-full py-2 px-3 rounded-xl btn-copper font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.doneBtn}</span>
                          </button>
                        )}

                        <button
                          onClick={() => markNoShow(currentTicket.id)}
                          className="w-full py-2 px-3 rounded-xl bg-ivory-100 hover:bg-red-50 text-red-600 border border-ivory-300 hover:border-red-200 font-semibold text-xs transition-colors"
                        >
                          {t.noShowBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-charcoal-400">
                        {isOnBreak ? t.onBreak : t.noActiveCustomer}
                      </p>

                      <button
                        onClick={() => callNextForBarber(barber.id)}
                        disabled={isOnBreak || !barber.onDuty}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                          isOnBreak || !barber.onDuty
                            ? 'bg-ivory-100 text-charcoal-400 cursor-not-allowed border border-ivory-200'
                            : 'btn-copper shadow-sm cursor-pointer'
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{t.callNextBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Waiting Ledger (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>{t.waitingQueueHeader}</span>
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter client / token..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-forest-800/15 text-charcoal-900 text-xs focus:outline-none focus:border-copper-500"
                />
              </div>

              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-forest-800/15 text-charcoal-900 text-xs focus:outline-none focus:border-copper-500"
              >
                <option value="all">All Treatments</option>
                {activeServices.map(s => (
                  <option key={s.id} value={s.id}>{s.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          {waitingQueue.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-forest-800/10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-forest-700 mx-auto" />
              <p className="text-sm font-bold text-forest-900 font-editorial">{t.noOneWaiting}</p>
              <p className="text-xs text-charcoal-400">All registered clients have been attended to.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingQueue.map((ticket) => {
                const elapsedWaitMins = Math.floor((Date.now() - ticket.createdAt) / 60000);
                const isOver45Min = elapsedWaitMins >= 45;
                const { duration, price } = getServicesTotals(ticket.serviceIds);
                const prefBarber = barbers.find(b => b.id === ticket.barberPreference);

                return (
                  <div
                    key={ticket.id}
                    className={`heritage-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isOver45Min ? 'border-amber-300 bg-amber-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-forest-800 text-ivory-100 flex items-center justify-center font-black text-sm font-editorial">
                        {ticket.token}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-forest-900 font-editorial">{ticket.name}</p>
                          <span className="text-[11px] text-charcoal-400 font-mono">
                            {ticket.phone}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-charcoal-600 mt-1">
                          <span className="text-charcoal-500">
                            {ticket.serviceIds.map(id => services.find(s => s.id === id)?.nameEn).join(' + ')}
                          </span>
                          <span>•</span>
                          <span className="text-copper-600 font-bold">
                            {duration}m · ₹{price}
                          </span>
                          <span>•</span>
                          <span className="text-charcoal-500">
                            Stylist: <strong className="text-forest-900">{ticket.barberPreference === 'any' ? t.anyBarber : prefBarber?.name}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-ivory-200">
                      <div className="text-right mr-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isOver45Min 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'text-charcoal-500'
                        }`}>
                          {elapsedWaitMins}m wait
                        </span>
                      </div>

                      <button
                        onClick={() => markNoShow(ticket.id)}
                        title="Mark No-Show"
                        className="px-2.5 py-1.5 rounded-xl bg-ivory-100 hover:bg-red-50 text-red-600 text-xs font-semibold border border-ivory-200 hover:border-red-200 transition-colors"
                      >
                        {t.noShowBtn}
                      </button>

                      <button
                        onClick={() => cancelTicket(ticket.id)}
                        title="Cancel Spot"
                        className="px-2.5 py-1.5 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal-600 text-xs font-semibold border border-ivory-200 transition-colors"
                      >
                        {t.cancelBtn}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Quick Walk-in Modal */}
      {showAddWalkIn && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-forest-800/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="text-base font-bold text-forest-900 font-editorial flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-copper-600" />
                <span>{t.walkInModalTitle}</span>
              </h3>
              <button
                onClick={() => setShowAddWalkIn(false)}
                className="p-1 rounded-lg text-charcoal-400 hover:text-forest-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Lord Sterling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-sm focus:outline-none focus:border-copper-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.phoneNumber} (10 digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-sm focus:outline-none focus:border-copper-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.selectServices} (Max 3)</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {activeServices.map(s => {
                    const isSelected = walkInServices.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (isSelected) {
                            if (walkInServices.length > 1) {
                              setWalkInServices(walkInServices.filter(id => id !== s.id));
                            }
                          } else {
                            if (walkInServices.length < 3) {
                              setWalkInServices([...walkInServices, s.id]);
                            }
                          }
                        }}
                        className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-forest-800 text-white border-forest-900' : 'bg-ivory-50 border-forest-800/10 text-charcoal-800'
                        }`}
                      >
                        <span className="truncate">{s.nameEn}</span>
                        <span className={`font-bold ml-1 ${isSelected ? 'text-copper-300' : 'text-copper-600'}`}>₹{s.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.selectBarber}</label>
                <select
                  value={walkInBarber}
                  onChange={(e) => setWalkInBarber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-sm focus:outline-none focus:border-copper-500"
                >
                  <option value="any">{t.anyBarber}</option>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Suite #{b.chair}) {b.onBreak ? `[${t.onBreak}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {modalError && (
                <p className="text-xs text-red-600 font-medium">{modalError}</p>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddWalkIn(false)}
                  className="flex-1 py-2.5 rounded-xl bg-ivory-100 text-charcoal-700 text-xs font-bold hover:bg-ivory-200"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-copper text-xs font-bold shadow-copper-glow"
                >
                  {t.quickSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
