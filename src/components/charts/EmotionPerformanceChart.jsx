import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export const EmotionPerformanceChart = ({ data }) => {
  const { currency } = useTheme();
  if (!data || data.length === 0) {
    return <div className="h-56 flex items-center justify-center text-dark-muted text-xs border border-dashed border-dark-border rounded-xl">No emotion tracking data available.</div>;
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2633" vertical={false} />
          <XAxis dataKey="emotion" stroke="#8B98A5" fontSize={11} axisLine={false} tickLine={false} />
          <YAxis stroke="#8B98A5" fontSize={11} tickFormatter={(val) => formatCurrency(val, currency, false)} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const e = payload[0].payload;
              return (
                <div className="glass-panel p-3 rounded-xl border border-dark-border text-xs space-y-1 shadow-2xl">
                  <p className="font-bold text-dark-text">{e.emotion}</p>
                  <p className="text-dark-muted">Trades: <span className="font-mono text-dark-text">{e.tradesCount}</span></p>
                  <p className="text-dark-muted">Win Rate: <span className="font-mono text-brand-400 font-bold">{e.winRate}%</span></p>
                  <p className="text-dark-muted">Total P&L: <span className={e.totalPnl >= 0 ? 'font-mono text-emerald-400 font-bold' : 'font-mono text-rose-400 font-bold'}>{formatCurrency(e.totalPnl, currency)}</span></p>
                </div>
              );
            }
            return null;
          }} />
          <Bar dataKey="totalPnl" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.totalPnl >= 0 ? '#10B981' : '#EF4444'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
