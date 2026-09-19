import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, LogOut, Settings, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Header = () => {
  const { user, logout, isDemo } = useAuth();
  const { theme, toggleTheme, currency, setCurrency } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/trades?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
        <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search symbol, setup, notes... (Press '/' to focus)"
          className="w-full bg-dark-card border border-dark-border hover:border-dark-borderLight text-dark-text placeholder-dark-muted text-xs md:text-sm pl-10 pr-9 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all" />
        <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-dark-muted bg-dark-border/60 px-1.5 py-0.5 rounded border border-dark-border">/</kbd>
      </form>
      <div className="flex items-center gap-2 md:gap-3">
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}
          className="bg-dark-card border border-dark-border text-dark-text text-xs font-mono px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer">
          <option value="INR">INR ₹</option>
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="GBP">GBP £</option>
        </select>
        <button onClick={toggleTheme} className="p-2 text-dark-muted hover:text-dark-text rounded-lg hover:bg-dark-cardHover transition-colors" title="Toggle Light/Dark Theme">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-dark-muted hover:text-dark-text rounded-lg hover:bg-dark-cardHover transition-colors relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl border border-dark-border shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-dark-border mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark-muted">Notifications</h4>
                <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">2 New</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-dark-card/60 border border-dark-border">
                  <p className="font-semibold text-dark-text">Goal Progress Alert 🎯</p>
                  <p className="text-dark-muted mt-0.5">You reached 24/30 planned trades for September.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-card/60 border border-dark-border">
                  <p className="font-semibold text-dark-text">Journal Reminder 📝</p>
                  <p className="text-dark-muted mt-0.5">Don't forget to review your RELIANCE trade screenshots.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1 rounded-xl hover:bg-dark-cardHover transition-colors">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-brand-500/40" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="hidden md:inline-block text-xs font-semibold text-dark-text">{user?.name}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 glass-panel rounded-xl border border-dark-border shadow-2xl p-2 z-50 animate-fade-in text-xs">
              <div className="p-2.5 border-b border-dark-border mb-1">
                <p className="font-bold text-dark-text">{user?.name}</p>
                <p className="text-[11px] text-dark-muted truncate">{user?.email}</p>
                {isDemo && <span className="inline-block mt-1 text-[10px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">DEMO MODE ACTIVE</span>}
              </div>
              <button onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-cardHover transition-colors">
                <Settings className="w-3.5 h-3.5" /> Settings & Profile
              </button>
              <button onClick={() => { setShowUserMenu(false); navigate('/pricing'); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-cardHover transition-colors">
                <CreditCard className="w-3.5 h-3.5" /> Pricing & Billing
              </button>
              <div className="border-t border-dark-border my-1" />
              <button onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
