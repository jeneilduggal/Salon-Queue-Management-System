import React, { useState, useEffect } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { ServiceCatalog } from './pages/ServiceCatalog';
import { JoinQueue } from './pages/JoinQueue';
import { MyStatus } from './pages/MyStatus';
import { ReceptionDashboard } from './pages/ReceptionDashboard';
import { BarberView } from './pages/BarberView';
import { WaitingDisplay } from './pages/WaitingDisplay';
import { AdminSettings } from './pages/AdminSettings';
import { Tv, ArrowLeft } from 'lucide-react';

function MainApp() {
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) return hash;
    const path = window.location.pathname.replace(/^\//, '');
    return path || 'home';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const { myTicketId } = useQueue();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (route) => {
    let targetRoute = route;
    if (route === 'status' && myTicketId) {
      targetRoute = `status/${myTicketId}`;
    } else if (route === 'status' && !myTicketId) {
      targetRoute = 'status/Q-103';
    }

    window.location.hash = `#/${targetRoute}`;
    setCurrentRoute(targetRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    if (currentRoute === 'home' || currentRoute === '') {
      return <Home onNavigate={navigate} />;
    }
    if (currentRoute === 'services') {
      return <ServiceCatalog onNavigate={navigate} />;
    }
    if (currentRoute === 'join') {
      return <JoinQueue onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('status')) {
      const parts = currentRoute.split('/');
      const ticketId = parts[1] || myTicketId || 'Q-103';
      return <MyStatus ticketId={ticketId} onNavigate={navigate} />;
    }
    
    // Protected Staff Routes
    if (currentRoute === 'reception') {
      return (
        <ProtectedRoute requiredRole="receptionist" onNavigate={navigate}>
          <ReceptionDashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }
    if (currentRoute.startsWith('barber')) {
      const parts = currentRoute.split('/');
      const barberName = parts[1] || 'alexandre';
      return (
        <ProtectedRoute requiredRole="barber" onNavigate={navigate}>
          <BarberView barberName={barberName} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }
    if (currentRoute === 'display') {
      return (
        <div className="relative">
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => navigate('home')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-forest-900 border border-forest-800 text-ivory-100 text-xs font-bold shadow-xl transition-all hover:bg-copper-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit TV View</span>
            </button>
          </div>
          <WaitingDisplay />
        </div>
      );
    }
    if (currentRoute === 'admin') {
      return (
        <ProtectedRoute requiredRole="admin" onNavigate={navigate}>
          <AdminSettings onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    return <Home onNavigate={navigate} />;
  };

  const isTVView = currentRoute === 'display';

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-800 flex flex-col font-sans relative selection:bg-copper-500 selection:text-white">
      {/* Global Staff Authentication Modal */}
      <AuthModal />

      {!isTVView && (
        <Navbar currentRoute={currentRoute} onNavigate={navigate} />
      )}

      <main className="flex-1 relative z-10">
        {renderScreen()}
      </main>

      {/* Elegant Editorial Footer */}
      {!isTVView && (
        <footer className="bg-forest-950 text-ivory-200 border-t border-forest-800 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-center text-xs space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-editorial text-lg text-white font-bold">StyleNYC</span>
            <span className="text-copper-400 font-bold uppercase tracking-widest text-[10px]">· Haute Coiffure</span>
          </div>
          <p className="text-sage-300 max-w-md mx-auto">
            Promenade Arcade, Level 2 · Exceptional Hair Design, Botanical Treatments & Classical Hot Towel Rituals.
          </p>
          <p className="text-charcoal-400 text-[11px] pt-2">
            © {new Date().getFullYear()} StyleNYC. All rights reserved. Persistent Real-Time Queue Synchronization.
          </p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <MainApp />
      </QueueProvider>
    </AuthProvider>
  );
}
