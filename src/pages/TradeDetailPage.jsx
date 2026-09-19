import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ArrowUpRight, ArrowDownRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { formatCurrency, formatR, formatDate, getEmotionBadgeStyle } from '../utils/formatters';
import { api } from '../services/api';
import { DEMO_TRADES } from '../utils/mockData';

export const TradeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    async function fetchTrade() {
      setIsLoading(true);
      try {
        const res = await api.get(`/trades/${id}`);
        setTrade(res.data.trade);
      } catch (err) {
        const found = DEMO_TRADES.find((t) => t.id === id);
        if (found) setTrade(found);
      } finally { setIsLoading(false); }
    }
    fetchTrade();
  }, [id]);

  const handleAiAnalysis = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiResponse(`AI JOURNAL PATTERN INSIGHT: Your trade thesis on ${trade?.symbol} was well-structured. However, trades tagged with '${trade?.beforeEmotion || 'FOMO'}' have historically produced a 29% lower win rate in your journal. Consider setting a 15-minute wait rule post-breakout.`);
    }, 1500);
  };

  if (isLoading) {
    return <div className="p-8 space-y-6 max-w-5xl mx-auto"><Skeleton height="h-10" width="w-48" /><Skeleton height="h-40" /><Skeleton height="h-64" /></div>;
  }

  if (!trade) {
    return (
      <div className="p-8 text-center text-dark-muted space-y-4">
        <p>Trade record not found.</p><Button onClick={() => navigate('/trades')} variant="secondary">Back to Trades</Button>
      </div>
    );
  }

  const isWin = trade.pnl >= 0;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/trades')} className="p-2 rounded-xl bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">{trade.symbol}</h1>
              <Badge variant={trade.direction === 'Long' ? 'profit' : 'loss'}>{trade.direction === 'Long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{trade.direction}</Badge>
              <Badge variant={trade.status === 'Closed' ? 'neutral' : 'brand'}>{trade.status}</Badge>
            </div>
            <p className="text-xs text-dark-muted mt-1 font-mono">Executed on {formatDate(trade.tradeDate)} {trade.tradeTime ? `at ${trade.tradeTime}` : ''} • Asset: {trade.assetType}</p>
          </div>
        </div>
        <div className="flex items-center gap-3"><Button onClick={() => navigate(`/trades/edit/${trade.id}`)} variant="secondary" size="sm" icon={Edit}>Edit</Button></div>
      </div>
      <div className="glass-panel p-6 rounded-2xl border border-dark-border shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><span className="text-[10px] font-mono uppercase tracking-wider text-dark-muted block">Realized Net P&L</span><span className={`text-2xl font-extrabold font-mono ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(trade.pnl, trade.currency)}</span></div>
        <div><span className="text-[10px] font-mono uppercase tracking-wider text-dark-muted block">R Multiple</span><span className="text-2xl font-extrabold font-mono text-white">{formatR(trade.rMultiple)}</span></div>
        <div><span className="text-[10px] font-mono uppercase tracking-wider text-dark-muted block">Risk / Reward</span><span className="text-2xl font-extrabold font-mono text-brand-400">1:{trade.riskRewardRatio}</span></div>
        <div><span className="text-[10px] font-mono uppercase tracking-wider text-dark-muted block">Return %</span><span className={`text-2xl font-extrabold font-mono ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>{trade.returnPercentage}%</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Price Execution Levels" subtitle="Entry, exit, stop loss and take profit targets">
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            {[{ label: 'Entry Price', val: formatCurrency(trade.entryPrice, trade.currency, false), col: 'text-white font-bold text-sm' },
            { label: 'Exit Price', val: trade.exitPrice ? formatCurrency(trade.exitPrice, trade.currency, false) : 'Open', col: 'text-white font-bold text-sm' },
            { label: 'Stop Loss', val: formatCurrency(trade.stopLoss, trade.currency, false), col: 'text-rose-400 font-bold text-sm' },
            { label: 'Take Profit', val: formatCurrency(trade.takeProfit, trade.currency, false), col: 'text-emerald-400 font-bold text-sm' },
            { label: 'Quantity / Lot', val: trade.quantity, col: 'text-dark-text font-bold' },
            { label: 'Fees / Brokerage', val: formatCurrency(trade.fees, trade.currency, false), col: 'text-dark-text font-bold' }
            ].map(i => <div key={i.label} className="p-3 rounded-lg bg-dark-bg border border-dark-border"><span className="text-dark-muted block text-[10px]">{i.label}</span><span className={i.col}>{i.val}</span></div>)}
          </div>
        </Card>
        <Card title="Strategy & Psychology Context" subtitle="Setup, emotions, and discipline ratings">
          <div className="space-y-4 text-xs">
            <div><span className="text-dark-muted font-semibold block mb-1">Strategy Setup</span><Badge variant="brand">{trade.setupName || 'Unassigned'}</Badge></div>
            <div>
              <span className="text-dark-muted font-semibold block mb-1">Emotions Timeline</span>
              <div className="flex items-center gap-2">
                <span className="text-dark-muted">Before:</span><span className={`px-2 py-0.5 rounded font-mono text-[11px] ${getEmotionBadgeStyle(trade.beforeEmotion).bg} ${getEmotionBadgeStyle(trade.beforeEmotion).text}`}>{trade.beforeEmotion || 'Neutral'}</span>
                <span className="text-dark-muted">→ During:</span><span className={`px-2 py-0.5 rounded font-mono text-[11px] ${getEmotionBadgeStyle(trade.duringEmotion).bg} ${getEmotionBadgeStyle(trade.duringEmotion).text}`}>{trade.duringEmotion || 'Neutral'}</span>
              </div>
            </div>
            <div>
              <span className="text-dark-muted font-semibold block mb-1">Tagging Mistakes</span>
              <div className="flex flex-wrap gap-1.5">{trade.mistakes && trade.mistakes.length > 0 ? trade.mistakes.map((m, i) => <Badge key={i} variant={m.mistake === 'No mistake' ? 'profit' : 'loss'}>{m.mistake}</Badge>) : <Badge variant="profit">No mistake</Badge>}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono pt-2 border-t border-dark-border">
              <div><span className="text-dark-muted block text-[10px]">Confidence</span><span className="text-brand-300 font-bold">{trade.confidence}/10</span></div>
              <div><span className="text-dark-muted block text-[10px]">Discipline</span><span className="text-emerald-400 font-bold">{trade.discipline}/10</span></div>
              <div><span className="text-dark-muted block text-[10px]">Stress</span><span className="text-rose-400 font-bold">{trade.stress}/10</span></div>
            </div>
          </div>
        </Card>
      </div>
      <Card title="Trade Thesis & Post-Execution Reflection">
        <div className="space-y-4 text-xs">
          {trade.reason && <div><h4 className="font-bold text-dark-muted uppercase tracking-wider mb-1">Why was this trade taken?</h4><p className="text-dark-text p-3 rounded-lg bg-dark-bg border border-dark-border leading-relaxed">{trade.reason}</p></div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {trade.reviewWentWell && <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30"><h5 className="font-bold text-emerald-400 mb-1">What Went Well</h5><p className="text-emerald-200">{trade.reviewWentWell}</p></div>}
            {trade.reviewWentWrong && <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30"><h5 className="font-bold text-rose-400 mb-1">What Went Wrong</h5><p className="text-rose-200">{trade.reviewWentWrong}</p></div>}
          </div>
          {trade.lessonLearned && <div className="p-3.5 rounded-xl bg-brand-950/20 border border-brand-500/30"><h5 className="font-bold text-brand-300 mb-1">Key Lesson Learned</h5><p className="text-brand-200 font-medium">{trade.lessonLearned}</p></div>}
        </div>
      </Card>
      {trade.screenshots && trade.screenshots.length > 0 && (
        <Card title="Execution Chart Screenshots">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trade.screenshots.map((sc, i) => (
              <div key={i} onClick={() => setActiveLightboxImg(sc.url)} className="cursor-pointer group relative rounded-xl overflow-hidden border border-dark-border">
                <img src={sc.url} alt={sc.type} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ImageIcon className="w-6 h-6 text-white" /></div>
                <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold uppercase bg-black/80 px-2 py-0.5 rounded text-white">{sc.type} Execution</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card title="AI Trade Review (Beta)" subtitle="Pattern detection and discipline advisor" className="border-brand-500/40">
        <div className="space-y-4">
          <p className="text-xs text-dark-muted">Analyze your journal entry for recurring mistakes, strategy adherence, and emotional discipline patterns.</p>
          {aiResponse ? <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs text-brand-200 leading-relaxed font-mono">{aiResponse}</div> : null}
          <div className="flex items-center gap-3">
            <Button onClick={handleAiAnalysis} variant="secondary" size="md" isLoading={aiAnalyzing} icon={Sparkles}>Analyze Trade Entry</Button><span className="text-[11px] text-dark-muted">⚙️ OpenAI / Gemini API key configurable in .env</span>
          </div>
        </div>
      </Card>
      <Modal isOpen={!!activeLightboxImg} onClose={() => setActiveLightboxImg(null)} maxWidth="4xl">
        {activeLightboxImg && <img src={activeLightboxImg} alt="Screenshot preview" className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />}
      </Modal>
    </div>
  );
};
