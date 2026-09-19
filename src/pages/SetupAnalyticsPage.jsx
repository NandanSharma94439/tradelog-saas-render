import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { SetupPerformanceChart } from '../components/charts/SetupPerformanceChart';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { calculateSetupAnalytics } from '../utils/calculations';
import { DEMO_TRADES } from '../utils/mockData';

export const SetupAnalyticsPage = () => {
  const { isDemo } = useAuth();
  const { currency } = useTheme();
  const navigate = useNavigate();
  const [setupData, setSetupData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSetups() {
      setIsLoading(true);
      try {
        const res = await api.get('/analytics/dashboard');
        setSetupData(res.data.setupAnalytics);
      } catch (err) {
        setSetupData(calculateSetupAnalytics(isDemo ? DEMO_TRADES : []));
      } finally { setIsLoading(false); }
    }
    fetchSetups();
  }, [isDemo]);

  if (isLoading) {
    return <div className="p-8 space-y-6 max-w-7xl mx-auto"><Skeleton height="h-10" width="w-64" /><Skeleton height="h-64" /></div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-400" /> Setup Strategy Analytics
        </h1>
        <p className="text-xs text-dark-muted mt-0.5">Discover which trading setups yield your highest win rate and expectancy.</p>
      </div>
      <Card title="Setup Net P&L Comparison" subtitle="Total returns grouped by trading strategy">
        <SetupPerformanceChart data={setupData} />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setupData.map((s) => (
          <Card key={s.setupName} hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">{s.setupName}</h3>
              <Badge variant="brand">{s.tradesCount} Trades</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border"><span className="text-dark-muted block text-[10px]">Win Rate</span><span className="text-brand-400 font-bold text-base">{s.winRate}%</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border"><span className="text-dark-muted block text-[10px]">Average R</span><span className="text-white font-bold text-base">{s.avgR}R</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border"><span className="text-dark-muted block text-[10px]">Total Net P&L</span><span className={`font-bold text-base ${s.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(s.totalPnl, currency)}</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border"><span className="text-dark-muted block text-[10px]">Profit Factor</span><span className="text-amber-300 font-bold text-base">{s.profitFactor}</span></div>
            </div>
            <button onClick={() => navigate(`/trades?setup=${encodeURIComponent(s.setupName)}`)} className="w-full flex items-center justify-between text-xs font-semibold text-brand-400 hover:text-white pt-2 border-t border-dark-border transition-colors">
              <span>View all {s.setupName} trades</span><ArrowRight className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
