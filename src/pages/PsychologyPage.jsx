import React, { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { EmotionPerformanceChart } from '../components/charts/EmotionPerformanceChart';
import { formatCurrency, getEmotionBadgeStyle } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const PsychologyPage = () => {
  const { isDemo } = useAuth();
  const { currency } = useTheme();
  const [emotionData, setEmotionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPsychology() {
      setIsLoading(true);
      try {
        const res = await api.get('/analytics/full');
        setEmotionData(res.data.emotionAnalytics);
      } catch (err) {
        setEmotionData([
          { emotion: 'Calm', tradesCount: 22, winRate: 72.7, avgPnl: 1450, totalPnl: 31900 },
          { emotion: 'Confident', tradesCount: 14, winRate: 64.2, avgPnl: 1200, totalPnl: 16800 },
          { emotion: 'FOMO', tradesCount: 9, winRate: 33.3, avgPnl: -850, totalPnl: -7650 },
          { emotion: 'Fearful', tradesCount: 6, winRate: 33.3, avgPnl: -600, totalPnl: -3600 },
          { emotion: 'Angry', tradesCount: 4, winRate: 25.0, avgPnl: -1200, totalPnl: -4800 },
        ]);
      } finally { setIsLoading(false); }
    }
    fetchPsychology();
  }, [isDemo]);

  if (isLoading) {
    return <div className="p-8 space-y-6 max-w-7xl mx-auto"><Skeleton height="h-10" width="w-64" /><Skeleton height="h-64" /></div>;
  }

  const fomoEntry = emotionData.find((e) => e.emotion === 'FOMO');
  const calmEntry = emotionData.find((e) => e.emotion === 'Calm');

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" /> Trading Psychology & Emotion Analytics
        </h1>
        <p className="text-xs text-dark-muted mt-0.5">Track how emotional state correlates with execution quality and net returns.</p>
      </div>
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-purple-200 text-xs leading-relaxed space-y-2 shadow-2xl">
        <div className="flex items-center gap-2 font-bold text-sm text-purple-300">
          <Sparkles className="w-4 h-4 text-amber-400" /> Descriptive Emotion Insights
        </div>
        <p>Trades tagged with <strong className="text-rose-400 font-mono">FOMO</strong> had a lower historical win rate ({fomoEntry?.winRate || 33}%) in your journal compared to trades entered when feeling <strong className="text-emerald-400 font-mono">Calm</strong> ({calmEntry?.winRate || 72}% win rate).</p>
      </div>
      <Card title="Emotion vs Net P&L Distribution" subtitle="Net returns grouped by emotional state before trade entry">
        <EmotionPerformanceChart data={emotionData} />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {emotionData.map((e) => {
          const badgeStyle = getEmotionBadgeStyle(e.emotion);
          return (
            <Card key={e.emotion} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>{e.emotion}</span>
                <span className="text-xs font-mono text-dark-muted">{e.tradesCount} Trades</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
                  <span className="text-dark-muted block text-[10px]">Win Rate</span>
                  <span className="text-brand-300 font-bold text-base">{e.winRate}%</span>
                </div>
                <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
                  <span className="text-dark-muted block text-[10px]">Total Net P&L</span>
                  <span className={`font-bold text-base ${e.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(e.totalPnl, currency)}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
