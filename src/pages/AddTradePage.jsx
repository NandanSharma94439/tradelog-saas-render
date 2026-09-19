import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { calculateTradeMetrics } from '../utils/calculations';
import { formatCurrency, formatR } from '../utils/formatters';
import { api } from '../services/api';

const COMMON_MISTAKES = ['Entered too early', 'Entered too late', 'Oversized position', 'Moved stop loss', 'Removed stop loss', 'Revenge trade', 'FOMO', 'Overtrading', 'Ignored setup rules', 'Broke trading plan', 'Took profit too early', 'Held loss too long', 'No mistake'];
const EMOTIONS = ['Calm', 'Confident', 'Fearful', 'FOMO', 'Angry', 'Excited', 'Neutral'];

export const AddTradePage = ({ isEdit = false }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const { currency: defaultCurrency } = useTheme();
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState('Stock');
  const [direction, setDirection] = useState('Long');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [fees, setFees] = useState('50');
  const [currency, setCurrency] = useState(defaultCurrency || 'INR');
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeTime, setTradeTime] = useState('10:00');
  const [setupName, setSetupName] = useState('Breakout');

  const [reason, setReason] = useState('');
  const [beforeEmotion, setBeforeEmotion] = useState('Calm');
  const [duringEmotion, setDuringEmotion] = useState('Calm');
  const [afterEmotion, setAfterEmotion] = useState('Confident');
  const [confidence, setConfidence] = useState(8);
  const [discipline, setDiscipline] = useState(9);
  const [stress, setStress] = useState(2);

  const [selectedMistakes, setSelectedMistakes] = useState([]);
  const [reviewWentWell, setReviewWentWell] = useState('');
  const [reviewWentWrong, setReviewWentWrong] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      async function loadTrade() {
        try {
          const res = await api.get(`/trades/${id}`);
          const t = res.data.trade;
          setSymbol(t.symbol); setAssetType(t.assetType); setDirection(t.direction);
          setEntryPrice(String(t.entryPrice)); if (t.exitPrice) setExitPrice(String(t.exitPrice));
          setQuantity(String(t.quantity)); setStopLoss(String(t.stopLoss)); setTakeProfit(String(t.takeProfit)); setFees(String(t.fees));
          setCurrency(t.currency); setTradeDate(t.tradeDate); if (t.tradeTime) setTradeTime(t.tradeTime);
          if (t.setupName) setSetupName(t.setupName); if (t.reason) setReason(t.reason);
          if (t.beforeEmotion) setBeforeEmotion(t.beforeEmotion); if (t.duringEmotion) setDuringEmotion(t.duringEmotion); if (t.afterEmotion) setAfterEmotion(t.afterEmotion);
          setConfidence(t.confidence); setDiscipline(t.discipline); setStress(t.stress);
          if (t.reviewWentWell) setReviewWentWell(t.reviewWentWell); if (t.reviewWentWrong) setReviewWentWrong(t.reviewWentWrong); if (t.lessonLearned) setLessonLearned(t.lessonLearned);
          if (t.mistakes) setSelectedMistakes(t.mistakes.map((m) => m.mistake));
          if (t.screenshots) setScreenshots(t.screenshots);
        } catch (err) { console.error('Failed to load trade for editing'); }
      }
      loadTrade();
    }
  }, [isEdit, id]);

  const liveMetrics = useMemo(() => calculateTradeMetrics({
    direction, entryPrice: parseFloat(entryPrice) || 0, exitPrice: exitPrice ? parseFloat(exitPrice) : null,
    quantity: parseFloat(quantity) || 0, stopLoss: parseFloat(stopLoss) || 0, takeProfit: parseFloat(takeProfit) || 0, fees: parseFloat(fees) || 0,
  }), [direction, entryPrice, exitPrice, quantity, stopLoss, takeProfit, fees]);

  const warnings = useMemo(() => {
    const list = [];
    const entry = parseFloat(entryPrice); const stop = parseFloat(stopLoss); const target = parseFloat(takeProfit);
    if (entry > 0 && stop > 0) {
      if (direction === 'Long' && stop >= entry) list.push('Warning: For LONG trades, Stop Loss is normally below Entry price.');
      else if (direction === 'Short' && stop <= entry) list.push('Warning: For SHORT trades, Stop Loss is normally above Entry price.');
    }
    if (entry > 0 && target > 0) {
      if (direction === 'Long' && target <= entry) list.push('Warning: For LONG trades, Take Profit target is normally above Entry price.');
      else if (direction === 'Short' && target >= entry) list.push('Warning: For SHORT trades, Take Profit target is normally below Entry price.');
    }
    return list;
  }, [direction, entryPrice, stopLoss, takeProfit]);

  const toggleMistake = (m) => {
    if (m === 'No mistake') return setSelectedMistakes(['No mistake']);
    const filtered = selectedMistakes.filter((item) => item !== 'No mistake');
    if (filtered.includes(m)) setSelectedMistakes(filtered.filter((item) => item !== m));
    else setSelectedMistakes([...filtered, m]);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result;
      setScreenshots((prev) => [...prev.filter((sc) => sc.type !== type), { type, url: base64Url, caption: `${type.toUpperCase()} execution screenshot` }]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol || !entryPrice || !stopLoss || !takeProfit || !quantity || !tradeDate) { alert('Please complete all required trade parameters.'); return; }
    setIsLoading(true);
    const payload = {
      symbol: symbol.toUpperCase().trim(), assetType, direction, entryPrice: parseFloat(entryPrice), exitPrice: exitPrice ? parseFloat(exitPrice) : null,
      quantity: parseFloat(quantity), stopLoss: parseFloat(stopLoss), takeProfit: parseFloat(takeProfit), fees: parseFloat(fees) || 0, currency, tradeDate, tradeTime,
      setupName, reason, beforeEmotion, duringEmotion, afterEmotion, confidence, discipline, stress, reviewWentWell, reviewWentWrong, lessonLearned, mistakes: selectedMistakes, screenshots,
    };
    try {
      if (isEdit && id) await api.put(`/trades/${id}`, payload); else await api.post('/trades', payload);
      navigate('/trades');
    } catch (err) { navigate('/trades'); } finally { setIsLoading(false); }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button>
          <div><h1 className="text-2xl font-extrabold text-white tracking-tight">{isEdit ? 'Edit Trade Entry' : 'Log New Trade'}</h1><p className="text-xs text-dark-muted">Record detailed trade parameters, risk/reward & psychology context.</p></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card title="1. Basic Information" subtitle="Symbol, direction, and execution timestamp">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input label="Symbol / Ticker *" placeholder="e.g. RELIANCE, NIFTY, BTCUSD" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} required />
            <Select label="Asset Class" value={assetType} onChange={(e) => setAssetType(e.target.value)} options={[{ label: 'Stock', value: 'Stock' }, { label: 'Index', value: 'Index' }, { label: 'Crypto', value: 'Crypto' }, { label: 'Forex', value: 'Forex' }, { label: 'Commodity', value: 'Commodity' }, { label: 'Other', value: 'Other' }]} />
            <div className="space-y-1.5"><label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted">Direction *</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setDirection('Long')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${direction === 'Long' ? 'bg-emerald-600 text-white border-emerald-400 shadow-glow-profit' : 'bg-dark-bg text-dark-muted border-dark-border hover:text-white'}`}>LONG ▲</button><button type="button" onClick={() => setDirection('Short')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${direction === 'Short' ? 'bg-rose-600 text-white border-rose-400 shadow-glow-loss' : 'bg-dark-bg text-dark-muted border-dark-border hover:text-white'}`}>SHORT ▼</button></div></div>
            <Input label="Trade Date *" type="date" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} required />
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card title="2. Price & Position Sizing" subtitle="Entry, exit, stop loss and targets" className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Entry Price *" type="number" step="any" placeholder="0.00" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} required />
              <Input label="Exit Price (Leave blank if open)" type="number" step="any" placeholder="0.00" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} />
              <Input label="Quantity / Lot Size *" type="number" step="any" placeholder="100" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              <Input label="Stop Loss Price *" type="number" step="any" placeholder="0.00" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} required />
              <Input label="Take Profit Target *" type="number" step="any" placeholder="0.00" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} required />
              <Input label="Fees / Brokerage" type="number" step="any" placeholder="50" value={fees} onChange={(e) => setFees(e.target.value)} />
            </div>
            {warnings.length > 0 && <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">{warnings.map((w, idx) => <div key={idx} className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" /><span>{w}</span></div>)}</div>}
          </Card>
          <Card title="Live Risk Engine" subtitle="Auto-calculated while you type" className="border-brand-500/30">
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex justify-between items-center"><span className="text-dark-muted">Realized P&L:</span><span className={`text-base font-extrabold ${liveMetrics.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(liveMetrics.pnl, currency)}</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex justify-between items-center"><span className="text-dark-muted">Risk Amount:</span><span className="text-rose-400 font-bold">{formatCurrency(liveMetrics.riskAmount, currency, false)}</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex justify-between items-center"><span className="text-dark-muted">Potential Reward:</span><span className="text-emerald-400 font-bold">{formatCurrency(liveMetrics.rewardAmount, currency, false)}</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex justify-between items-center"><span className="text-dark-muted">Risk/Reward Ratio:</span><span className="text-brand-300 font-bold">1:{liveMetrics.riskRewardRatio}</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex justify-between items-center"><span className="text-dark-muted">R Multiple:</span><span className="text-white font-bold">{formatR(liveMetrics.rMultiple)}</span></div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border flex justify-between items-center"><span className="text-dark-muted">Return %:</span><span className={`font-bold ${liveMetrics.returnPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{liveMetrics.returnPercentage}%</span></div>
            </div>
          </Card>
        </div>
        <Card title="3. Strategy Setup & Trade Thesis" subtitle="Strategy classification and entry reason">
          <div className="space-y-4">
            <Select label="Setup / Strategy Pattern" value={setupName} onChange={(e) => setSetupName(e.target.value)} options={[{ label: 'Breakout', value: 'Breakout' }, { label: 'Pullback', value: 'Pullback' }, { label: 'Reversal', value: 'Reversal' }, { label: 'Trend Continuation', value: 'Trend continuation' }, { label: 'Support / Resistance Bounce', value: 'Support/Resistance' }, { label: 'Momentum', value: 'Momentum' }, { label: 'Scalping', value: 'Scalping' }, { label: 'Swing', value: 'Swing' }, { label: 'Other Custom Setup', value: 'Other' }]} />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted">Why did you take this trade?</label>
              <textarea rows={3} placeholder="Price broke previous resistance with 2.5x volume expansion on 15m chart..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-dark-bg border border-dark-border hover:border-dark-borderLight text-dark-text placeholder-dark-muted rounded-lg text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
            </div>
          </div>
        </Card>
        <Card title="4. Trading Psychology & Execution Discipline" subtitle="Record emotional state and mistake tags">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select label="Emotion BEFORE Trade" value={beforeEmotion} onChange={(e) => setBeforeEmotion(e.target.value)} options={EMOTIONS.map((e) => ({ label: e, value: e }))} />
              <Select label="Emotion DURING Trade" value={duringEmotion} onChange={(e) => setDuringEmotion(e.target.value)} options={EMOTIONS.map((e) => ({ label: e, value: e }))} />
              <Select label="Emotion AFTER Trade" value={afterEmotion} onChange={(e) => setAfterEmotion(e.target.value)} options={EMOTIONS.map((e) => ({ label: e, value: e }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Confidence', val: confidence, set: setConfidence, col: 'text-brand-400', accent: 'accent-brand-500' },
                { label: 'Discipline', val: discipline, set: setDiscipline, col: 'text-emerald-400', accent: 'accent-emerald-500' },
                { label: 'Stress Level', val: stress, set: setStress, col: 'text-rose-400', accent: 'accent-rose-500' }
              ].map(s => (
                <div key={s.label} className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-dark-muted font-semibold">{s.label} (1-10)</span><span className={`font-mono font-bold ${s.col}`}>{s.val}/10</span></div>
                  <input type="range" min="1" max="10" value={s.val} onChange={(e) => s.set(parseInt(e.target.value))} className={`w-full ${s.accent}`} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted">Execution Mistakes Tagging (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_MISTAKES.map((m) => {
                  const isSelected = selectedMistakes.includes(m);
                  return <button key={m} type="button" onClick={() => toggleMistake(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isSelected ? m === 'No mistake' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-loss' : 'bg-dark-bg text-dark-muted border-dark-border hover:border-dark-borderLight hover:text-white'}`}>{m}</button>;
                })}
              </div>
            </div>
          </div>
        </Card>
        <Card title="5. Chart Screenshots" subtitle="Attach before, during, or after chart screenshots">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['before', 'during', 'after'].map((type) => {
              const sc = screenshots.find((s) => s.type === type);
              return (
                <div key={type} className="border border-dashed border-dark-border rounded-xl p-4 text-center space-y-3 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark-muted block">{type} Execution</span>
                  {sc ? (
                    <div className="relative group">
                      <img src={sc.url} alt={type} className="w-full h-32 object-cover rounded-lg border border-dark-border" />
                      <button type="button" onClick={() => setScreenshots(screenshots.filter((s) => s.type !== type))} className="absolute top-2 right-2 p-1 bg-black/80 rounded-full text-rose-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-dark-cardHover/50 rounded-lg transition-colors">
                      <Upload className="w-6 h-6 text-dark-muted mb-2" /><span className="text-xs text-dark-muted">Upload {type} image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, type)} />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="6. Post-Trade Review & Lessons" subtitle="Self-reflection textareas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400">What went well?</label><textarea rows={2} placeholder="Followed entry rules patiently..." value={reviewWentWell} onChange={(e) => setReviewWentWell(e.target.value)} className="w-full bg-dark-bg border border-dark-border text-dark-text text-sm p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
            <div className="space-y-1.5"><label className="block text-xs font-semibold uppercase tracking-wider text-rose-400">What went wrong?</label><textarea rows={2} placeholder="Exited slightly before target..." value={reviewWentWrong} onChange={(e) => setReviewWentWrong(e.target.value)} className="w-full bg-dark-bg border border-dark-border text-dark-text text-sm p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500" /></div>
            <div className="sm:col-span-2 space-y-1.5"><label className="block text-xs font-semibold uppercase tracking-wider text-brand-400">Lesson Learned</label><textarea rows={2} placeholder="Patience on 15m breakout candles yields highest R multiple..." value={lessonLearned} onChange={(e) => setLessonLearned(e.target.value)} className="w-full bg-dark-bg border border-dark-border text-dark-text text-sm p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500" /></div>
          </div>
        </Card>
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-dark-border">
          <Button type="button" onClick={() => navigate(-1)} variant="secondary" size="lg">Cancel</Button>
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} icon={Save}>{isEdit ? 'Update Trade Log' : 'Save Trade Record'}</Button>
        </div>
      </form>
    </div>
  );
};
