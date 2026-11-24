import React, { useState, useEffect } from 'react';
import { useAuth, ROLE_CREDENTIALS } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  X, 
  Scissors, 
  LayoutDashboard, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export function AuthModal() {
  const { authModalOpen, targetRedirectRole, closeLogin, login } = useAuth();
  const { barbers, language } = useQueue();

  const [selectedRole, setSelectedRole] = useState('receptionist');
  const [selectedBarberId, setSelectedBarberId] = useState('alexandre');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (targetRedirectRole && ['receptionist', 'barber', 'admin'].includes(targetRedirectRole)) {
      setSelectedRole(targetRedirectRole);
    }
    setError('');
    setSuccessMsg('');
    setPin('');
  }, [targetRedirectRole, authModalOpen]);

  if (!authModalOpen) return null;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
    setSuccessMsg('');
    setPin('');
  };

  const handleFillDemo = (role) => {
    setSelectedRole(role);
    setPin(ROLE_CREDENTIALS[role].pin);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(selectedRole, pin, selectedRole === 'barber' ? selectedBarberId : null);
    if (res.success) {
      setSuccessMsg('Authentication verified. Welcome to L\'ÉLITE Concierge.');
      setTimeout(() => {
        closeLogin();
      }, 500);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-forest-800/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeLogin}
          className="absolute top-5 right-5 p-2 rounded-xl text-charcoal-400 hover:text-forest-800 hover:bg-ivory-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-forest-800 text-ivory-100 flex items-center justify-center mx-auto shadow-md mb-3">
            <Lock className="w-7 h-7 stroke-[2]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-copper-600">
            L'ÉLITE Concierge Security
          </span>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight font-editorial mt-1">
            Staff Portal Login
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Role-Based Access for Stylists, Concierge & Management
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-ivory-100 border border-forest-800/10 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('receptionist')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'receptionist'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="truncate w-full text-[11px]">Reception</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('barber')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'barber'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-900'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span className="truncate w-full text-[11px]">Stylist</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-forest-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="truncate w-full text-[11px]">Executive</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Barber Selection */}
          {selectedRole === 'barber' && (
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5 uppercase tracking-wider">
                Select Your Styling Suite:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {barbers.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBarberId(b.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedBarberId === b.id
                        ? 'bg-forest-800 text-white border-forest-900 font-bold'
                        : 'bg-ivory-50 border-forest-800/10 text-charcoal-700 hover:border-copper-500/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{b.avatar}</span>
                      <div className="truncate">
                        <span className="text-xs block font-bold truncate">{b.name}</span>
                        <span className={`text-[10px] block ${selectedBarberId === b.id ? 'text-copper-300' : 'text-charcoal-400'}`}>
                          Suite #{b.chair}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                Security PIN Code
              </label>
              <span className="text-[11px] text-copper-600 font-mono font-bold">
                Default PIN: {ROLE_CREDENTIALS[selectedRole].pin}
              </span>
            </div>
            
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="password"
                required
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-ivory-50 border border-forest-800/15 text-charcoal-900 text-base font-mono tracking-widest focus:outline-none focus:border-copper-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Demo PIN Shortcuts */}
          <div className="p-3.5 rounded-2xl bg-ivory-100 border border-forest-800/10 space-y-1.5">
            <p className="text-[11px] text-charcoal-500 font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-copper-600" />
              <span>One-Click Test Credentials:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo('receptionist')}
                className="px-2.5 py-1 rounded-lg bg-white border border-forest-800/15 text-[11px] text-charcoal-700 hover:text-copper-600 font-medium"
              >
                Reception (1234)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('barber')}
                className="px-2.5 py-1 rounded-lg bg-white border border-forest-800/15 text-[11px] text-charcoal-700 hover:text-copper-600 font-medium"
              >
                Stylist (5678)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="px-2.5 py-1 rounded-lg bg-white border border-forest-800/15 text-[11px] text-charcoal-700 hover:text-copper-600 font-medium"
              >
                Executive (9999)
              </button>
            </div>
          </div>

          {/* Error and Success */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-forest py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify & Access Dashboard</span>
          </button>
        </form>

      </div>
    </div>
  );
}
