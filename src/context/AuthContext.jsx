import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'salon_queue_auth_user_v1';

// Preset PIN credentials for RBAC
export const ROLE_CREDENTIALS = {
  receptionist: {
    pin: '1234',
    title: 'Front Desk Receptionist',
    defaultName: 'Priya (Receptionist)'
  },
  barber: {
    pin: '5678',
    title: 'Barber / Hair Stylist',
    defaultName: 'Barber Staff'
  },
  admin: {
    pin: '9999',
    title: 'Salon Owner / Administrator',
    defaultName: 'Salon Owner'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetRedirectRole, setTargetRedirectRole] = useState(null);

  const login = useCallback((role, pin, barberId = null, customName = null) => {
    const cred = ROLE_CREDENTIALS[role];
    if (!cred) {
      return { success: false, error: 'Invalid role specified.' };
    }

    if (pin !== cred.pin) {
      return { success: false, error: 'Incorrect PIN. Please try again.' };
    }

    const userData = {
      role, // 'receptionist' | 'barber' | 'admin'
      name: customName || (barberId ? `Barber ${barberId.toUpperCase()}` : cred.defaultName),
      barberId: barberId || null,
      loginTime: Date.now()
    };

    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setAuthModalOpen(false);

    return { success: true, user: userData };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  // Check role hierarchy: admin has access to everything, receptionist has access to reception, barber to barber
  const hasAccess = useCallback((requiredRole) => {
    if (!requiredRole || requiredRole === 'customer') return true;
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has superuser access
    return user.role === requiredRole;
  }, [user]);

  const openLoginFor = useCallback((role = null) => {
    setTargetRedirectRole(role);
    setAuthModalOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setAuthModalOpen(false);
    setTargetRedirectRole(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    role: user?.role || 'customer',
    hasAccess,
    login,
    logout,
    authModalOpen,
    targetRedirectRole,
    openLoginFor,
    closeLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
