import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DEMO_TRADES } from '../utils/mockData';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const CalendarPage = () => {
  const { isDemo } = useAuth();
  const { currency } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date('2026-09-01'));
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayTrades, setSelectedDayTrades] = useState(null);

  useEffect(() => {
    async function fetchTrades() {
      setIsLoading(true);
      try { const res = await api.get('/trades'); setTrades(res.data.trades); }
      catch (err) { setTrades(isDemo ? DEMO_TRADES : []); }
      finally { setIsLoading(false); }
    }
    fetchTrades();
  }, [isDemo]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tradesByDate = {};
  for (const t of trades) {
    if (!tradesByDate[t.tradeDate]) tradesByDate[t.tradeDate] = [];
    tradesByDate[t.tradeDate].push(t);
  }

  if (isLoading) {
    return <div className="p-8 space-y-6 max-w-7xl mx-auto"><Skeleton height="h-10" width="w-64" /><Skeleton height="h-96" /></div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-400" /> Trading Performance Calendar
          </h1>
          <p className="text-xs text-dark-muted mt-0.5">Visualize your daily P&L and trade distribution across the calendar month.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-xl bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-bold text-white text-base font-mono min-w-36 text-center">{MONTH_NAMES[month]} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-xl bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 mb-4 text-center font-mono text-xs font-bold text-dark-muted uppercase">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => <div key={`empty-${idx}`} className="h-24 md:h-28 rounded-xl bg-dark-bg/30 border border-dark-border/20 opacity-30" />)}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayTrades = tradesByDate[dateStr] || [];
            const dayNetPnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
            const isProfitable = dayNetPnl > 0;
            const isLoss = dayNetPnl < 0;
            return (
              <div key={dayNum} onClick={() => dayTrades.length > 0 && setSelectedDayTrades({ date: dateStr, trades: dayTrades })}
                className={`h-24 md:h-28 rounded-xl p-2 md:p-3 border flex flex-col justify-between transition-all ${dayTrades.length > 0 ? 'cursor-pointer hover:scale-[1.02] shadow-lg' : ''} ${isProfitable ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : isLoss ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' : 'bg-dark-bg border-dark-border text-dark-text'}`}>
                <div className="flex justify-between items-start font-mono text-xs">
                  <span className="font-bold text-white">{dayNum}</span>
                  {dayTrades.length > 0 && <span className="text-[10px] font-mono opacity-80 px-1.5 py-0.5 rounded bg-black/40">{dayTrades.length} {dayTrades.length === 1 ? 'trade' : 'trades'}</span>}
                </div>
                {dayTrades.length > 0 ? <div className="font-mono text-xs md:text-sm font-extrabold truncate">{formatCurrency(dayNetPnl, currency)}</div>
                  : <div className="text-[10px] text-dark-muted font-mono opacity-40">No trades</div>}
              </div>
            );
          })}
        </div>
      </Card>
      <Modal isOpen={!!selectedDayTrades} onClose={() => setSelectedDayTrades(null)} title={selectedDayTrades ? `Trades on ${formatDate(selectedDayTrades.date)}` : ''} maxWidth="2xl">
        <div className="space-y-3 font-mono text-xs">
          {selectedDayTrades?.trades.map((t) => (
            <div key={t.id} className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{t.symbol}</span>
                  <Badge variant={t.direction === 'Long' ? 'profit' : 'loss'}>{t.direction}</Badge>
                  <span className="text-dark-muted">{t.setupName || 'General'}</span>
                </div>
                <p className="text-dark-muted text-[11px] mt-1">Entry: {t.entryPrice} → Exit: {t.exitPrice || 'Open'}</p>
              </div>
              <div className="text-right">
                <span className={`font-extrabold text-sm block ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(t.pnl, t.currency)}</span>
                <span className="text-dark-muted text-[10px]">{t.rMultiple}R</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
