import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export const DailyPnLChart = ({ data }) => {
  const { currency } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-dark-border rounded-xl text-dark-muted text-xs">
        <p>No daily P&L data yet.</p>
      </div>
    );
  }

  const positiveDays = data.filter((d) => d.pnl > 0).length;
  const negativeDays = data.filter((d) => d.pnl < 0).length;
  const bestDay = data.length > 0 ? Math.max(...data.map((d) => d.pnl)) : 0;
  const worstDay = data.length > 0 ? Math.min(...data.map((d) => d.pnl)) : 0;

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-dark-muted block text-[10px]">Win Days</span>
          <span className="text-emerald-400 font-bold text-sm">{positiveDays} days</span>
        </div>
        <div className="p-2.5 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-dark-muted block text-[10px]">Loss Days</span>
          <span className="text-rose-400 font-bold text-sm">{negativeDays} days</span>
        </div>
        <div className="p-2.5 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-dark-muted block text-[10px]">Best Day</span>
          <span className="text-emerald-400 font-bold text-sm">{formatCurrency(bestDay, currency)}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-dark-muted block text-[10px]">Worst Day</span>
          <span className="text-rose-400 font-bold text-sm">{formatCurrency(worstDay, currency)}</span>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2633" vertical={false} />
            <XAxis dataKey="date" stroke="#8B98A5" fontSize={11} tickFormatter={formatDate} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B98A5" fontSize={11} tickFormatter={(val) => formatCurrency(val, currency, false)} tickLine={false} axisLine={false} />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload;
                return (
                  <div className="glass-panel p-3 rounded-xl border border-dark-border text-xs space-y-1 shadow-2xl">
                    <p className="font-semibold text-dark-text">{formatDate(point.date)}</p>
                    <p className="text-dark-muted">Trades: <span className="text-dark-text font-mono">{point.count}</span></p>
                    <p className="text-dark-muted">Net P&L: <span className={point.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatCurrency(point.pnl, currency)}</span></p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10B981' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
