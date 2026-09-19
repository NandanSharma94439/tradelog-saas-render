import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Download, ArrowUpRight, ArrowDownRight, Trash2, Edit, Eye, LayoutGrid, List, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { formatCurrency, formatR, formatDate } from '../utils/formatters';
import { api } from '../services/api';
import { DEMO_TRADES } from '../utils/mockData';

export const TradesPage = () => {
  const { isDemo } = useAuth();
  const { currency } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [direction, setDirection] = useState('All');
  const [assetType, setAssetType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchTrades(); }, [search, direction, assetType, sortBy, isDemo]);

  async function fetchTrades() {
    setIsLoading(true);
    try {
      const queryObj = { sortBy };
      if (search) queryObj.search = search;
      if (direction !== 'All') queryObj.direction = direction;
      if (assetType !== 'All') queryObj.assetType = assetType;
      const res = await api.get('/trades', { params: queryObj });
      setTrades(res.data.trades);
    } catch (err) {
      let list = isDemo ? [...DEMO_TRADES] : [];
      if (search) { const q = search.toLowerCase(); list = list.filter((t) => t.symbol.toLowerCase().includes(q) || (t.setupName || '').toLowerCase().includes(q) || (t.reason || '').toLowerCase().includes(q)); }
      if (direction !== 'All') list = list.filter((t) => t.direction === direction);
      if (assetType !== 'All') list = list.filter((t) => t.assetType === assetType);
      if (sortBy === 'highest_pnl') list.sort((a, b) => b.pnl - a.pnl);
      else if (sortBy === 'lowest_pnl') list.sort((a, b) => a.pnl - b.pnl);
      else list.sort((a, b) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime());
      setTrades(list);
    } finally { setIsLoading(false); }
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/trades/${deleteId}`);
      setTrades((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (err) { alert('Failed to delete trade record.'); }
    finally { setIsDeleting(false); }
  };

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('tradelog_token');
      const response = await fetch('/api/export/csv', { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `TradeLog_Export_${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(a); a.click(); a.remove();
    } catch {
      const headers = ['Date', 'Symbol', 'Asset', 'Direction', 'Entry', 'Exit', 'Qty', 'P&L', 'R Multiple', 'Setup'];
      const rows = trades.map((t) => [t.tradeDate, t.symbol, t.assetType, t.direction, t.entryPrice, t.exitPrice || '', t.quantity, t.pnl, t.rMultiple, t.setupName || '']);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `TradeLog_Export_${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(a); a.click(); a.remove();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Trade Journal</h1>
          <p className="text-xs text-dark-muted mt-0.5">Manage, filter, search, and audit all historical trades.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExportCsv} variant="outline" size="sm" icon={Download}>Export CSV</Button>
          <Button onClick={() => navigate('/trades/new')} variant="primary" size="sm" icon={Plus}>Log New Trade</Button>
        </div>
      </div>
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input placeholder="Search symbol, notes, setup..." leftIcon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select label="Direction" value={direction} onChange={(e) => setDirection(e.target.value)} options={[{ label: 'All Directions', value: 'All' }, { label: 'Long Trades Only', value: 'Long' }, { label: 'Short Trades Only', value: 'Short' }]} />
          <Select label="Asset Type" value={assetType} onChange={(e) => setAssetType(e.target.value)} options={[{ label: 'All Asset Types', value: 'All' }, { label: 'Stocks', value: 'Stock' }, { label: 'Indices', value: 'Index' }, { label: 'Crypto', value: 'Crypto' }, { label: 'Forex', value: 'Forex' }, { label: 'Commodities', value: 'Commodity' }]} />
          <Select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={[{ label: 'Newest Date First', value: 'newest' }, { label: 'Oldest Date First', value: 'oldest' }, { label: 'Highest P&L', value: 'highest_pnl' }, { label: 'Lowest P&L', value: 'lowest_pnl' }]} />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-dark-border text-xs">
          <span className="text-dark-muted font-mono">Showing <strong>{trades.length}</strong> matching trade logs</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-dark-muted hover:text-white'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-dark-muted hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>
      {isLoading ? (
        <div className="space-y-3"><Skeleton height="h-12" /><Skeleton height="h-12" /><Skeleton height="h-12" /></div>
      ) : trades.length === 0 ? (
        <EmptyState onAction={() => navigate('/trades/new')} />
      ) : viewMode === 'table' ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-dark-bg/60 border-b border-dark-border text-dark-muted uppercase text-[10px] font-mono tracking-wider">
                  <th className="py-3 px-4">Date</th><th className="py-3 px-4">Symbol</th><th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Asset</th><th className="py-3 px-4">Setup</th><th className="py-3 px-4">Entry / Exit</th>
                  <th className="py-3 px-4">P&L</th><th className="py-3 px-4">R Multiple</th><th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40 font-mono">
                {trades.map((t) => (
                  <tr key={t.id} className="hover:bg-dark-cardHover/50 transition-colors">
                    <td className="py-3.5 px-4 text-dark-muted whitespace-nowrap">{formatDate(t.tradeDate)}</td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{t.symbol}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={t.direction === 'Long' ? 'profit' : 'loss'}>
                        {t.direction === 'Long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{t.direction}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-dark-muted whitespace-nowrap">{t.assetType}</td>
                    <td className="py-3.5 px-4 text-dark-text whitespace-nowrap">{t.setupName || 'Unassigned'}</td>
                    <td className="py-3.5 px-4 text-dark-text whitespace-nowrap">{formatCurrency(t.entryPrice, t.currency, false)} → {t.exitPrice ? formatCurrency(t.exitPrice, t.currency, false) : 'Open'}</td>
                    <td className={`py-3.5 px-4 font-bold whitespace-nowrap ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(t.pnl, t.currency)}</td>
                    <td className="py-3.5 px-4 text-dark-text whitespace-nowrap">{formatR(t.rMultiple)}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/trades/${t.id}`)} className="p-1.5 text-dark-muted hover:text-brand-400 hover:bg-dark-cardHover rounded-lg transition-colors" title="View Trade Report"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => navigate(`/trades/edit/${t.id}`)} className="p-1.5 text-dark-muted hover:text-amber-400 hover:bg-dark-cardHover rounded-lg transition-colors" title="Edit Trade"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-dark-muted hover:text-rose-400 hover:bg-dark-cardHover rounded-lg transition-colors" title="Delete Trade"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trades.map((t) => (
            <Card key={t.id} hoverEffect className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-white font-mono">{t.symbol}</span>
                <Badge variant={t.direction === 'Long' ? 'profit' : 'loss'}>{t.direction}</Badge>
              </div>
              <div className="text-xs text-dark-muted flex justify-between"><span>{formatDate(t.tradeDate)}</span><span>{t.setupName || 'General'}</span></div>
              <div className="p-2.5 rounded-lg bg-dark-bg border border-dark-border flex justify-between font-mono text-xs">
                <div><span className="text-dark-muted block text-[10px]">Net P&L</span><span className={t.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatCurrency(t.pnl, t.currency)}</span></div>
                <div className="text-right"><span className="text-dark-muted block text-[10px]">R Multiple</span><span className="text-white font-bold">{formatR(t.rMultiple)}</span></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dark-border text-xs">
                <Button onClick={() => navigate(`/trades/${t.id}`)} variant="ghost" size="sm">Report</Button>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/trades/edit/${t.id}`)} className="text-dark-muted hover:text-amber-400"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(t.id)} className="text-dark-muted hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete Trade">
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" /><p>Are you sure you want to delete this trade entry? This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={() => setDeleteId(null)} variant="secondary" size="md">Cancel</Button>
            <Button onClick={handleDelete} variant="danger" size="md" isLoading={isDeleting}>Delete Permanently</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
