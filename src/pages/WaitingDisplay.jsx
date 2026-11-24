import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Tv, 
  Clock, 
  Bell, 
  Sparkles, 
  Users, 
  Scissors, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { soundChime } from '../components/AudioNotification';

export function WaitingDisplay() {
  const { 
    t, 
    language,
    barbers, 
    tickets, 
    services, 
    lastCalled,
    getServicesTotals,
    calculateEstimatedWait 
  } = useQueue();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const upNextTickets = tickets
    .filter(t => t.status === 'waiting')
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, 5);

  const isRecentCall = lastCalled && (Date.now() - lastCalled.timestamp) < 15000;

  return (
    <div className="min-h-screen bg-forest-950 text-ivory-100 p-6 sm:p-10 flex flex-col justify-between selection:bg-copper-500 selection:text-white">
      
      {/* Top TV Bar: Brand, Clock, Audio indicator */}
      <div className="flex items-center justify-between pb-6 border-b border-forest-800">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-copper-500 text-white flex items-center justify-center font-black shadow-copper-glow">
            <Scissors className="w-8 h-8 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-editorial text-white">
                L'ÉLITE
              </h1>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-forest-800 text-copper-300 border border-copper-500/30 uppercase tracking-widest">
                StyleQ
              </span>
            </div>
            <p className="text-sage-300 text-xs sm:text-sm font-medium tracking-widest uppercase">
              {t.tvSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              if (!audioEnabled) soundChime.playCallChime();
            }}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-forest-900 border border-forest-800 text-xs font-semibold text-ivory-200 hover:text-white"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-copper-400" /> : <VolumeX className="w-4 h-4 text-charcoal-400" />}
            <span className="hidden sm:inline">{audioEnabled ? t.soundNotificationOn : 'Chime Muted'}</span>
          </button>

          <div className="text-right">
            <p className="text-2xl sm:text-4xl font-black font-editorial tracking-wider text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-xs text-sage-300 uppercase tracking-widest font-semibold">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* NOW SEATING BANNER ON NEW CALL */}
      {isRecentCall && (
        <div className="my-6 p-6 sm:p-7 rounded-3xl bg-copper-600 text-white flex items-center justify-between shadow-2xl animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-950 text-copper-400 flex items-center justify-center shadow-md">
              <Bell className="w-9 h-9 animate-bounce" />
            </div>
            <div>
              <p className="text-xs uppercase font-black tracking-widest text-copper-200">
                {t.newlyCalledAlert}
              </p>
              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-editorial tracking-wider">
                  {lastCalled.token}
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-editorial">
                  {lastCalled.name}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right bg-black/20 px-6 py-3.5 rounded-2xl border border-white/20">
            <p className="text-xs uppercase font-bold text-copper-200 tracking-wider">
              {t.pleaseProceedTo}
            </p>
            <p className="text-xl sm:text-2xl font-black font-editorial">
              {lastCalled.barberName} (Suite #{lastCalled.chair})
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Active Suites + Next in Line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 flex-1 items-stretch">
        
        {/* LEFT: Active Suites */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-copper-400 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{t.nowServingHeader}</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 flex-1">
            {barbers.map(barber => {
              const currentTicket = tickets.find(
                t => t.id === barber.currentTicketId && ['called', 'in_chair'].includes(t.status)
              );
              const isOnBreak = barber.onBreak;
              const isServing = Boolean(currentTicket);

              return (
                <div 
                  key={barber.id}
                  className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${
                    isServing
                      ? 'bg-forest-900 border-copper-500/50 shadow-luxury'
                      : isOnBreak
                      ? 'bg-forest-950/70 border-forest-900 opacity-60'
                      : 'bg-forest-900/60 border-forest-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl p-2 bg-forest-950 rounded-2xl border border-forest-800">
                      {barber.avatar}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-white font-editorial">{barber.name}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-forest-950 text-sage-300">
                          Suite #{barber.chair}
                        </span>
                      </div>
                      <p className="text-xs text-copper-300 mt-0.5">
                        {isOnBreak ? t.onBreak : isServing ? 'Treatment in Session' : t.available}
                      </p>
                    </div>
                  </div>

                  {currentTicket ? (
                    <div className="text-right">
                      <p className="text-[10px] text-copper-300 font-extrabold uppercase tracking-widest">
                        {t.nowLabel}
                      </p>
                      <span className="text-3xl sm:text-4xl font-black text-white font-editorial block mt-0.5">
                        {currentTicket.token}
                      </span>
                      <p className="text-sm font-semibold text-ivory-200 font-editorial">
                        {currentTicket.name}
                      </p>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-4 py-2 rounded-2xl border ${
                      isOnBreak
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    }`}>
                      {isOnBreak ? t.onBreak : t.available}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Up Next 5 Tokens */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-copper-400 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{t.upNextHeader}</span>
            </h2>
            <span className="text-xs font-bold text-sage-300">
              Next 5 in Succession
            </span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {upNextTickets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-forest-900/60 border border-forest-800 text-center">
                <Scissors className="w-12 h-12 text-forest-700 mb-3" />
                <p className="text-base font-bold text-white font-editorial">{t.noOneWaiting}</p>
                <p className="text-xs text-sage-300 mt-1">Walk-ins warmly accommodated</p>
              </div>
            ) : (
              upNextTickets.map((ticket, idx) => {
                const wait = calculateEstimatedWait(ticket);
                const isNext = idx === 0;

                return (
                  <div
                    key={ticket.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isNext
                        ? 'bg-forest-900 border-copper-500 shadow-md'
                        : 'bg-forest-900/60 border-forest-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black font-editorial ${
                        isNext 
                          ? 'bg-copper-500 text-white shadow-sm' 
                          : 'bg-forest-950 text-copper-300 border border-forest-800'
                      }`}>
                        {ticket.token}
                      </div>
                      <div>
                        <p className="text-base font-bold text-white font-editorial">{ticket.name}</p>
                        <p className="text-xs text-sage-300">
                          {ticket.barberPreference === 'any' ? t.anyBarber : `For ${ticket.barberPreference}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-sage-400 tracking-wider font-bold">
                        {t.aboutWait}
                      </span>
                      <p className="text-base font-extrabold text-copper-300 font-editorial">
                        ~{wait} {t.mins}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-forest-800 text-center text-xs text-sage-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>📍 L'ÉLITE StyleQ · Promenade Arcade, Haute Suite Level 2</span>
        <span className="text-copper-300 font-medium">✨ Join the waiting list live from your device</span>
      </div>

    </div>
  );
}
