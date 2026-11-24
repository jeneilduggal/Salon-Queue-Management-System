import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  Scissors, 
  Play, 
  CheckCircle2, 
  Coffee, 
  Clock, 
  User, 
  PhoneCall, 
  AlertCircle,
  Sparkles,
  MapPin
} from 'lucide-react';
import { getNextCustomerForBarber } from '../utils/queueRules';

export function BarberView({ barberName = 'alexandre', onNavigate }) {
  const { 
    t, 
    language,
    barbers, 
    tickets, 
    services, 
    toggleBarberBreak, 
    callNextForBarber, 
    startService, 
    completeService,
    getServicesTotals 
  } = useQueue();

  const { user } = useAuth();

  const defaultBarber = (user?.barberId && barbers.find(b => b.id === user.barberId)) 
    || barbers.find(b => b.id.toLowerCase() === barberName.toLowerCase() || b.name.toLowerCase().includes(barberName.toLowerCase())) 
    || barbers[0];

  const [activeBarberId, setActiveBarberId] = useState(defaultBarber.id);
  const activeBarber = barbers.find(b => b.id === activeBarberId) || defaultBarber;

  const currentTicket = tickets.find(
    t => t.id === activeBarber.currentTicketId && ['called', 'in_chair'].includes(t.status)
  );

  const nextTicket = getNextCustomerForBarber(activeBarber.id, tickets);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (currentTicket && currentTicket.status === 'in_chair' && currentTicket.startedAt) {
      const updateTimer = () => {
        const secs = Math.floor((Date.now() - currentTicket.startedAt) / 1000);
        setElapsedSeconds(Math.max(0, secs));
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [currentTicket]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const { duration: expectedDuration } = currentTicket 
    ? getServicesTotals(currentTicket.serviceIds) 
    : { duration: 0 };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-lg mx-auto space-y-6">
      
      {/* Station Switcher */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-forest-800/10 shadow-sm">
        <span className="text-xs font-bold text-charcoal-400 pl-2">
          {t.selectBarberStation}:
        </span>
        <div className="flex gap-1.5 overflow-x-auto">
          {barbers.map(b => (
            <button
              key={b.id}
              onClick={() => {
                setActiveBarberId(b.id);
                onNavigate(`barber/${b.id}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                b.id === activeBarber.id
                  ? 'bg-forest-800 text-ivory-100 shadow-sm'
                  : 'text-charcoal-600 hover:bg-ivory-100'
              }`}
            >
              {b.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Stylist Profile Header */}
      <div className="heritage-panel rounded-3xl p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <span className="text-3xl p-2 bg-ivory-100 rounded-2xl border border-forest-800/10 shadow-sm">
            {activeBarber.avatar}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-forest-900 font-editorial">{activeBarber.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-800 text-ivory-100">
                Suite #{activeBarber.chair}
              </span>
            </div>
            <p className="text-xs text-copper-600 mt-0.5 font-medium">
              {activeBarber.specialty}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleBarberBreak(activeBarber.id)}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeBarber.onBreak
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200 border border-forest-800/10'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>{activeBarber.onBreak ? t.onBreakToggle : t.availableToggle}</span>
        </button>
      </div>

      {/* Break Warning */}
      {activeBarber.onBreak && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{t.breakActiveNotice}</span>
        </div>
      )}

      {/* Seated Client Card */}
      <div className="heritage-panel rounded-3xl p-6 sm:p-7 space-y-6">
        <p className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-1.5">
          <User className="w-4 h-4" />
          <span>{t.currentCustomer}</span>
        </p>

        {currentTicket ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-forest-900 font-editorial">
                  {currentTicket.token}
                </span>
                <h2 className="text-base font-bold text-charcoal-800 mt-1 font-editorial">
                  {currentTicket.name}
                </h2>
                <p className="text-xs text-charcoal-400 font-mono">
                  {currentTicket.phone}
                </p>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                currentTicket.status === 'in_chair'
                  ? 'bg-forest-100 text-forest-800 border-forest-300'
                  : 'bg-copper-100 text-copper-800 border-copper-300 animate-pulse'
              }`}>
                {currentTicket.status === 'in_chair' ? t.statusInChair : t.statusCalled}
              </span>
            </div>

            <div>
              <p className="text-[11px] text-charcoal-400 uppercase tracking-wider font-bold mb-1">
                {t.serviceBreakdown}
              </p>
              <div className="space-y-1">
                {currentTicket.serviceIds.map(id => {
                  const s = services.find(item => item.id === id);
                  return (
                    <div key={id} className="text-xs text-charcoal-700 flex justify-between py-1 border-b border-ivory-100">
                      <span>{language === 'gu' ? s?.nameGu : s?.nameEn}</span>
                      <span className="text-copper-600 font-bold">{s?.duration}m</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Timer */}
            {currentTicket.status === 'in_chair' && (
              <div className="p-5 rounded-2xl bg-forest-800 text-ivory-100 text-center shadow-md">
                <p className="text-[10px] text-ivory-300/80 uppercase tracking-widest font-bold">
                  {t.serviceTimer}
                </p>
                <p className="text-3xl sm:text-4xl font-black font-editorial mt-1">
                  {formatTimer(elapsedSeconds)}
                </p>
                <p className="text-[11px] text-copper-300 mt-0.5">
                  Target Service Window: {expectedDuration} {t.mins}
                </p>
              </div>
            )}

            <div className="pt-2">
              {currentTicket.status === 'called' ? (
                <button
                  onClick={() => startService(currentTicket.id, activeBarber.id)}
                  className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl btn-forest font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{t.startBtn}</span>
                </button>
              ) : (
                <button
                  onClick={() => completeService(currentTicket.id, activeBarber.id)}
                  className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl btn-copper font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-copper-glow cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>{t.doneBtn}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-ivory-100 text-charcoal-400 flex items-center justify-center mx-auto border border-forest-800/10">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-forest-900 font-editorial">{t.noCustomerInChair}</p>
              <p className="text-xs text-charcoal-500 mt-1">
                {activeBarber.onBreak ? t.breakActiveNotice : 'Seat the next waiting client for your suite'}
              </p>
            </div>

            <button
              onClick={() => callNextForBarber(activeBarber.id)}
              disabled={activeBarber.onBreak || !activeBarber.onDuty}
              className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                activeBarber.onBreak || !activeBarber.onDuty
                  ? 'bg-ivory-100 text-charcoal-400 cursor-not-allowed border border-ivory-200'
                  : 'btn-copper shadow-copper-glow cursor-pointer'
              }`}
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t.callCustomerHere}</span>
            </button>
          </div>
        )}
      </div>

      {/* Next Client Preview */}
      <div className="heritage-panel rounded-3xl p-5 space-y-3">
        <p className="text-xs uppercase font-black tracking-widest text-charcoal-400 flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-copper-600" />
          <span>{t.nextForYou}</span>
        </p>

        {nextTicket ? (
          <div className="p-4 rounded-2xl bg-ivory-50 border border-forest-800/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-black text-forest-900 bg-ivory-200 px-2.5 py-1 rounded-xl font-editorial">
                {nextTicket.token}
              </span>
              <div>
                <p className="text-sm font-bold text-forest-900 font-editorial">{nextTicket.name}</p>
                <p className="text-[11px] text-charcoal-500">
                  {nextTicket.serviceIds.map(id => services.find(s => s.id === id)?.nameEn).join(', ')}
                </p>
              </div>
            </div>
            <span className="text-xs text-copper-600 font-bold">
              {getServicesTotals(nextTicket.serviceIds).duration}m
            </span>
          </div>
        ) : (
          <p className="text-xs text-charcoal-400 text-center py-2">
            {t.noUpcomingCustomer}
          </p>
        )}
      </div>

    </div>
  );
}
