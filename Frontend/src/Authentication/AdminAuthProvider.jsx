import { useCallback, useEffect, useState } from 'react';
import { AdminAuthContext } from './adminAuthContext';
import {
  ADMIN_SESSION_EXPIRED_EVENT,
  clearAdminSession,
  readAdminSession,
  saveAdminSession,
} from '../lib/adminSession';

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readAdminSession);

  const logout = useCallback(() => {
    clearAdminSession();
    setSession(null);
  }, []);

  const login = useCallback((data) => {
    if (typeof data?.token !== 'string' || !data.token || data.user?.role !== 'admin') {
      throw new Error('Esta área está disponível somente para administradores.');
    }

    const adminSession = { token: data.token, user: data.user };
    saveAdminSession(adminSession);
    setSession(adminSession);
  }, []);

  useEffect(() => {
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

  return (
    <AdminAuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
