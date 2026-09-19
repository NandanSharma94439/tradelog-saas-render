export const DEMO_USER = {
  id: 'demo-trader-id-999',
  email: 'alex.trader@tradelog.io',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  defaultRiskPct: 1.0,
  defaultAsset: 'Stock',
  defaultQuantity: 100,
  subscriptionPlan: 'PRO',
};

export const DEMO_SETUPS = [
  { id: 's1', userId: DEMO_USER.id, name: 'Breakout', description: 'Resistance breakout with heavy relative volume expansion', createdAt: '2026-01-01' },
  { id: 's2', userId: DEMO_USER.id, name: 'Pullback', description: '20 EMA pullback in a strong structural trend', createdAt: '2026-01-01' },
  { id: 's3', userId: DEMO_USER.id, name: 'Support/Resistance', description: 'Bounce from key daily horizontal zone', createdAt: '2026-01-01' },
  { id: 's4', userId: DEMO_USER.id, name: 'Reversal', description: 'Exhaustion bar with RSI divergence at key level', createdAt: '2026-01-01' },
  { id: 's5', userId: DEMO_USER.id, name: 'Momentum', description: 'Opening range breakout scalar momentum', createdAt: '2026-01-01' },
];

export const DEMO_GOALS = [
  { id: 'g1', userId: DEMO_USER.id, title: 'Follow Trading Plan', description: 'Execute 30 consecutive trades adhering 100% to rules', targetValue: 30, currentVal: 24, unit: 'trades', deadline: '2026-10-15', status: 'In Progress', createdAt: '2026-09-01', updatedAt: '2026-09-18' },
  { id: 'g2', userId: DEMO_USER.id, title: 'Zero Revenge Trades', description: 'Maintain complete emotional composure after a stop loss', targetValue: 20, currentVal: 18, unit: 'trades', deadline: '2026-09-30', status: 'In Progress', createdAt: '2026-09-01', updatedAt: '2026-09-18' },
  { id: 'g3', userId: DEMO_USER.id, title: 'Achieve 2.0+ Profit Factor', description: 'Keep profit factor above 2.0 for the current month', targetValue: 2.0, currentVal: 2.18, unit: 'ratio', deadline: '2026-09-30', status: 'Achieved', createdAt: '2026-09-01', updatedAt: '2026-09-18' },
];

export const DEMO_TRADES = [
  {
    id: 't-001', userId: DEMO_USER.id, symbol: 'RELIANCE', assetType: 'Stock', direction: 'Long',
    entryPrice: 2850, exitPrice: 2940, quantity: 100, stopLoss: 2810, takeProfit: 2970, fees: 150,
    currency: 'INR', tradeDate: '2026-09-15', tradeTime: '09:30', status: 'Closed',
    setupId: 's1', setupName: 'Breakout', reason: 'Price broke 2840 horizontal daily resistance with 2.5x average 15-min volume.',
    beforeEmotion: 'Confident', duringEmotion: 'Calm', afterEmotion: 'Calm',
    confidence: 9, discipline: 9, stress: 2, pnl: 8850, riskAmount: 4000, rewardAmount: 12000,
    riskRewardRatio: 3.0, rMultiple: 2.21, returnPercentage: 3.11,
    reviewWentWell: 'Waited patiently for 15-minute candle close confirmation above resistance.',
    reviewWentWrong: 'Exited slightly before full take-profit target due to minor intraday consolidation.',
    lessonLearned: 'Patience on breakout setups yields high R multiples.', mistakes: [],
    screenshots: [{ id: 'sc1', tradeId: 't-001', type: 'before', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80', caption: '15m Breakout pattern at 2840', createdAt: '2026-09-15' }],
    createdAt: '2026-09-15T09:30:00Z', updatedAt: '2026-09-15T15:30:00Z'
  },
  {
    id: 't-002', userId: DEMO_USER.id, symbol: 'NIFTY50', assetType: 'Index', direction: 'Short',
    entryPrice: 25100, exitPrice: 24880, quantity: 50, stopLoss: 25200, takeProfit: 24800, fees: 200,
    currency: 'INR', tradeDate: '2026-09-14', tradeTime: '11:15', status: 'Closed',
    setupId: 's4', setupName: 'Reversal', reason: 'Bearish engulfing on 1-hour timeframe following RSI bearish divergence at ATH.',
    beforeEmotion: 'Calm', duringEmotion: 'Calm', afterEmotion: 'Confident',
    confidence: 8, discipline: 10, stress: 3, pnl: 10800, riskAmount: 5000, rewardAmount: 15000,
    riskRewardRatio: 3.0, rMultiple: 2.16, returnPercentage: 0.86,
    reviewWentWell: 'Honored stop loss level perfectly, trailed stop behind 20 EMA.',
    reviewWentWrong: 'None, trade executed strictly per system guidelines.',
    lessonLearned: 'RSI divergence at major structural levels continues to give high win rate.',
    mistakes: [], screenshots: [], createdAt: '2026-09-14T11:15:00Z', updatedAt: '2026-09-14T15:00:00Z'
  },
  {
    id: 't-003', userId: DEMO_USER.id, symbol: 'TATAMOTORS', assetType: 'Stock', direction: 'Long',
    entryPrice: 980, exitPrice: 955, quantity: 200, stopLoss: 960, takeProfit: 1020, fees: 100,
    currency: 'INR', tradeDate: '2026-09-12', tradeTime: '10:00', status: 'Closed',
    setupId: 's1', setupName: 'Breakout', reason: 'Entered anticipatory breakout before candle close.',
    beforeEmotion: 'FOMO', duringEmotion: 'Fearful', afterEmotion: 'Angry',
    confidence: 4, discipline: 3, stress: 8, pnl: -5100, riskAmount: 4000, rewardAmount: 8000,
    riskRewardRatio: 2.0, rMultiple: -1.28, returnPercentage: -2.60,
    reviewWentWell: 'Cut trade when stop loss was hit.',
    reviewWentWrong: 'Jumped in due to FOMO before candle close. Moved stop loss down by 5 points during trade.',
    lessonLearned: 'Never enter before candle close confirmation. Respect stop loss strictly.',
    mistakes: [{ id: 'm1', tradeId: 't-003', mistake: 'Entered too early' }, { id: 'm2', tradeId: 't-003', mistake: 'FOMO' }, { id: 'm3', tradeId: 't-003', mistake: 'Moved stop loss' }],
    screenshots: [], createdAt: '2026-09-12T10:00:00Z', updatedAt: '2026-09-12T14:00:00Z'
  },
  {
    id: 't-004', userId: DEMO_USER.id, symbol: 'BANKNIFTY', assetType: 'Index', direction: 'Long',
    entryPrice: 51800, exitPrice: 52350, quantity: 30, stopLoss: 51550, takeProfit: 52400, fees: 250,
    currency: 'INR', tradeDate: '2026-09-11', tradeTime: '13:45', status: 'Closed',
    setupId: 's2', setupName: 'Pullback', reason: 'Bounce from 50 EMA on 15m chart during strong daily uptrend.',
    beforeEmotion: 'Calm', duringEmotion: 'Confident', afterEmotion: 'Calm',
    confidence: 9, discipline: 9, stress: 2, pnl: 16250, riskAmount: 7500, rewardAmount: 18000,
    riskRewardRatio: 2.4, rMultiple: 2.17, returnPercentage: 1.05,
    reviewWentWell: 'Waited for pullback test of 50 EMA.', reviewWentWrong: 'Slightly high brokerage due to lot sizing.',
    lessonLearned: 'Trend continuation pullbacks remain the highest expectancy setup.',
    mistakes: [], screenshots: [], createdAt: '2026-09-11T13:45:00Z', updatedAt: '2026-09-11T15:15:00Z'
  },
  {
    id: 't-005', userId: DEMO_USER.id, symbol: 'INFY', assetType: 'Stock', direction: 'Short',
    entryPrice: 1920, exitPrice: 1875, quantity: 150, stopLoss: 1940, takeProfit: 1860, fees: 120,
    currency: 'INR', tradeDate: '2026-09-09', tradeTime: '09:45', status: 'Closed',
    setupId: 's3', setupName: 'Support/Resistance', reason: 'Breakdown of intraday consolidation after weak tech earnings guidance.',
    beforeEmotion: 'Confident', duringEmotion: 'Calm', afterEmotion: 'Confident',
    confidence: 8, discipline: 9, stress: 3, pnl: 6630, riskAmount: 3000, rewardAmount: 9000,
    riskRewardRatio: 3.0, rMultiple: 2.21, returnPercentage: 2.30,
    reviewWentWell: 'Clean execution with smooth downward momentum.', reviewWentWrong: 'None.',
    lessonLearned: 'Aligning intraday setups with fundamental catalysts boosts win rate.',
    mistakes: [], screenshots: [], createdAt: '2026-09-09T09:45:00Z', updatedAt: '2026-09-09T14:30:00Z'
  },
  {
    id: 't-006', userId: DEMO_USER.id, symbol: 'BTCUSD', assetType: 'Crypto', direction: 'Long',
    entryPrice: 62500, exitPrice: 64800, quantity: 0.5, stopLoss: 61200, takeProfit: 65000, fees: 40,
    currency: 'USD', tradeDate: '2026-09-07', tradeTime: '16:00', status: 'Closed',
    setupId: 's1', setupName: 'Breakout', reason: '4-hour bull flag breakout above 62.4k resistance.',
    beforeEmotion: 'Confident', duringEmotion: 'Calm', afterEmotion: 'Confident',
    confidence: 9, discipline: 10, stress: 2, pnl: 1110, riskAmount: 650, rewardAmount: 1250,
    riskRewardRatio: 1.92, rMultiple: 1.71, returnPercentage: 3.55,
    reviewWentWell: 'Target hit within 18 hours clean trending price action.',
    reviewWentWrong: 'Slight slip on limit entry order.',
    lessonLearned: 'Crypto bull flags on 4h timeframe work exceptionally well.',
    mistakes: [], screenshots: [], createdAt: '2026-09-07T16:00:00Z', updatedAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 't-007', userId: DEMO_USER.id, symbol: 'EURUSD', assetType: 'Forex', direction: 'Short',
    entryPrice: 1.1050, exitPrice: 1.1085, quantity: 100000, stopLoss: 1.1080, takeProfit: 1.0980, fees: 15,
    currency: 'USD', tradeDate: '2026-09-05', tradeTime: '14:30', status: 'Closed',
    setupId: 's5', setupName: 'Momentum', reason: 'Faded initial spike during ECB interest rate press release.',
    beforeEmotion: 'Excited', duringEmotion: 'Fearful', afterEmotion: 'Angry',
    confidence: 5, discipline: 4, stress: 9, pnl: -365, riskAmount: 300, rewardAmount: 700,
    riskRewardRatio: 2.33, rMultiple: -1.22, returnPercentage: -0.33,
    reviewWentWell: 'Accepted loss quickly.', reviewWentWrong: 'Traded during high volatility news release without clear structural setup.',
    lessonLearned: 'Avoid news gambling. Wait 15 mins post release before taking positions.',
    mistakes: [{ id: 'm4', tradeId: 't-007', mistake: 'Ignored setup rules' }, { id: 'm5', tradeId: 't-007', mistake: 'Overtrading' }],
    screenshots: [], createdAt: '2026-09-05T14:30:00Z', updatedAt: '2026-09-05T15:00:00Z'
  },
  {
    id: 't-008', userId: DEMO_USER.id, symbol: 'HDFCBANK', assetType: 'Stock', direction: 'Long',
    entryPrice: 1650, exitPrice: 1710, quantity: 120, stopLoss: 1630, takeProfit: 1720, fees: 100,
    currency: 'INR', tradeDate: '2026-09-03', tradeTime: '10:15', status: 'Closed',
    setupId: 's2', setupName: 'Pullback', reason: 'Double bottom retest of 1630 support level on daily chart.',
    beforeEmotion: 'Calm', duringEmotion: 'Calm', afterEmotion: 'Confident',
    confidence: 8, discipline: 9, stress: 2, pnl: 7100, riskAmount: 2400, rewardAmount: 8400,
    riskRewardRatio: 3.5, rMultiple: 2.96, returnPercentage: 3.59,
    reviewWentWell: 'Patience paying off.', reviewWentWrong: 'None.',
    lessonLearned: 'Higher timeframe support retests have excellent R:R.',
    mistakes: [], screenshots: [], createdAt: '2026-09-03T10:15:00Z', updatedAt: '2026-09-04T15:30:00Z'
  },
];

/**
 * Generates full seed trades for demo user
 * @param {string} userId
 * @returns {Array}
 */
export function generateFullSeedTrades(userId) {
  const baseTrades = DEMO_TRADES.map(t => ({ ...t, userId }));

  const additionalSymbols = [
    { symbol: 'ICICIBANK', asset: 'Stock', type: 'Long', basePrice: 1200 },
    { symbol: 'AXISBANK', asset: 'Stock', type: 'Short', basePrice: 1150 },
    { symbol: 'TCS', asset: 'Stock', type: 'Long', basePrice: 4200 },
    { symbol: 'CRUDEOIL', asset: 'Commodity', type: 'Short', basePrice: 6100 },
    { symbol: 'GOLD', asset: 'Commodity', type: 'Long', basePrice: 72000 },
    { symbol: 'ETHUSD', asset: 'Crypto', type: 'Long', basePrice: 2600 },
    { symbol: 'SOLUSD', asset: 'Crypto', type: 'Short', basePrice: 140 },
    { symbol: 'GBPUSD', asset: 'Forex', type: 'Long', basePrice: 1.31 },
  ];

  const setups = ['Breakout', 'Pullback', 'Support/Resistance', 'Reversal', 'Momentum'];
  const emotions = ['Calm', 'Confident', 'Fearful', 'FOMO', 'Neutral', 'Calm', 'Confident'];
  const generated = [];
  const startDate = new Date('2026-07-01');

  for (let i = 1; i <= 25; i++) {
    const symObj = additionalSymbols[i % additionalSymbols.length];
    const isWin = i % 3 !== 0;
    const setupName = setups[i % setups.length];
    const emotion = emotions[i % emotions.length];
    const tradeDate = new Date(startDate.getTime() + i * 2.5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const quantity = symObj.asset === 'Forex' ? 100000 : symObj.asset === 'Crypto' ? 2 : 100;
    const entry = symObj.basePrice;

    let exit = entry, stop = entry, target = entry;
    if (symObj.type === 'Long') {
      stop = entry * 0.98; target = entry * 1.05; exit = isWin ? entry * 1.035 : entry * 0.978;
    } else {
      stop = entry * 1.02; target = entry * 0.95; exit = isWin ? entry * 0.965 : entry * 1.022;
    }

    const fees = 50;
    const riskAmount = Math.abs(entry - stop) * quantity;
    const rewardAmount = Math.abs(target - entry) * quantity;
    const rawPnl = symObj.type === 'Long' ? (exit - entry) * quantity - fees : (entry - exit) * quantity - fees;
    const pnl = Number(rawPnl.toFixed(2));
    const rMultiple = Number((pnl / (riskAmount || 1)).toFixed(2));
    const returnPercentage = Number(((pnl / (entry * quantity)) * 100).toFixed(2));
    const mistakesList = !isWin && emotion === 'FOMO'
      ? [{ id: `gen-m-${i}`, tradeId: `t-gen-${i}`, mistake: 'FOMO' }, { id: `gen-m2-${i}`, tradeId: `t-gen-${i}`, mistake: 'Entered too early' }]
      : [];

    generated.push({
      id: `t-gen-${i}`, userId, symbol: symObj.symbol, assetType: symObj.asset, direction: symObj.type,
      entryPrice: entry, exitPrice: exit, quantity,
      stopLoss: Number(stop.toFixed(2)), takeProfit: Number(target.toFixed(2)), fees,
      currency: symObj.asset === 'Forex' || symObj.asset === 'Crypto' ? 'USD' : 'INR',
      tradeDate, tradeTime: '10:30', status: 'Closed', setupName,
      reason: `Historical backfilled journal record for ${setupName} setup on ${symObj.symbol}.`,
      beforeEmotion: emotion, duringEmotion: 'Calm', afterEmotion: isWin ? 'Confident' : 'Neutral',
      confidence: 8, discipline: isWin ? 9 : 6, stress: isWin ? 2 : 5,
      pnl, riskAmount: Number(riskAmount.toFixed(2)), rewardAmount: Number(rewardAmount.toFixed(2)),
      riskRewardRatio: Number((rewardAmount / (riskAmount || 1)).toFixed(2)), rMultiple, returnPercentage,
      reviewWentWell: isWin ? 'Strict adherence to strategy.' : 'Managed risk reasonably.',
      reviewWentWrong: isWin ? 'Slightly early exit.' : 'Sub-optimal entry timing.',
      lessonLearned: 'Keep sizing consistent across all market conditions.',
      mistakes: mistakesList, screenshots: [],
      createdAt: `${tradeDate}T10:30:00Z`, updatedAt: `${tradeDate}T15:30:00Z`,
    });
  }

  return [...baseTrades, ...generated];
}
