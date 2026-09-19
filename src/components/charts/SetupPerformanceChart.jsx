import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export const SetupPerformanceChart = ({ data }) => {
  const { currency } = useTheme();
  if (!data || data.length === 0) {
    return <div className="h-56 flex items-center justify-center text-dark-muted text-xs border border-dashed border-dark-border rounded-xl">No setup analytics data available.</div>;
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2633" horizontal={false} />
          <XAxis stroke="#8B98A5" fontSize={11} tickFormatter={(val) => formatCurrency(val, currency, false)} axisLine={false} tickLine={false} />
          <YAxis dataKey="setupName" stroke="#8B98A5" fontSize={11} type="category" axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const s = payload[0].payload;
              return (
                <div className="glass-panel p-3 rounded-xl border border-dark-border text-xs space-y-1 shadow-2xl">
                  <p className="font-bold text-dark-text">{s.setupName}</p>
                  <p className="text-dark-muted">Trades: <span className="font-mono text-dark-text">{s.tradesCount}</span></p>
                  <p className="text-dark-muted">Win Rate: <span className="font-mono text-brand-400 font-bold">{s.winRate}%</span></p>
                  <p className="text-dark-muted">Avg R: <span className="font-mono text-dark-text">{s.avgR}R</span></p>
                  <p className="text-dark-muted">Total P&L: <span className={s.totalPnl >= 0 ? 'font-mono text-emerald-400 font-bold' : 'font-mono text-rose-400 font-bold'}>{formatCurrency(s.totalPnl, currency)}</span></p>
                </div>
              );
            }
            return null;
          }} />
          <Bar dataKey="totalPnl" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.totalPnl >= 0 ? '#10B981' : '#EF4444'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
