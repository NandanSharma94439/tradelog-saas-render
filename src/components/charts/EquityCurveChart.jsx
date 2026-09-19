import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

const TIMEFRAMES = ['7D', '30D', '3M', '6M', '1Y', 'ALL'];

export const EquityCurveChart = ({ data }) => {
  const { currency } = useTheme();
  const [timeframe, setTimeframe] = useState('ALL');

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-dark-border rounded-xl text-dark-muted text-xs">
        <p>No equity curve data yet.</p>
        <p className="text-[11px] mt-1 text-dark-muted/70">Log trades to visualize cumulative portfolio growth.</p>
      </div>
    );
  }

  const filteredData = React.useMemo(() => {
    if (timeframe === 'ALL' || data.length <= 1) return data;
    const now = new Date(data[data.length - 1].date).getTime();
    const daysMap = { '7D': 7, '30D': 30, '3M': 90, '6M': 180, '1Y': 365 };
    const days = daysMap[timeframe] || 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const result = data.filter((d) => new Date(d.date).getTime() >= cutoff);
    return result.length > 0 ? result : data;
  }, [data, timeframe]);

  const isPositive = (filteredData[filteredData.length - 1]?.cumulative || 0) >= 0;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-dark-muted">Cumulative P&L:</span>
          <span className={`font-bold text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(filteredData[filteredData.length - 1]?.cumulative || 0, currency)}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-lg border border-dark-border text-xs font-mono">
          {TIMEFRAMES.map((tf) => (
            <button key={tf} onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded-md transition-colors ${timeframe === tf ? 'bg-brand-600 text-white font-bold' : 'text-dark-muted hover:text-dark-text hover:bg-dark-cardHover'}`}>
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2633" vertical={false} />
            <XAxis dataKey="date" stroke="#8B98A5" fontSize={11} tickFormatter={formatDate} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B98A5" fontSize={11} tickFormatter={(val) => formatCurrency(val, currency, false)} tickLine={false} axisLine={false} />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload;
                return (
                  <div className="glass-panel p-3 rounded-xl border border-dark-border text-xs space-y-1 shadow-2xl">
                    <p className="font-semibold text-dark-text">{formatDate(point.date)}</p>
                    <p className="text-dark-muted">Symbol: <span className="text-dark-text font-mono">{point.symbol}</span></p>
                    <p className="text-dark-muted">Trade P&L: <span className={point.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatCurrency(point.pnl, currency)}</span></p>
                    <p className="text-dark-muted">Cumulative: <span className={point.cumulative >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatCurrency(point.cumulative, currency)}</span></p>
                  </div>
                );
              }
              return null;
            }} />
            <Area type="monotone" dataKey="cumulative" stroke={strokeColor} strokeWidth={2.5} fillOpacity={1} fill="url(#equityGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
