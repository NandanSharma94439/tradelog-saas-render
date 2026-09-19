import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const WinLossDistributionChart = ({ winningTrades, losingTrades, breakEvenTrades = 0 }) => {
  const data = [
    { name: 'Winning Trades', value: winningTrades, color: '#10B981' },
    { name: 'Losing Trades', value: losingTrades, color: '#EF4444' },
    ...(breakEvenTrades > 0 ? [{ name: 'Break Even', value: breakEvenTrades, color: '#F59E0B' }] : []),
  ];
  const total = winningTrades + losingTrades + breakEvenTrades;
  if (total === 0) {
    return <div className="h-48 flex items-center justify-center text-dark-muted text-xs border border-dashed border-dark-border rounded-xl">No trades to calculate win/loss distribution.</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
            </Pie>
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0];
                const pct = (p.value / total) * 100;
                return (
                  <div className="glass-panel p-2.5 rounded-lg border border-dark-border text-xs shadow-xl">
                    <span className="font-semibold text-dark-text block">{p.name}</span>
                    <span className="font-mono text-dark-muted">{p.value} trades ({pct.toFixed(1)}%)</span>
                  </div>
                );
              }
              return null;
            }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 text-xs font-mono mt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-dark-text">Win: <strong className="text-emerald-400">{winningTrades}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-dark-text">Loss: <strong className="text-rose-400">{losingTrades}</strong></span>
        </div>
      </div>
    </div>
  );
};
