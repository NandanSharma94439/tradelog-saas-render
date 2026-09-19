import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PlusCircle, BarChart3, Menu, X, Calendar, Layers, Brain, Target, Settings } from 'lucide-react';

export const MobileNav = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur-md border-t border-dark-border px-3 py-2 flex items-center justify-around">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-brand-400 font-bold' : 'text-dark-muted hover:text-dark-text'}`}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </NavLink>
        <NavLink to="/trades" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-brand-400 font-bold' : 'text-dark-muted hover:text-dark-text'}`}>
          <TrendingUp className="w-5 h-5" /> Trades
        </NavLink>
        <NavLink to="/trades/new" className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-brand-600 text-white shadow-glow-brand -mt-4 border border-brand-400/40">
          <PlusCircle className="w-6 h-6" />
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-brand-400 font-bold' : 'text-dark-muted hover:text-dark-text'}`}>
          <BarChart3 className="w-5 h-5" /> Analytics
        </NavLink>
        <button onClick={() => setShowDrawer(true)} className="flex flex-col items-center gap-1 text-[10px] font-medium text-dark-muted hover:text-dark-text">
          <Menu className="w-5 h-5" /> Menu
        </button>
      </nav>
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs h-full bg-dark-bg border-l border-dark-border p-6 flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
                <h3 className="font-extrabold text-white text-lg tracking-tight">TRADELOG</h3>
                <button onClick={() => setShowDrawer(false)} className="p-1 text-dark-muted hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { to: '/calendar', icon: Calendar, label: 'Calendar View' },
                  { to: '/setups', icon: Layers, label: 'Setup Analysis' },
                  { to: '/psychology', icon: Brain, label: 'Psychology Tracking' },
                  { to: '/goals', icon: Target, label: 'Trading Goals' },
                  { to: '/settings', icon: Settings, label: 'Profile & Settings' },
                ].map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setShowDrawer(false)} className="flex items-center gap-3 p-2.5 rounded-lg text-dark-muted hover:bg-dark-cardHover hover:text-white">
                    <Icon className="w-4 h-4" /> {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
