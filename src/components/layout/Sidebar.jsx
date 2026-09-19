import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PlusCircle, BarChart3, Calendar, Layers, Brain, Target, Settings, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Trades', icon: TrendingUp, path: '/trades' },
  { label: 'Add Trade', icon: PlusCircle, path: '/trades/new', highlight: true },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Setups', icon: Layers, path: '/setups' },
  { label: 'Psychology', icon: Brain, path: '/psychology' },
  { label: 'Goals', icon: Target, path: '/goals' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
  const { user, isDemo } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-dark-bg border-r border-dark-border h-screen sticky top-0 z-30 select-none">
      <div className="p-6 border-b border-dark-border flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-glow-brand font-bold text-xl group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              TRADELOG
              {isDemo && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">DEMO</span>}
            </h1>
            <p className="text-[10px] text-dark-muted font-mono tracking-wider uppercase">Analytics SaaS</p>
          </div>
        </NavLink>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.highlight ? 'bg-brand-600/90 text-white shadow-glow-brand hover:bg-brand-500 my-2'
                : isActive ? 'bg-dark-cardHover text-brand-400 border border-brand-500/30 font-semibold'
                : 'text-dark-muted hover:text-dark-text hover:bg-dark-cardHover/50'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-dark-card border border-brand-500/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-300 mb-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {user?.subscriptionPlan === 'PRO' ? 'PRO Plan Active' : 'Upgrade to PRO'}
        </div>
        <p className="text-[11px] text-dark-muted mb-3 leading-relaxed">
          {user?.subscriptionPlan === 'PRO' ? 'Unlimited trades, setup analysis & export features.' : 'Unlock unlimited trades, psychology analytics & goals.'}
        </p>
        <NavLink to="/pricing" className="inline-block w-full text-center text-xs font-semibold py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-colors">
          {user?.subscriptionPlan === 'PRO' ? 'View Membership' : 'Upgrade — ₹299/mo'}
        </NavLink>
      </div>
    </aside>
  );
};
