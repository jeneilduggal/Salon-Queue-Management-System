import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';

export function ProtectedRoute({ requiredRole, children, onNavigate }) {
  const { hasAccess, user, openLoginFor } = useAuth();

  if (hasAccess(requiredRole)) {
    return <>{children}</>;
  }

  const roleTitles = {
    receptionist: 'Concierge & Front Desk Ledger',
    barber: 'Stylist Suite & Mirror Console',
    admin: 'Executive Management & Financials'
  };

  const requiredTitle = roleTitles[requiredRole] || requiredRole;

  return (
    <div className="py-16 px-4 sm:px-6 max-w-lg mx-auto text-center space-y-6">
      
      <div className="heritage-panel rounded-3xl p-8 space-y-4">
        
        <div className="w-16 h-16 rounded-2xl bg-forest-800 text-ivory-100 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full bg-copper-100 text-copper-800 font-bold text-xs uppercase tracking-widest border border-copper-300">
          Staff Authentication Required
        </span>

        <h2 className="text-2xl font-black text-forest-900 font-editorial">
          Private Staff Quarters
        </h2>

        <p className="text-sm text-charcoal-500 leading-relaxed">
          Access to the <strong className="text-forest-900">{requiredTitle}</strong> requires authorized staff credentials.
        </p>

        {user ? (
          <div className="p-3 rounded-2xl bg-ivory-100 border border-forest-800/10 text-xs text-charcoal-600">
            Currently logged in as: <strong className="text-forest-900 capitalize">{user.role}</strong> ({user.name})
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-ivory-100 border border-forest-800/10 text-xs text-charcoal-600">
            You are currently visiting as a <strong>Salon Guest</strong>.
          </div>
        )}

        <div className="pt-4 space-y-3">
          <button
            onClick={() => openLoginFor(requiredRole)}
            className="w-full btn-copper py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-copper-glow flex items-center justify-center space-x-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In with Staff PIN</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 px-4 rounded-xl text-charcoal-500 hover:text-forest-900 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Home</span>
          </button>
        </div>

      </div>

    </div>
  );
}
