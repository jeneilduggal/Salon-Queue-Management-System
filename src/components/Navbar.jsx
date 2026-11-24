import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { 
  Scissors, 
  Globe, 
  RotateCcw, 
  Tv, 
  UserCheck, 
  LayoutDashboard, 
  Smartphone, 
  Sliders, 
  Menu, 
  X,
  Sparkles,
  Lock,
  LogOut,
  User,
  ShieldCheck,
  Compass
} from 'lucide-react';

export function Navbar({ currentRoute, onNavigate }) {
  const { t, language, setLanguage, queueOpen, resetDemoData, myTicketId } = useQueue();
  const { user, isAuthenticated, logout, openLoginFor } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  const navItems = [
    { id: 'home', label: t.navHome, icon: Sparkles },
    { id: 'services', label: t.navServices || 'Services', icon: Compass },
    { id: 'join', label: t.navJoin, icon: Smartphone },
    { id: 'status', label: t.navMyStatus, icon: UserCheck, badge: myTicketId ? 'Active' : null },
    { id: 'reception', label: t.navReception, icon: LayoutDashboard, roleLocked: true },
    { id: 'barber', label: t.navBarber, icon: Scissors, roleLocked: true },
    { id: 'display', label: t.navTV, icon: Tv },
    { id: 'admin', label: t.navAdmin, icon: Sliders, roleLocked: true },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-forest-900 text-ivory-100 border-b border-forest-800 sticky top-0 z-40 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-copper-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-editorial">
                  StyleNYC
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-forest-800 text-copper-300 border border-copper-500/30 uppercase tracking-widest">
                  StyleNYC
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-sage-300">
                <span className={`w-2 h-2 rounded-full ${queueOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-[11px] sm:text-xs">
                  {queueOpen ? t.openStatus : t.closedStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id || (item.id === 'barber' && currentRoute.startsWith('barber'));
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-copper-500 text-white font-bold shadow-sm' 
                      : 'text-ivory-200 hover:text-white hover:bg-forest-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-forest-950 text-copper-300 font-bold border border-copper-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Staff Auth, Language, Reset */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Staff Status / Sign In */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1.5 bg-forest-800 border border-copper-500/30 rounded-xl px-2.5 py-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-copper-400" />
                <span className="text-[11px] font-bold text-white capitalize truncate max-w-[100px] sm:max-w-none">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  title="Sign out of Staff session"
                  className="p-1 rounded-lg hover:bg-red-500/20 text-ivory-300 hover:text-red-300 transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openLoginFor('receptionist')}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-forest-800 text-copper-300 border border-copper-500/30 hover:bg-copper-500 hover:text-white transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Staff Portal</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title="Switch language between English and Gujarati"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-800 text-ivory-100 border border-forest-700 hover:border-copper-500 transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.langToggle}</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm("Reset queue to fresh demo state?")) {
                  resetDemoData();
                }
              }}
              title={t.demoReset}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs text-sage-300 hover:text-white bg-forest-800 hover:bg-forest-700 border border-forest-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.demoReset}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-ivory-200 hover:text-white hover:bg-forest-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-forest-800 bg-forest-950 px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-2 p-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-copper-500 text-white font-bold' 
                      : 'bg-forest-900 text-ivory-200 hover:bg-forest-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-forest-950 text-copper-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-forest-800 flex justify-between items-center text-xs text-sage-300">
            <span>{queueOpen ? t.openStatus : t.closedStatus}</span>
            <button
              onClick={() => {
                resetDemoData();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1 text-copper-300 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.demoReset}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
