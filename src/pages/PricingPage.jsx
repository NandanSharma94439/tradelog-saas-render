import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, Sparkles, Zap, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const PricingPage = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'FREE', priceMonthly: '₹0', priceAnnual: '₹0', period: 'forever',
      description: 'Ideal for beginner traders starting their trade journal journey.',
      features: ['Up to 30 trades / month', 'Basic performance dashboard', 'Basic win rate & P&L calculations', 'Attach 1 screenshot per trade', 'Monthly Calendar view'],
      cta: user ? 'Current Plan' : 'Start Free', variant: 'outline',
      isCurrent: user?.subscriptionPlan === 'FREE' || !user?.subscriptionPlan,
    },
    {
      name: 'PRO', priceMonthly: '₹299', priceAnnual: '₹2,499',
      period: billingCycle === 'monthly' ? '/ month' : '/ year (₹208/mo equivalent)',
      badge: 'MOST POPULAR',
      description: 'For serious traders who want complete analytics, strategy & emotion tracking.',
      features: ['Unlimited trade logs & screenshots', 'Advanced performance analytics & equity curve', 'Strategy Setup performance breakdown', 'Trading Psychology & mistake tracking', 'Unlimited Trading Goals', 'Export trade logs to CSV', 'AI Trade Review placeholder access', 'Priority feature requests'],
      cta: user?.subscriptionPlan === 'PRO' ? 'Active Membership' : 'Upgrade to PRO',
      variant: 'primary', highlight: true, isCurrent: user?.subscriptionPlan === 'PRO',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text p-6 md:p-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <NavLink to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-dark-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </NavLink>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-400" />
          <span className="font-extrabold text-white text-lg tracking-tight">TRADELOG</span>
        </div>
      </div>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Invest in Your Trading Discipline</h1>
        <p className="text-dark-muted text-base">Choose the plan that fits your trading goals. Upgrade or cancel anytime.</p>
        <div className="inline-flex items-center gap-3 p-1.5 rounded-xl bg-dark-card border border-dark-border mt-8">
          <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-brand-600 text-white shadow-glow-brand' : 'text-dark-muted hover:text-white'}`}>Monthly Billing</button>
          <button onClick={() => setBillingCycle('annual')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-brand-600 text-white shadow-glow-brand' : 'text-dark-muted hover:text-white'}`}>
            Annual Billing <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">Save 30%</span>
          </button>
        </div>
      </div>
      <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-mono">
        ⚙️ Payments provider key not configured yet. Pro tier features are active in Demo mode.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`glass-panel p-8 rounded-2xl border relative flex flex-col justify-between ${plan.highlight ? 'border-brand-500/50 shadow-glow-brand bg-gradient-to-b from-brand-950/20 to-dark-card' : 'border-dark-border'}`}>
            {plan.badge && <span className="absolute -top-3.5 right-6 text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-brand-600 text-white border border-brand-400 shadow-glow-brand">{plan.badge}</span>}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-xs text-dark-muted mb-6 leading-relaxed">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white font-mono">{billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual}</span>
                <span className="text-xs text-dark-muted font-mono">{plan.period}</span>
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-3 text-xs text-dark-text">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /><span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button variant={plan.variant} size="lg" disabled={plan.isCurrent} onClick={() => alert('Payment Gateway: Payment providers (Stripe/Razorpay) are ready to connect via environment variables.')} className="w-full">{plan.cta}</Button>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center text-xs text-dark-muted flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-emerald-400" /> Cancel or downgrade anytime. No lock-in contracts.
      </div>
    </div>
  );
};
