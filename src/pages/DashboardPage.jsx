import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Percent, Scale, Award, ShieldAlert, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { DailyPnLChart } from '../components/charts/DailyPnLChart';
import { formatCurrency, formatR, formatDate } from '../utils/formatters';
import { api } from '../services/api';
import { calculateDashboardMetrics, calculateEquityCurve } from '../utils/calculations';
import { DEMO_TRADES } from '../utils/mockData';

export const DashboardPage = () => {
  const { user, isDemo } = useAuth();
  const { currency } = useTheme();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);
  const [dailyPnL, setDailyPnL] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    async function fetchDashboard() {
      setIsLoading(true);
      try {
        const res = await api.get('/analytics/dashboard');
        setMetrics(res.data.metrics);
        setEquityCurve(res.data.equityCurve);
        setDailyPnL(res.data.dailyPnL);
        setRecentTrades(res.data.recentTrades);
      } catch (err) {
        console.warn('Backend unavailable, rendering local calculation context:', err);
        const demoTrades = isDemo ? DEMO_TRADES : [];
        const m = calculateDashboardMetrics(demoTrades);
        const eq = calculateEquityCurve(demoTrades);
        setMetrics(m);
        setEquityCurve(eq);
        setRecentTrades(demoTrades.slice(0, 7));
        const dailyMap = {};
        for (const t of demoTrades.filter((t) => t.status === 'Closed')) {
          if (!dailyMap[t.tradeDate]) dailyMap[t.tradeDate] = { date: t.tradeDate, pnl: 0, count: 0 };
          dailyMap[t.tradeDate].pnl += t.pnl;
          dailyMap[t.tradeDate].count += 1;
        }
        setDailyPnL(Object.values(dailyMap));
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, [isDemo]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton height="h-10" width="w-64" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height="h-28" />)}
        </div>
        <Skeleton height="h-80" />
      </div>
    );
  }

  const hasTrades = recentTrades && recentTrades.length > 0;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {user?.name || 'Trader'} 👋
          </h1>
          <p className="text-xs md:text-sm text-dark-muted mt-1">
            Here's how your trading is performing based on verified journal entries.
          </p>
        </div>
        <Button onClick={() => navigate('/trades/new')} variant="primary" size="md" icon={Plus}>Add Trade</Button>
      </div>

      {!hasTrades ? (
        <EmptyState onAction={() => navigate('/trades/new')} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between text-dark-muted mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Total P&L</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className={`text-xl font-extrabold font-mono ${(metrics?.totalPnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(metrics?.totalPnl || 0, currency)}
              </div>
              <p className="text-[10px] text-dark-muted mt-1">Realized Net Returns</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-dark-muted mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Win Rate</span>
                <Percent className="w-4 h-4 text-brand-400" />
              </div>
              <div className="text-xl font-extrabold font-mono text-white">{metrics?.winRate || 0}%</div>
              <p className="text-[10px] text-dark-muted mt-1">{metrics?.closedTradesCount || 0} Closed Trades</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-dark-muted mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Profit Factor</span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-extrabold font-mono text-brand-300">{metrics?.profitFactor || 0}</div>
              <p className="text-[10px] text-dark-muted mt-1">Gross Win / Gross Loss</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-dark-muted mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Total Trades</span>
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-extrabold font-mono text-white">{metrics?.totalTrades || 0}</div>
              <p className="text-[10px] text-dark-muted mt-1">{metrics?.openTradesCount || 0} Open Position</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-dark-muted mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Average R</span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-400">{formatR(metrics?.avgR || 0)}</div>
              <p className="text-[10px] text-dark-muted mt-1">Expectancy / Risk Unit</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-dark-muted mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Max Drawdown</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-extrabold font-mono text-rose-400">-{metrics?.maxDrawdown || 0}%</div>
              <p className="text-[10px] text-dark-muted mt-1">Peak-to-Trough Decline</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card title="Portfolio Equity Curve" subtitle="Cumulative realized growth over time" className="lg:col-span-2">
              <EquityCurveChart data={equityCurve} />
            </Card>
            <Card title="Daily P&L Performance" subtitle="Net daily trading returns distribution">
              <DailyPnLChart data={dailyPnL} />
            </Card>
          </div>

          <Card title="Recent Journal Entries" subtitle="Latest closed and active trade records"
            action={<NavLink to="/trades" className="text-xs font-semibold text-brand-400 hover:underline">View All Trades →</NavLink>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-border text-dark-muted uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-3 px-2">Date</th><th className="py-3 px-2">Symbol</th>
                    <th className="py-3 px-2">Direction</th><th className="py-3 px-2">Setup</th>
                    <th className="py-3 px-2">Entry</th><th className="py-3 px-2">Exit</th>
                    <th className="py-3 px-2">P&L</th><th className="py-3 px-2">R Multiple</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/50 font-mono">
                  {recentTrades.map((t) => (
                    <tr key={t.id} onClick={() => navigate(`/trades/${t.id}`)} className="hover:bg-dark-cardHover/60 cursor-pointer transition-colors">
                      <td className="py-3 px-2 text-dark-muted whitespace-nowrap">{formatDate(t.tradeDate)}</td>
                      <td className="py-3 px-2 font-bold text-white whitespace-nowrap">{t.symbol}</td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <Badge variant={t.direction === 'Long' ? 'profit' : 'loss'}>
                          {t.direction === 'Long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {t.direction}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-dark-muted whitespace-nowrap">{t.setupName || '—'}</td>
                      <td className="py-3 px-2 text-dark-text whitespace-nowrap">{formatCurrency(t.entryPrice, t.currency, false)}</td>
                      <td className="py-3 px-2 text-dark-text whitespace-nowrap">{t.exitPrice ? formatCurrency(t.exitPrice, t.currency, false) : '—'}</td>
                      <td className={`py-3 px-2 font-bold whitespace-nowrap ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(t.pnl, t.currency)}</td>
                      <td className="py-3 px-2 text-dark-text whitespace-nowrap">{formatR(t.rMultiple)}</td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        <Badge variant={t.status === 'Closed' ? 'neutral' : 'brand'}>{t.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
