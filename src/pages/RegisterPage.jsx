import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register, enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all required fields.'); return; }
    setIsLoading(true); setError('');
    try { await register(name, email, password, currency); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Registration failed. Try again.'); }
    finally { setIsLoading(false); }
  };

  const features = ['Unlimited trade journaling', 'Real-time P&L analytics', 'Psychology tracking', 'Setup performance analysis', 'CSV export'];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex selection:bg-brand-500 selection:text-white">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg border-r border-dark-border p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-indigo-900/10 pointer-events-none" />
        <NavLink to="/" className="font-extrabold text-2xl tracking-tight text-white z-10">TRADELOG</NavLink>
        <div className="z-10 space-y-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-400 mb-4">Free Forever. Start Now.</p>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Trade with<br />evidence,<br />not memory.
            </h2>
            <p className="text-dark-muted text-base leading-relaxed max-w-sm mb-6">
              Join traders who track their edge with TRADELOG's institutional-grade analytics.
            </p>
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm text-dark-text">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-dark-muted z-10">© 2026 TRADELOG</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="space-y-2">
            <NavLink to="/" className="lg:hidden font-extrabold text-xl tracking-tight text-white">TRADELOG</NavLink>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h1>
            <p className="text-sm text-dark-muted">Start tracking performance and building better trading discipline.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-dark-border shadow-2xl space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /> <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" type="text" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email Address" type="email" placeholder="alex.trader@tradelog.io" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Select label="Primary Account Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}
                options={[{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }, { label: 'GBP (£)', value: 'GBP' }]} />
              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} icon={UserPlus} className="w-full">Create Account</Button>
            </form>
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-dark-border w-full" />
              <span className="bg-dark-card px-3 text-[10px] font-mono uppercase text-dark-muted absolute">or try demo mode</span>
            </div>
            <Button type="button" onClick={async () => { await enterDemoMode(); navigate('/dashboard'); }}
              variant="secondary" size="lg" icon={Sparkles} className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
              Explore 1-Click Demo Mode
            </Button>
          </div>
          <p className="text-center text-xs text-dark-muted">
            Already have an account?{' '}
            <NavLink to="/login" className="text-brand-400 hover:underline font-semibold">Log In</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
