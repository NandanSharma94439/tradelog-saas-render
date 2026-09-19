import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { DEMO_USER } from '../utils/mockData';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tradelog_token'));
  const [isDemo, setIsDemo] = useState(localStorage.getItem('tradelog_is_demo') === 'true');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem('tradelog_token');
      const storedIsDemo = localStorage.getItem('tradelog_is_demo') === 'true';
      if (!storedToken) { setIsLoading(false); return; }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setIsDemo(storedIsDemo);
      } catch (err) {
        if (storedIsDemo) {
          setUser(DEMO_USER);
          setIsDemo(true);
        } else {
          localStorage.removeItem('tradelog_token');
          setToken(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, pass) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('tradelog_token', newToken);
      localStorage.removeItem('tradelog_is_demo');
      setToken(newToken); setUser(userData); setIsDemo(false);
    } finally { setIsLoading(false); }
  };

  const register = async (name, email, pass, currency = 'INR') => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password: pass, currency });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('tradelog_token', newToken);
      localStorage.removeItem('tradelog_is_demo');
      setToken(newToken); setUser(userData); setIsDemo(false);
    } finally { setIsLoading(false); }
  };

  const enterDemoMode = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/demo');
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('tradelog_token', newToken);
      localStorage.setItem('tradelog_is_demo', 'true');
      setToken(newToken); setUser(userData); setIsDemo(true);
    } catch (err) {
      console.warn('Backend demo auth failed, initializing offline demo mode:', err);
      setUser(DEMO_USER);
      setToken('demo-mock-jwt-token-2026');
      setIsDemo(true);
      localStorage.setItem('tradelog_token', 'demo-mock-jwt-token-2026');
      localStorage.setItem('tradelog_is_demo', 'true');
    } finally { setIsLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('tradelog_token');
    localStorage.removeItem('tradelog_is_demo');
    setToken(null); setUser(null); setIsDemo(false);
  };

  const updateUser = async (updatedData) => {
    try {
      const res = await api.put('/profile', updatedData);
      setUser(res.data.user);
    } catch {
      if (user) setUser({ ...user, ...updatedData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isDemo, isLoading, login, register, enterDemoMode, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
