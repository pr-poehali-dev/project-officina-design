import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminCtx {
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const Ctx = createContext<AdminCtx>({ isAdmin: false, login: () => {}, logout: () => {} });

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem('paterno_admin_token'));

  const login = (token: string) => {
    localStorage.setItem('paterno_admin_token', token);
    setIsAdmin(true);
  };
  const logout = () => {
    localStorage.removeItem('paterno_admin_token');
    setIsAdmin(false);
  };

  useEffect(() => {
    const onStorage = () => setIsAdmin(!!localStorage.getItem('paterno_admin_token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return <Ctx.Provider value={{ isAdmin, login, logout }}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);
