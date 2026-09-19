import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, AlertCircle, TrendingUp, BarChart3, Brain } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setIsLoading(true); setError('');
    try { await login(email, password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Invalid credentials or server unavailable.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex selection:bg-brand-500 selection:text-white">
      {/* Left panel — brand statement */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg border-r border-dark-border p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-indigo-900/10 pointer-events-none" />
        <NavLink to="/" className="font-extrabold text-2xl tracking-tight text-white z-10">TRADELOG</NavLink>
        <div className="z-10 space-y-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-400 mb-4">Trading Intelligence</p>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Your trades tell<br />a story.
            </h2>
            <p className="text-dark-muted text-base leading-relaxed max-w-sm">
              TRADELOG transforms every entry and exit into measurable performance data — so you can build a genuine edge.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, label: 'Journal', desc: 'Track every trade' },
              { icon: BarChart3, label: 'Analytics', desc: 'See your edge' },
              { icon: Brain, label: 'Psychology', desc: 'Manage emotions' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border">
                <Icon className="w-5 h-5 text-brand-400 mb-2" />
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[11px] text-dark-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-dark-muted z-10">© 2026 TRADELOG</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="space-y-2">
            <NavLink to="/" className="lg:hidden font-extrabold text-xl tracking-tight text-white">TRADELOG</NavLink>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-dark-muted">Enter your credentials to access your journal.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-dark-border shadow-2xl space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /> <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email Address" type="email" placeholder="alex.trader@tradelog.io" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} icon={LogIn} className="w-full">Log In</Button>
            </form>
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-dark-border w-full" />
              <span className="bg-dark-card px-3 text-[10px] font-mono uppercase text-dark-muted absolute">or instant access</span>
            </div>
            <Button type="button" onClick={async () => { await enterDemoMode(); navigate('/dashboard'); }}
              variant="secondary" size="lg" icon={Sparkles} className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
              Explore 1-Click Demo Mode
            </Button>
          </div>
          <p className="text-center text-xs text-dark-muted">
            Don't have an account?{' '}
            <NavLink to="/register" className="text-brand-400 hover:underline font-semibold">Create Account</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
