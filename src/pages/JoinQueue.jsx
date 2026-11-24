import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Scissors, 
  Sparkles, 
  ShowerHead, 
  Smile, 
  Palette, 
  Check, 
  Clock, 
  User, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

const SERVICE_ICONS = {
  Scissors,
  Sparkles,
  ShowerHead,
  Smile,
  Palette
};

export function JoinQueue({ onNavigate }) {
  const { 
    t, 
    language, 
    services, 
    barbers, 
    queueOpen, 
    joinQueue, 
    calculateEstimatedWait 
  } = useQueue();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState(['bespoke_cut']);
  const [selectedBarberId, setSelectedBarberId] = useState('any');
  const [formError, setFormError] = useState('');
  const [duplicateTicket, setDuplicateTicket] = useState(null);

  const activeServices = useMemo(() => services.filter(s => s.active), [services]);

  const handleToggleService = (serviceId) => {
    setFormError('');
    if (selectedServiceIds.includes(serviceId)) {
      if (selectedServiceIds.length === 1) {
        setFormError(t.servicesValidationErr);
        return;
      }
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
    } else {
      if (selectedServiceIds.length >= 3) {
        setFormError(language === 'gu' ? 'મહત્તમ ૩ સેવાઓ પસંદ કરી શકાય' : 'Maximum 3 services permitted per booking.');
        return;
      }
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const { totalDuration, totalPrice } = useMemo(() => {
    let duration = 0;
    let price = 0;
    selectedServiceIds.forEach(id => {
      const s = activeServices.find(item => item.id === id);
      if (s) {
        duration += s.duration || 0;
        price += s.price || 0;
      }
    });
    return { totalDuration: duration, totalPrice: price };
  }, [selectedServiceIds, activeServices]);

  const liveExpectedWait = useMemo(() => {
    const dummyTicket = {
      id: 'preview',
      token: 'PREVIEW',
      serviceIds: selectedServiceIds,
      barberPreference: selectedBarberId,
      status: 'waiting',
      createdAt: Date.now()
    };
    return calculateEstimatedWait(dummyTicket);
  }, [selectedServiceIds, selectedBarberId, calculateEstimatedWait]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setDuplicateTicket(null);

    if (!queueOpen) {
      setFormError(t.onlineQueueClosedDesc);
      return;
    }

    if (!name.trim()) {
      setFormError(t.nameValidationErr);
      return;
    }

    const cleanedPhone = phone.replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setFormError(t.phoneValidationErr);
      return;
    }

    if (selectedServiceIds.length === 0) {
      setFormError(t.servicesValidationErr);
      return;
    }

    const result = joinQueue({
      name: name.trim(),
      phone: cleanedPhone,
      serviceIds: selectedServiceIds,
      barberPreference: selectedBarberId
    });

    if (result.success) {
      onNavigate(`status/${result.ticket.id}`);
    } else if (result.error === 'duplicate_phone') {
      setDuplicateTicket(result.existingTicket);
      setFormError(t.duplicatePhoneErr);
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
      
      {/* Top Breadcrumb */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-1.5 text-xs font-semibold text-charcoal-400 hover:text-forest-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Salon Overview</span>
      </button>

      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-extrabold text-copper-600 tracking-widest">
          Haute Coiffure Waiting List
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-forest-900 tracking-tight font-editorial">
          {t.joinQueueTitle}
        </h1>
        <p className="text-charcoal-500 text-xs sm:text-sm max-w-md mx-auto">
          {t.joinQueueSubtitle}
        </p>
      </div>

      {/* Online Queue Paused Banner */}
      {!queueOpen && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">{t.onlineQueueClosed}</p>
            <p className="text-xs text-amber-800 mt-1">{t.onlineQueueClosedDesc}</p>
          </div>
        </div>
      )}

      {/* Duplicate Phone Notice */}
      {duplicateTicket && (
        <div className="p-5 rounded-3xl bg-forest-800 text-ivory-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-luxury border border-copper-500/30">
          <div className="flex items-center space-x-3.5">
            <ShieldAlert className="w-6 h-6 text-copper-400 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-copper-300 uppercase tracking-wider">{t.duplicatePhoneErr}</p>
              <p className="text-sm font-bold text-white">Active Token: {duplicateTicket.token} ({duplicateTicket.name})</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate(`status/${duplicateTicket.id}`)}
            className="w-full sm:w-auto btn-copper px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            {t.viewExistingSpot}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Client Particulars */}
        <div className="heritage-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>1. {t.customerInfo}</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormError('');
                }}
                placeholder={t.fullNamePlaceholder}
                className="w-full px-4 py-3 rounded-2xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-sm focus:outline-none focus:border-copper-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                {t.phoneNumber} (10 digits) *
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 text-xs font-bold text-charcoal-500 border-r border-forest-800/10 pr-2.5">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhone(val);
                    setFormError('');
                    setDuplicateTicket(null);
                  }}
                  placeholder={t.phonePlaceholder}
                  className="w-full pl-24 pr-4 py-3 rounded-2xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-sm focus:outline-none focus:border-copper-500 transition-colors font-mono tracking-wider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Treatment Selection */}
        <div className="heritage-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-2">
              <Scissors className="w-4 h-4" />
              <span>2. {t.selectServices}</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-800 text-ivory-100 font-bold">
              {selectedServiceIds.length}/3 {t.selectedCount}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              const IconComponent = SERVICE_ICONS[service.icon] || Scissors;

              return (
                <div
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-forest-800 text-ivory-100 border-forest-900 shadow-md'
                      : 'bg-white border-forest-800/10 hover:border-copper-500/40 text-charcoal-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-copper-500 text-white' : 'bg-ivory-100 text-forest-800'
                    }`}>
                      <IconComponent className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold font-editorial ${isSelected ? 'text-ivory-100' : 'text-forest-900'}`}>
                        {language === 'gu' ? service.nameGu : service.nameEn}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-ivory-200/80' : 'text-charcoal-500'}`}>
                        <span>{service.duration} {t.mins}</span>
                        <span> • </span>
                        <span className="font-bold text-copper-600">₹{service.price}</span>
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-copper-500 border-copper-500 text-white' : 'border-forest-800/20 bg-ivory-50'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Stylist Preference */}
        <div className="heritage-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>3. {t.selectBarber}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Any Stylist Option */}
            <div
              onClick={() => setSelectedBarberId('any')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                selectedBarberId === 'any'
                  ? 'bg-forest-800 text-ivory-100 border-forest-900 shadow-md'
                  : 'bg-white border-forest-800/10 hover:border-copper-500/40 text-charcoal-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                selectedBarberId === 'any' ? 'bg-copper-500 text-white' : 'bg-ivory-100 text-forest-800'
              }`}>
                ⚡
              </div>
              <div className="flex-1">
                <p className={`text-xs sm:text-sm font-bold font-editorial ${selectedBarberId === 'any' ? 'text-white' : 'text-forest-900'}`}>
                  {t.anyBarber}
                </p>
                <p className={`text-[11px] ${selectedBarberId === 'any' ? 'text-ivory-200/80' : 'text-charcoal-500'}`}>
                  {t.anyBarberDesc}
                </p>
              </div>
              {selectedBarberId === 'any' && (
                <div className="w-5 h-5 rounded-md bg-copper-500 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Individual Stylists */}
            {barbers.map((barber) => {
              const isSelected = selectedBarberId === barber.id;
              const isOnBreak = barber.onBreak;

              return (
                <div
                  key={barber.id}
                  onClick={() => setSelectedBarberId(barber.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                    isSelected
                      ? 'bg-forest-800 text-ivory-100 border-forest-900 shadow-md'
                      : 'bg-white border-forest-800/10 hover:border-copper-500/40 text-charcoal-800'
                  }`}
                >
                  <span className="text-2xl p-1 bg-ivory-100 rounded-xl">{barber.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`text-xs sm:text-sm font-bold font-editorial ${isSelected ? 'text-white' : 'text-forest-900'}`}>
                        {barber.name}
                      </p>
                      {isOnBreak && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                          {t.onBreak}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${isSelected ? 'text-ivory-200/80' : 'text-charcoal-500'}`}>
                      Suite #{barber.chair} • {barber.specialty}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-md bg-copper-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Estimate Summary Box */}
        <div className="heritage-panel-dark rounded-3xl p-6 space-y-4">
          <p className="text-xs uppercase font-black tracking-widest text-copper-300">
            {t.summaryTitle}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-forest-700/80 text-center">
            <div>
              <p className="text-[10px] text-ivory-300/80 uppercase tracking-widest">{t.totalDuration}</p>
              <p className="text-base sm:text-xl font-bold text-ivory-100 mt-0.5">{totalDuration} {t.mins}</p>
            </div>
            <div>
              <p className="text-[10px] text-ivory-300/80 uppercase tracking-widest">{t.totalPrice}</p>
              <p className="text-base sm:text-xl font-bold text-copper-400 mt-0.5">₹{totalPrice}</p>
            </div>
            <div>
              <p className="text-[10px] text-ivory-300/80 uppercase tracking-widest">{t.expectedWait}</p>
              <p className="text-base sm:text-xl font-bold text-ivory-100 mt-0.5">~{liveExpectedWait} {t.mins}</p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-2xl bg-red-900/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!queueOpen}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 transition-all ${
              queueOpen
                ? 'btn-copper shadow-copper-glow cursor-pointer'
                : 'bg-forest-900/60 text-charcoal-400 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{t.confirmJoinBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
