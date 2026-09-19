import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { WinLossDistributionChart } from '../components/charts/WinLossDistributionChart';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { calculateDashboardMetrics, calculateEquityCurve } from '../utils/calculations';
import { DEMO_TRADES } from '../utils/mockData';

export const AnalyticsPage = () => {
  const { isDemo } = useAuth();
  const { currency } = useTheme();
  const [metrics, setMetrics] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);
  const [dayOfWeekData, setDayOfWeekData] = useState([]);
  const [directionData, setDirectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFullAnalytics() {
      setIsLoading(true);
      try {
        const res = await api.get('/analytics/full');
        setMetrics(res.data.metrics);
        setEquityCurve(res.data.equityCurve);
        setDayOfWeekData(res.data.dayOfWeekAnalytics);
        setDirectionData(res.data.directionAnalytics);
      } catch (err) {
        const demoTrades = isDemo ? DEMO_TRADES : [];
        setMetrics(calculateDashboardMetrics(demoTrades));
        setEquityCurve(calculateEquityCurve(demoTrades));
        setDayOfWeekData([
          { day: 'Mon', pnl: 12400, count: 6 }, { day: 'Tue', pnl: 18200, count: 8 },
          { day: 'Wed', pnl: -4200, count: 5 }, { day: 'Thu', pnl: 22100, count: 9 },
          { day: 'Fri', pnl: -3600, count: 4 },
        ]);
        setDirectionData({ long: { count: 18, winRate: 72, totalPnl: 34100, avgR: 1.8 }, short: { count: 15, winRate: 60, totalPnl: 10780, avgR: 1.2 } });
      } finally { setIsLoading(false); }
    }
    fetchFullAnalytics();
  }, [isDemo]);

  if (isLoading) {
    return <div className="p-8 space-y-6 max-w-7xl mx-auto"><Skeleton height="h-10" width="w-64" /><div className="grid grid-cols-4 gap-4"><Skeleton height="h-28" /><Skeleton height="h-28" /><Skeleton height="h-28" /><Skeleton height="h-28" /></div></div>;
  }

  const winningTradesCount = Math.round(((metrics?.winRate || 0) / 100) * (metrics?.closedTradesCount || 0));
  const losingTradesCount = (metrics?.closedTradesCount || 0) - winningTradesCount;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs text-dark-muted mt-0.5">Comprehensive statistical breakdown of your trading edge.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Expectancy', value: formatCurrency(metrics?.expectancy || 0, currency), sub: 'Expected net P&L per trade', color: 'text-emerald-400' },
          { label: 'Average Win', value: formatCurrency(metrics?.avgWin || 0, currency, false), sub: 'Winning trade average', color: 'text-emerald-400' },
          { label: 'Average Loss', value: formatCurrency(metrics?.avgLoss || 0, currency, false), sub: 'Losing trade average', color: 'text-rose-400' },
          { label: 'Max Winning Streak', value: `${metrics?.winningStreak || 0} Wins`, sub: 'Consecutive winning trades', color: 'text-brand-300' },
        ].map(({ label, value, sub, color }) => (
          <Card key={label} className="p-4">
            <span className="text-[10px] text-dark-muted uppercase tracking-wider block font-semibold">{label}</span>
            <span className={`text-2xl font-extrabold ${color} block mt-1`}>{value}</span>
            <span className="text-[10px] text-dark-muted">{sub}</span>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Cumulative Portfolio Growth" subtitle="Realized equity curve" className="lg:col-span-2">
          <EquityCurveChart data={equityCurve} />
        </Card>
        <Card title="Win / Loss Ratio" subtitle="Trade outcome distribution">
          <WinLossDistributionChart winningTrades={winningTradesCount} losingTrades={losingTradesCount} />
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Day-of-Week Performance" subtitle="Net P&L grouped by trading day">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2633" vertical={false} />
                <XAxis dataKey="day" stroke="#8B98A5" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#8B98A5" fontSize={11} tickFormatter={(val) => formatCurrency(val, currency, false)} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return <div className="glass-panel p-2.5 rounded-lg border border-dark-border text-xs"><p className="font-bold text-dark-text">{d.day}</p><p className="text-dark-muted">Net P&L: <span className={d.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatCurrency(d.pnl, currency)}</span></p></div>;
                  }
                  return null;
                }} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {dayOfWeekData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10B981' : '#EF4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Long vs Short Execution" subtitle="Directional bias performance comparison">
          <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-emerald-400 block text-sm">LONG Trades ▲</span>
              <div className="flex justify-between text-dark-muted"><span>Trades:</span> <strong className="text-white">{directionData?.long?.count || 0}</strong></div>
              <div className="flex justify-between text-dark-muted"><span>Win Rate:</span> <strong className="text-emerald-400">{directionData?.long?.winRate || 0}%</strong></div>
              <div className="flex justify-between text-dark-muted"><span>Net P&L:</span> <strong className="text-emerald-400">{formatCurrency(directionData?.long?.totalPnl || 0, currency)}</strong></div>
            </div>
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <span className="font-bold text-rose-400 block text-sm">SHORT Trades ▼</span>
              <div className="flex justify-between text-dark-muted"><span>Trades:</span> <strong className="text-white">{directionData?.short?.count || 0}</strong></div>
              <div className="flex justify-between text-dark-muted"><span>Win Rate:</span> <strong className="text-rose-400">{directionData?.short?.winRate || 0}%</strong></div>
              <div className="flex justify-between text-dark-muted"><span>Net P&L:</span> <strong className="text-rose-400">{formatCurrency(directionData?.short?.totalPnl || 0, currency)}</strong></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
