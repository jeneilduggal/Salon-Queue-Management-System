import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Scissors, 
  Sparkles, 
  ShowerHead, 
  Smile, 
  Palette, 
  Clock, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Star
} from 'lucide-react';

const SERVICE_ICONS = {
  Scissors,
  Sparkles,
  ShowerHead,
  Smile,
  Palette
};

export function ServiceCatalog({ onNavigate }) {
  const { services, t, language } = useQueue();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: language === 'gu' ? 'બધી સેવાઓ' : 'All Treatments' },
    { id: 'hair', label: language === 'gu' ? 'હેરકટ્સ' : 'Hair & Silhouette' },
    { id: 'grooming', label: language === 'gu' ? 'શેવ અને દાઢી' : 'Shave & Grooming' },
    { id: 'treatment', label: language === 'gu' ? 'સ્પા અને થેરાપી' : 'Scalp & Facial Spa' },
    { id: 'color', label: language === 'gu' ? 'કલરિંગ' : 'Color & Tonal Glaze' },
  ];

  const filteredServices = services
    .filter(s => s.active)
    .filter(s => activeCategory === 'all' || s.category === activeCategory);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-copper-500">
          Haute Coiffure Menu
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-forest-800 tracking-tight font-editorial">
          Curated Treatments & Rituals
        </h1>
        <p className="text-charcoal-500 text-sm sm:text-base leading-relaxed">
          Every service at L'ÉLITE StyleQ is performed by our master artisans using cold-pressed botanical formulations and classical shear ergonomics.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-forest-800 text-ivory-100 shadow-md'
                : 'bg-white border border-forest-800/10 text-charcoal-600 hover:border-copper-500/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const IconComponent = SERVICE_ICONS[service.icon] || Scissors;

          return (
            <div
              key={service.id}
              className="heritage-card rounded-3xl p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-ivory-100 border border-forest-800/10 flex items-center justify-center text-forest-800 shadow-sm">
                    <IconComponent className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-copper-600 font-editorial">
                      ₹{service.price}
                    </span>
                    <p className="text-[11px] text-charcoal-400 font-medium">
                      {service.duration} {t.mins} ritual
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-forest-900 font-editorial">
                    {language === 'gu' ? service.nameGu : service.nameEn}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1.5 leading-relaxed">
                    {service.description || "Signature styling consultation, personalized preparation & luxury treatment finish."}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-forest-800/10 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] text-sage-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Master Stylist Assisted</span>
                </div>
                <button
                  onClick={() => onNavigate('join')}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-copper-600 hover:text-copper-700 transition-colors"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="heritage-panel-dark rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase font-extrabold text-copper-300 tracking-widest">
            Walk-in & Digital Queuing
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-ivory-100 font-editorial">
            Ready to Experience L'ÉLITE?
          </h2>
          <p className="text-xs sm:text-sm text-ivory-200/80 max-w-lg">
            Join our live salon waiting list directly from your phone. We will notify you when your styling suite is prepared.
          </p>
        </div>

        <button
          onClick={() => onNavigate('join')}
          className="btn-copper px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-copper-glow shrink-0 flex items-center space-x-2"
        >
          <span>{t.joinQueueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
