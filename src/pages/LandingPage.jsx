import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, TrendingUp, BarChart3, Brain, Layers, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { HeroScene } from '../three/HeroScene';

gsap.registerPlugin(ScrollTrigger);

export const LandingPage = () => {
  const { enterDemoMode } = useAuth();
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      // Hero Elements fade in
      gsap.from('.hero-element', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });

      // Feature Cards staggered fade in
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '#features',
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-dark-bg text-dark-text selection:bg-brand-500 selection:text-white overflow-x-hidden">
      <HeroScene />
      <header className="sticky top-0 z-40 bg-dark-bg/60 backdrop-blur-md border-b border-dark-border/50 px-6 md:px-12 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-glow-brand font-bold text-xl group-hover:scale-105 transition-transform"><Zap className="w-5 h-5 fill-white" /></div>
          <span className="font-extrabold text-xl tracking-tight text-white">TRADELOG</span>
        </NavLink>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-dark-muted">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
          <NavLink to="/pricing" className="hover:text-white transition-colors">Pricing</NavLink>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button onClick={enterDemoMode} variant="secondary" size="sm" icon={Sparkles}>Explore Demo</Button>
          <NavLink to="/login"><Button variant="outline" size="sm">Log In</Button></NavLink>
          <NavLink to="/register" className="hidden sm:inline-block"><Button variant="primary" size="sm">Start Journaling</Button></NavLink>
        </div>
      </header>
      <section className="relative z-10 pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="hero-element inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Trade Less Emotionally. Trade More Intelligently.
        </div>
        <h1 className="hero-element text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-5xl mx-auto mb-6 drop-shadow-2xl">
          Your trades tell a story. <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent inline-block">Start measuring it.</span>
        </h1>
        <p className="hero-element text-lg md:text-xl text-dark-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          TRADELOG turns every trade into actionable performance data—so you can identify what works, eliminate costly emotional mistakes, and scale your trading edge.
        </p>
        <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <NavLink to="/register"><Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto">Start Free Journaling</Button></NavLink>
          <Button onClick={enterDemoMode} variant="secondary" size="lg" icon={Sparkles} className="w-full sm:w-auto">View Live Demo Dashboard</Button>
        </div>
      </section>
      <section id="features" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Built for Serious Retail Traders</h2>
          <p className="text-dark-muted text-lg">Stop relying on messy spreadsheets. TRADELOG gives you clean institutional-grade analytics.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card glass-panel glass-panel-hover p-8 rounded-2xl border border-dark-border space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400"><TrendingUp className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Trade Journal</h3>
            <p className="text-sm text-dark-muted leading-relaxed">Record entry, exit, stop loss, take profit, fees, quantity, and screenshots in seconds with automatic P&L and R-multiple calculations.</p>
          </div>
          <div className="feature-card glass-panel glass-panel-hover p-8 rounded-2xl border border-dark-border space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400"><BarChart3 className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
            <p className="text-sm text-dark-muted leading-relaxed">Track win rate, profit factor, expectancy, max drawdown, long vs short distribution, and cumulative equity curve dynamically.</p>
          </div>
          <div className="feature-card glass-panel glass-panel-hover p-8 rounded-2xl border border-dark-border space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400"><Brain className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Trading Psychology</h3>
            <p className="text-sm text-dark-muted leading-relaxed">Tag emotions (FOMO, Calm, Fearful, Angry) and common mistakes to discover how psychological state impacts your win rate.</p>
          </div>
          <div className="feature-card glass-panel glass-panel-hover p-8 rounded-2xl border border-dark-border space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400"><Layers className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Setup Analysis</h3>
            <p className="text-sm text-dark-muted leading-relaxed">Group trades by strategy setup (Breakout, Pullback, Reversal) to double down on your most profitable setups.</p>
          </div>
          <div className="feature-card glass-panel glass-panel-hover p-8 rounded-2xl border border-dark-border space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400"><ShieldCheck className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Risk Management</h3>
            <p className="text-sm text-dark-muted leading-relaxed">Calculate risk/reward ratio, stop loss exposure, and portfolio drawdown live while entering orders.</p>
          </div>
          <div className="feature-card glass-panel glass-panel-hover p-8 rounded-2xl border border-dark-border space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400"><Sparkles className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Visual Screenshot Storage</h3>
            <p className="text-sm text-dark-muted leading-relaxed">Attach before-entry, during-trade, and after-exit chart screenshots to review execution perfection.</p>
          </div>
        </div>
      </section>
      <footer className="border-t border-dark-border py-12 px-6 md:px-12 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-dark-muted">
        <div><span className="font-bold text-white text-sm">TRADELOG</span><p className="mt-1">"Trade less emotionally. Trade more intelligently."</p></div>
        <p>© 2026 TRADELOG SaaS Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
