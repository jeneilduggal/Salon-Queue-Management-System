import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sliders, 
  Users, 
  Clock, 
  DollarSign, 
  Plus, 
  Edit2, 
  RotateCcw, 
  ToggleLeft, 
  ToggleRight,
  Scissors,
  Search,
  Sparkles,
  TrendingUp,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export function AdminSettings() {
  const { 
    t, 
    language,
    services, 
    barbers, 
    stats, 
    queueOpen, 
    toggleQueueOpen, 
    toggleServiceActive, 
    saveService,
    addService,
    toggleBarberDuty, 
    resetDemoData 
  } = useQueue();

  const { user } = useAuth();

  const [serviceSearch, setServiceSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameGu, setFormNameGu] = useState('');
  const [formDuration, setFormDuration] = useState(30);
  const [formPrice, setFormPrice] = useState(500);

  const handleStartEdit = (service) => {
    setEditingServiceId(service.id);
    setFormNameEn(service.nameEn);
    setFormNameGu(service.nameGu);
    setFormDuration(service.duration);
    setFormPrice(service.price);
  };

  const handleSaveEdit = (serviceId) => {
    const existing = services.find(s => s.id === serviceId);
    if (!existing) return;

    saveService({
      ...existing,
      nameEn: formNameEn.trim(),
      nameGu: formNameGu.trim(),
      duration: Number(formDuration),
      price: Number(formPrice)
    });
    setEditingServiceId(null);
  };

  const handleCreateNewService = (e) => {
    e.preventDefault();
    if (!formNameEn.trim()) return;

    const newId = `srv_${Date.now()}`;
    addService({
      id: newId,
      category: 'hair',
      nameEn: formNameEn.trim(),
      nameGu: formNameGu.trim() || formNameEn.trim(),
      description: "Custom artisan treatment tailored to client specification.",
      duration: Number(formDuration),
      price: Number(formPrice),
      icon: 'Scissors',
      active: true
    });

    setFormNameEn('');
    setFormNameGu('');
    setFormDuration(30);
    setFormPrice(500);
    setShowAddModal(false);
  };

  const filteredServices = services.filter(s => 
    s.nameEn.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.nameGu.includes(serviceSearch)
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="heritage-panel rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-forest-900 tracking-tight font-editorial">
              {t.adminTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-forest-800 text-ivory-100 text-[10px] font-black uppercase tracking-widest">
              Executive Suite
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Logged in as: <strong className="text-forest-900">{user?.name || 'Managing Director'}</strong> • Treatment catalog curation, stylist staffing & business performance
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Reset all tickets and re-seed L'ÉLITE sample ledger?")) {
              resetDemoData();
            }
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-ivory-100 hover:bg-forest-800 hover:text-white border border-forest-800/15 text-charcoal-700 text-xs font-bold transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.demoReset}</span>
        </button>
      </div>

      {/* Financials & Volume Metrics */}
      <div>
        <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 mb-3 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>{t.statsHeader}</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="heritage-card p-5 rounded-3xl">
            <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">{t.statServed}</p>
            <p className="text-3xl font-black text-forest-900 mt-1 font-editorial">{stats.servedCount}</p>
            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Attended
            </p>
          </div>
          <div className="heritage-card p-5 rounded-3xl">
            <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">{t.statAvgWait}</p>
            <p className="text-3xl font-black text-forest-900 mt-1 font-editorial">{stats.avgWait} <span className="text-xs text-copper-600 font-bold">{t.mins}</span></p>
            <p className="text-[11px] text-charcoal-400 mt-1 font-medium">Per client seating wait</p>
          </div>
          <div className="heritage-card p-5 rounded-3xl">
            <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">{t.statNoShows}</p>
            <p className="text-3xl font-black text-amber-700 mt-1 font-editorial">{stats.noShowCount}</p>
            <p className="text-[11px] text-amber-800 mt-1 font-medium">Auto-expired</p>
          </div>
          <div className="heritage-card p-5 rounded-3xl">
            <p className="text-[10px] text-charcoal-400 uppercase tracking-widest font-bold">{t.statRevenue}</p>
            <p className="text-3xl font-black text-copper-600 mt-1 font-editorial">₹{stats.totalRevenue}</p>
            <p className="text-[11px] text-copper-700 mt-1 font-medium">Today's Gross Billing</p>
          </div>
        </div>
      </div>

      {/* Online Queue Access Control */}
      <div className="heritage-panel rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-forest-900 font-editorial">{t.queueControls}</h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {queueOpen ? t.openForPublic : t.closedForPublic}
          </p>
        </div>

        <button
          onClick={toggleQueueOpen}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-black transition-all ${
            queueOpen
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}
        >
          {queueOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          <span>{queueOpen ? 'QUEUE IS OPEN' : 'QUEUE IS PAUSED'}</span>
        </button>
      </div>

      {/* Stylist Staff Duty Roster */}
      <div>
        <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 mb-3 flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{t.barberStaffConfig}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {barbers.map(barber => (
            <div 
              key={barber.id}
              className="heritage-card p-5 rounded-3xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl p-1 bg-ivory-100 rounded-xl">{barber.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-forest-900 font-editorial">{barber.name}</p>
                  <p className="text-xs text-copper-600 font-medium">Suite #{barber.chair}</p>
                </div>
              </div>

              <button
                onClick={() => toggleBarberDuty(barber.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  barber.onDuty
                    ? 'bg-forest-800 text-ivory-100 border-forest-900'
                    : 'bg-ivory-100 text-charcoal-400 border-ivory-200'
                }`}
              >
                {barber.onDuty ? t.onDuty : t.offDuty}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Services Menu Catalog Management */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2 className="text-xs uppercase font-black tracking-widest text-copper-600 flex items-center space-x-2">
            <Scissors className="w-4 h-4" />
            <span>{t.servicesConfig}</span>
          </h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search menu..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-forest-800/15 text-charcoal-900 text-xs focus:outline-none focus:border-copper-500"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn-copper px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewService}</span>
            </button>
          </div>
        </div>

        <div className="heritage-panel rounded-3xl overflow-hidden">
          <div className="divide-y divide-ivory-200">
            {filteredServices.map(service => {
              const isEditing = editingServiceId === service.id;

              return (
                <div key={service.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1 w-full">
                      <input
                        type="text"
                        value={formNameEn}
                        onChange={(e) => setFormNameEn(e.target.value)}
                        placeholder="English Title"
                        className="px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs"
                      />
                      <input
                        type="text"
                        value={formNameGu}
                        onChange={(e) => setFormNameGu(e.target.value)}
                        placeholder="Gujarati Title"
                        className="px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs font-gu"
                      />
                      <input
                        type="number"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="Mins"
                        className="px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs"
                      />
                      <input
                        type="number"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="Price ₹"
                        className="px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-forest-900 font-editorial">{service.nameEn}</p>
                        <span className="text-xs text-charcoal-400 font-gu">({service.nameGu})</span>
                      </div>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {service.duration} {t.mins} • ₹{service.price}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(service.id)}
                        className="btn-copper px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        {t.save}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(service)}
                        className="p-2 rounded-xl bg-ivory-100 text-charcoal-600 hover:text-forest-900 border border-ivory-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => toggleServiceActive(service.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        service.active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-ivory-100 text-charcoal-400 border-ivory-200'
                      }`}
                    >
                      {service.active ? t.active : t.inactive}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-forest-800/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-forest-900 font-editorial">{t.addNewService}</h3>
            <form onSubmit={handleCreateNewService} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.serviceNameEn} *</label>
                <input
                  type="text"
                  required
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="e.g. Botanical Beard Glaze"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.serviceNameGu}</label>
                <input
                  type="text"
                  value={formNameGu}
                  onChange={(e) => setFormNameGu(e.target.value)}
                  placeholder="દા.ત. બોટાનિકલ દાઢી ગ્લેઝ"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs font-gu"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.serviceDuration} *</label>
                  <input
                    type="number"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">{t.servicePrice} *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-ivory-100 text-charcoal-700 text-xs font-bold hover:bg-ivory-200"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-copper text-xs font-bold shadow-copper-glow"
                >
                  {t.addNewService}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
