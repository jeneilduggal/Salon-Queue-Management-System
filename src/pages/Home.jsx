import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Search,
  Coffee,
  Compass,
  Star,
  ShieldCheck,
  Scissors
} from 'lucide-react';

export function Home({ onNavigate }) {
  const { 
    t, 
    language,
    queueOpen, 
    barbers, 
    activeWaitingCount, 
    totalEstimatedWaitTime, 
    myTicketId,
    tickets
  } = useQueue();

  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const token = trackInput.trim().toUpperCase();
    if (!token) return;

    const found = tickets.find(t => t.token === token || t.id === token);
    if (found) {
      onNavigate(`status/${found.id}`);
    } else {
      setTrackError(language === 'gu' ? 'ટોકન મળ્યું નથી' : 'Ticket reference not found. Check format.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Active Spot Banner if client already holds a ticket */}
      {myTicketId && (
        <div className="p-4 sm:p-5 rounded-3xl bg-forest-800 text-ivory-100 flex items-center justify-between shadow-luxury border border-copper-500/30">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-copper-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
              {myTicketId}
            </div>
            <div>
              <p className="text-[10px] text-copper-300 font-bold uppercase tracking-widest">
                {language === 'gu' ? 'તમારું સક્રિય ટોકન' : 'Active Seating Reservation'}
              </p>
              <p className="text-sm font-semibold text-ivory-100">
                {language === 'gu' ? 'તમારું ટોકન લાઇવ ટ્રેક કરો' : 'You hold an active reservation in today\'s queue'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate(`status/${myTicketId}`)}
            className="btn-copper px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
          >
            <span>{t.trackMySpotBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editorial Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-forest-800/10 text-copper-600 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-copper-500" />
          <span>The Art of Bespoke Grooming</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-forest-900 tracking-tight font-editorial leading-[1.1]">
          {t.salonName}
        </h1>
        
        <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
          Haute coiffure and classical grooming rituals tailored to the modern gentleman and discerning clientele. Reserve your place in our live salon queue seamlessly from anywhere.
        </p>

        {/* CTA Pair */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('join')}
            disabled={!queueOpen}
            className={`btn-copper px-7 py-3.5 rounded-2xl font-bold text-sm tracking-wide flex items-center space-x-2 shadow-copper-glow cursor-pointer ${
              !queueOpen ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{t.joinQueueBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="px-6 py-3.5 rounded-2xl bg-white border border-forest-800/15 text-forest-800 font-bold text-sm hover:border-copper-500/50 hover:bg-ivory-50 transition-all flex items-center space-x-2 shadow-sm"
          >
            <Compass className="w-4 h-4 text-copper-500" />
            <span>{t.viewCatalogBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Live Waiting Board */}
      <div className="heritage-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-forest-800/10">
          
          {/* Waiting Count */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-800 text-ivory-100 flex items-center justify-center shadow-md">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal-400 font-bold">
                {t.liveQueueStatus}
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-black text-forest-900 font-editorial">
                  {activeWaitingCount}
                </span>
                <span className="text-sm font-semibold text-charcoal-600">
                  {activeWaitingCount === 1 ? t.personWaiting : t.peopleWaiting}
                </span>
              </div>
            </div>
          </div>

          {/* Approx Wait Time */}
          <div className="flex items-center space-x-4 bg-ivory-100 px-5 py-3.5 rounded-2xl border border-forest-800/10">
            <Clock className="w-6 h-6 text-copper-600" />
            <div>
              <p className="text-[11px] text-charcoal-500 uppercase tracking-wider font-bold">
                {t.aboutWait}
              </p>
              <p className="text-lg sm:text-xl font-black text-forest-900 font-editorial">
                {activeWaitingCount === 0 ? '0 ' + t.mins : `~${totalEstimatedWaitTime} ${t.mins}`}
              </p>
            </div>
          </div>
        </div>

        {/* Master Stylists On Duty */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              {t.barberStatusTitle}
            </p>
            <span className="text-xs text-copper-600 font-semibold">
              {barbers.filter(b => b.onDuty).length} Specialists in Attendance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {barbers.map((barber) => {
              const isBusy = barber.status === 'busy';
              const isOnBreak = barber.onBreak || barber.status === 'on_break';

              let statusPill = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.available}
                </span>
              );
              if (isOnBreak) {
                statusPill = (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {t.onBreak}
                  </span>
                );
              } else if (isBusy) {
                statusPill = (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 border border-forest-200">
                    {t.busy}
                  </span>
                );
              }

              return (
                <div 
                  key={barber.id}
                  className="heritage-card p-4 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-1.5 bg-ivory-100 rounded-xl border border-forest-800/10">
                      {barber.avatar}
                    </span>
                    {statusPill}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-forest-900 font-editorial">
                      {barber.name}
                    </h3>
                    <p className="text-[11px] text-copper-600 font-medium">
                      Station #{barber.chair} • {barber.role?.split('&')[0] || 'Stylist'}
                    </p>
                    <p className="text-[10px] text-charcoal-400 mt-1 truncate">
                      {barber.specialty}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Look Up Existing Token Search */}
      <div className="bg-white border border-forest-800/10 rounded-3xl p-6 shadow-sm">
        <p className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-2">
          {t.trackMySpotBtn}
        </p>
        <form onSubmit={handleTrackSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={trackInput}
              onChange={(e) => {
                setTrackInput(e.target.value);
                setTrackError('');
              }}
              placeholder={t.enterTokenPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-sm focus:outline-none focus:border-copper-500 transition-colors font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="btn-forest px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {t.trackMySpotBtn}
          </button>
        </form>
        {trackError && (
          <p className="text-xs text-red-500 mt-2 font-medium">{trackError}</p>
        )}
      </div>

      {/* Heritage Quality Commitments */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-forest-800/10 text-center">
        <div className="p-4 rounded-2xl bg-white border border-forest-800/5">
          <Star className="w-5 h-5 text-copper-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-forest-900 font-editorial">Master Craftsmen</h4>
          <p className="text-xs text-charcoal-500 mt-0.5">Decades of cumulative precision and artisanal mastery.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-forest-800/5">
          <Clock className="w-5 h-5 text-copper-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-forest-900 font-editorial">Respect for Time</h4>
          <p className="text-xs text-charcoal-500 mt-0.5">Real-time queue tracking so you arrive in complete comfort.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-forest-800/5">
          <ShieldCheck className="w-5 h-5 text-copper-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-forest-900 font-editorial">Cold-Pressed Botanicals</h4>
          <p className="text-xs text-charcoal-500 mt-0.5">Pure botanical oils, organic extracts & clean formulations.</p>
        </div>
      </div>

    </div>
  );
}
