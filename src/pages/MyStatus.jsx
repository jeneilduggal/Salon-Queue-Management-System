import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Clock, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Scissors, 
  ArrowLeft,
  Sparkles,
  MapPin
} from 'lucide-react';

export function MyStatus({ ticketId, onNavigate }) {
  const { 
    t, 
    language,
    tickets, 
    barbers, 
    services, 
    cancelTicket, 
    calculateEstimatedWait, 
    getQueuePosition,
    getServicesTotals
  } = useQueue();

  const [showCancelModal, setShowCancelModal] = useState(false);

  const ticket = tickets.find(t => t.id === ticketId || t.token === ticketId);
  const assignedBarber = barbers.find(b => b.id === (ticket?.assignedBarberId || ticket?.barberPreference));
  const isPreferredBarberOnBreak = assignedBarber?.onBreak;

  const position = ticket ? getQueuePosition(ticket.id) : 0;
  const estimatedWait = ticket ? calculateEstimatedWait(ticket) : 0;
  const { duration: totalDuration, price: totalPrice } = ticket 
    ? getServicesTotals(ticket.serviceIds) 
    : { duration: 0, price: 0 };

  useEffect(() => {
    if (ticket?.status === 'called' && typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([300, 150, 300, 150, 500]);
      } catch (e) {
        // Ignore
      }
    }
  }, [ticket?.status]);

  if (!ticket) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-white border border-forest-800/10 flex items-center justify-center mx-auto text-copper-600 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-forest-900 font-editorial">
          {language === 'gu' ? 'ટોકન મળ્યું નથી' : 'Reservation Not Found'}
        </h2>
        <p className="text-charcoal-500 text-sm">
          {language === 'gu' 
            ? 'આ ટોકન સક્રિય નથી અથવા રદ કરવામાં આવ્યું છે.' 
            : 'This token is no longer active in today\'s queue or has expired.'}
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="btn-forest px-6 py-3 rounded-2xl font-bold text-xs"
        >
          {t.navHome}
        </button>
      </div>
    );
  }

  const getPositionText = () => {
    if (ticket.status === 'in_chair') return t.currentlyServing;
    if (ticket.status === 'called') return t.statusCalled;
    if (position === 1) return t.firstInLine;
    if (position === 2) return t.secondInLine;
    if (position === 3) return t.thirdInLine;
    if (position === 4) return t.fourthInLine;
    if (position === 5) return t.fifthInLine;
    return `${position} ${t.nthInLine}`;
  };

  // FULL-SCREEN CELEBRATION TAKEOVER WHEN CALLED
  if (ticket.status === 'called') {
    return (
      <div className="fixed inset-0 z-50 bg-forest-900 text-ivory-100 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-md w-full bg-forest-800 rounded-3xl p-8 border border-copper-500/40 shadow-2xl text-ivory-100 space-y-6">
          
          <div className="w-20 h-20 rounded-full bg-copper-500 text-white flex items-center justify-center mx-auto shadow-copper-glow">
            <Bell className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-forest-900 text-copper-300 font-extrabold text-xs uppercase tracking-widest border border-copper-500/30">
              {ticket.token}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-3 text-white font-editorial">
              {t.itsYourTurnTitle}
            </h1>
            <p className="text-base text-ivory-200 mt-2 font-medium">
              {t.goToBarberPrefix} <span className="font-bold text-copper-300 text-lg">{assignedBarber?.name || 'Stylist'}</span>
            </p>
            <p className="text-xs text-sage-300 mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.chairStation} #{assignedBarber?.chair || 1}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-700 text-xs text-ivory-300 space-y-1">
            <p className="font-bold text-white">{ticket.name}</p>
            <p>{ticket.serviceIds.map(id => services.find(s => s.id === id)?.nameEn).join(', ')}</p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full btn-copper py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-copper-glow"
          >
            {language === 'gu' ? 'સમજાઈ ગયું' : 'Entering Salon Suite Now'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-1.5 text-xs font-semibold text-charcoal-400 hover:text-forest-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Salon Overview</span>
      </button>

      {/* 2nd in line Alert Banner */}
      {position === 2 && ticket.status === 'waiting' && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-center space-x-3.5 shadow-md animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-forest-950 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              {language === 'gu' ? 'ધ્યાન આપો!' : 'Arrival Notice'}
            </p>
            <p className="text-sm font-extrabold text-amber-950">
              {t.startComingBanner}
            </p>
          </div>
        </div>
      )}

      {/* Break Notice */}
      {isPreferredBarberOnBreak && ticket.status === 'waiting' && (
        <div className="p-4 rounded-2xl bg-ivory-200 border border-copper-500/30 text-charcoal-700 text-xs flex items-center space-x-2.5">
          <Clock className="w-4 h-4 text-copper-600 shrink-0" />
          <span>{t.barberBreakNotice}</span>
        </div>
      )}

      {/* Main Ticket Card */}
      <div className="heritage-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Token Badge */}
        <div className="inline-block px-7 py-2 rounded-2xl bg-forest-800 text-ivory-100 font-black text-3xl sm:text-4xl shadow-luxury border border-copper-500/30 tracking-wider font-editorial">
          {ticket.token}
        </div>

        <div>
          <h2 className="text-xl font-bold text-forest-900 font-editorial">
            {ticket.name}
          </h2>
          <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold mt-2 ${
            ticket.status === 'in_chair' 
              ? 'bg-forest-100 text-forest-800 border border-forest-300' 
              : ticket.status === 'done' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-copper-100 text-copper-800 border border-copper-300'
          }`}>
            {ticket.status === 'in_chair' ? t.statusInChair : ticket.status === 'done' ? t.statusDone : t.statusWaiting}
          </span>
        </div>

        {/* Position in Line */}
        {ticket.status === 'waiting' && (
          <div className="p-3.5 rounded-2xl bg-ivory-100 border border-forest-800/10">
            <p className="text-xs uppercase text-charcoal-400 tracking-wider font-bold">
              {t.yourPosition}
            </p>
            <p className="text-xl sm:text-2xl font-black text-forest-900 mt-0.5 font-editorial">
              {getPositionText()}
            </p>
          </div>
        )}

        {/* Circular Countdown Progress */}
        {ticket.status === 'waiting' && (
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-ivory-200"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-copper-500 transition-all duration-1000"
                  strokeWidth="7"
                  strokeDasharray="264"
                  strokeDashoffset={Math.max(20, 264 - (position > 0 ? (1 / position) * 200 : 50))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center text-center">
                <Clock className="w-5 h-5 text-copper-600 mb-1" />
                <span className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">
                  {t.expectedWait}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-forest-900 font-editorial mt-0.5">
                  ~{estimatedWait}
                </span>
                <span className="text-xs text-copper-600 font-bold">{t.mins}</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-400 mt-2">
              {language === 'gu' ? 'કતાર જેમ આગળ વધશે તેમ સમય આપોઆપ ઘટશે' : 'Synchronizes dynamically in real-time'}
            </p>
          </div>
        )}

        {/* In Chair State */}
        {ticket.status === 'in_chair' && (
          <div className="my-6 p-5 rounded-2xl bg-forest-800 text-ivory-100 border border-copper-500/30 text-sm">
            <p className="font-bold text-white text-base font-editorial">✂️ {t.statusInChair}</p>
            <p className="text-xs text-ivory-200/80 mt-1">
              {assignedBarber?.name ? `In session with Master Stylist ${assignedBarber.name} at Suite #${assignedBarber.chair}` : 'Service started'}
            </p>
          </div>
        )}

        {/* Done State */}
        {ticket.status === 'done' && (
          <div className="my-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="font-bold text-base font-editorial">{t.statusDone}</p>
            <p className="text-xs text-emerald-800">{t.thankYouMessage}</p>
          </div>
        )}

        {/* Services & Financials Breakdown */}
        <div className="pt-5 border-t border-forest-800/10 text-left space-y-3">
          <p className="text-xs uppercase font-black text-charcoal-400 tracking-wider">
            {t.serviceBreakdown}
          </p>
          
          <div className="space-y-2">
            {ticket.serviceIds.map(id => {
              const s = services.find(item => item.id === id);
              if (!s) return null;
              return (
                <div key={id} className="flex justify-between items-center text-xs text-charcoal-700 py-1 border-b border-ivory-200">
                  <span className="font-medium">{language === 'gu' ? s.nameGu : s.nameEn}</span>
                  <span className="font-bold text-forest-900">₹{s.price} ({s.duration}m)</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2 text-sm font-bold">
            <span className="text-charcoal-600">{t.totalPrice}</span>
            <span className="text-copper-600 text-base font-editorial font-black">₹{totalPrice}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-charcoal-500">
            <span>{t.preferredBarber}</span>
            <span className="font-bold text-forest-800">
              {ticket.barberPreference === 'any' ? t.anyBarber : (assignedBarber?.name || ticket.barberPreference)}
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        {ticket.status === 'waiting' && (
          <div className="pt-4">
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              {t.cancelSpotBtn}
            </button>
          </div>
        )}

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-forest-800/10 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-forest-900 font-editorial">
              {t.cancelModalTitle}
            </h3>
            <p className="text-xs text-charcoal-500">
              {t.cancelModalDesc}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 px-4 rounded-xl bg-ivory-100 text-charcoal-700 font-semibold text-xs hover:bg-ivory-200 transition-colors"
              >
                {t.keepMySpot}
              </button>
              <button
                onClick={() => {
                  cancelTicket(ticket.id);
                  setShowCancelModal(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
              >
                {t.confirmCancel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
