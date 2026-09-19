/**
 * Calculates live P&L, Risk, Reward, Risk/Reward ratio, R Multiple, and Return % for a given trade draft.
 * @param {{ direction: string, entryPrice: number, exitPrice?: number|null, quantity: number, stopLoss: number, takeProfit: number, fees?: number }} params
 */
export function calculateTradeMetrics(params) {
  const { direction, entryPrice, exitPrice, quantity, stopLoss, takeProfit, fees = 0 } = params;

  if (!entryPrice || entryPrice <= 0 || !quantity || quantity <= 0) {
    return { pnl: 0, riskAmount: 0, rewardAmount: 0, riskRewardRatio: 0, rMultiple: 0, returnPercentage: 0 };
  }

  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const riskAmount = riskPerShare * quantity;
  const rewardPerShare = Math.abs(takeProfit - entryPrice);
  const rewardAmount = rewardPerShare * quantity;
  const riskRewardRatio = riskAmount > 0 ? Number((rewardAmount / riskAmount).toFixed(2)) : 0;

  let rawPnl = 0;
  if (exitPrice !== undefined && exitPrice !== null && exitPrice > 0) {
    if (direction === 'Long') {
      rawPnl = (exitPrice - entryPrice) * quantity;
    } else {
      rawPnl = (entryPrice - exitPrice) * quantity;
    }
    rawPnl -= fees;
  }

  const pnl = Number(rawPnl.toFixed(2));
  const rMultiple = riskAmount > 0 ? Number((pnl / riskAmount).toFixed(2)) : 0;
  const capitalBasis = entryPrice * quantity;
  const returnPercentage = capitalBasis > 0 ? Number(((pnl / capitalBasis) * 100).toFixed(2)) : 0;

  return {
    pnl,
    riskAmount: Number(riskAmount.toFixed(2)),
    rewardAmount: Number(rewardAmount.toFixed(2)),
    riskRewardRatio,
    rMultiple,
    returnPercentage,
  };
}

/**
 * Computes complete aggregate metrics (KPIs) from an array of trades.
 * @param {Array} trades
 */
export function calculateDashboardMetrics(trades) {
  const closedTrades = trades.filter((t) => t.status === 'Closed' && t.exitPrice !== null && t.exitPrice !== undefined);
  const openTrades = trades.filter((t) => t.status === 'Open');

  if (closedTrades.length === 0) {
    return {
      totalPnl: 0, winRate: 0, lossRate: 0, profitFactor: 0,
      totalTrades: trades.length, closedTradesCount: 0, openTradesCount: openTrades.length,
      avgR: 0, maxDrawdown: 0, avgWin: 0, avgLoss: 0, expectancy: 0,
      largestWin: 0, largestLoss: 0, winningStreak: 0, losingStreak: 0,
    };
  }

  const winningTrades = closedTrades.filter((t) => t.pnl > 0);
  const losingTrades = closedTrades.filter((t) => t.pnl < 0);
  const totalPnl = closedTrades.reduce((acc, t) => acc + t.pnl, 0);
  const grossProfit = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0));
  const winRate = Number(((winningTrades.length / closedTrades.length) * 100).toFixed(1));
  const lossRate = Number(((losingTrades.length / closedTrades.length) * 100).toFixed(1));

  let profitFactor = 0;
  if (grossLoss === 0) profitFactor = grossProfit > 0 ? 99.99 : 0;
  else profitFactor = Number((grossProfit / grossLoss).toFixed(2));

  const avgWin = winningTrades.length > 0 ? Number((grossProfit / winningTrades.length).toFixed(2)) : 0;
  const avgLoss = losingTrades.length > 0 ? Number((grossLoss / losingTrades.length).toFixed(2)) : 0;
  const expectancy = Number(((winRate / 100) * avgWin - (lossRate / 100) * avgLoss).toFixed(2));
  const totalR = closedTrades.reduce((acc, t) => acc + t.rMultiple, 0);
  const avgR = Number((totalR / closedTrades.length).toFixed(2));

  let currentWinningStreak = 0, maxWinningStreak = 0;
  let currentLosingStreak = 0, maxLosingStreak = 0;

  const sortedTrades = [...closedTrades].sort(
    (a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  );

  for (const t of sortedTrades) {
    if (t.pnl > 0) {
      currentWinningStreak++;
      currentLosingStreak = 0;
      if (currentWinningStreak > maxWinningStreak) maxWinningStreak = currentWinningStreak;
    } else if (t.pnl < 0) {
      currentLosingStreak++;
      currentWinningStreak = 0;
      if (currentLosingStreak > maxLosingStreak) maxLosingStreak = currentLosingStreak;
    }
  }

  let cumulativePnl = 0, peakEquity = 0, maxDrawdownValue = 0;
  for (const t of sortedTrades) {
    cumulativePnl += t.pnl;
    if (cumulativePnl > peakEquity) peakEquity = cumulativePnl;
    const drawdown = peakEquity > 0 ? ((peakEquity - cumulativePnl) / peakEquity) * 100 : 0;
    if (drawdown > maxDrawdownValue) maxDrawdownValue = drawdown;
  }

  const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map((t) => t.pnl)) : 0;
  const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map((t) => t.pnl)) : 0;

  return {
    totalPnl: Number(totalPnl.toFixed(2)), winRate, lossRate, profitFactor,
    totalTrades: trades.length, closedTradesCount: closedTrades.length,
    openTradesCount: openTrades.length, avgR, maxDrawdown: Number(maxDrawdownValue.toFixed(1)),
    avgWin, avgLoss: Number(avgLoss.toFixed(2)), expectancy,
    largestWin: Number(largestWin.toFixed(2)), largestLoss: Number(largestLoss.toFixed(2)),
    winningStreak: maxWinningStreak, losingStreak: maxLosingStreak,
  };
}

/**
 * Calculates cumulative equity curve data points for charting.
 * @param {Array} trades
 */
export function calculateEquityCurve(trades) {
  const closedTrades = trades
    .filter((t) => t.status === 'Closed' && t.exitPrice !== null && t.exitPrice !== undefined)
    .sort((a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime());

  if (closedTrades.length === 0) return [];

  let cumulative = 0;
  const curve = [];
  for (const t of closedTrades) {
    cumulative += t.pnl;
    curve.push({ date: t.tradeDate, pnl: t.pnl, cumulative: Number(cumulative.toFixed(2)), symbol: t.symbol });
  }
  return curve;
}

/**
 * Groups performance metrics by trading setup.
 * @param {Array} trades
 */
export function calculateSetupAnalytics(trades) {
  const closedTrades = trades.filter((t) => t.status === 'Closed');
  const groups = {};

  for (const t of closedTrades) {
    const setupName = t.setupName || 'Unassigned';
    if (!groups[setupName]) groups[setupName] = [];
    groups[setupName].push(t);
  }

  return Object.entries(groups).map(([setupName, setupTrades]) => {
    const wins = setupTrades.filter((t) => t.pnl > 0);
    const losses = setupTrades.filter((t) => t.pnl < 0);
    const totalPnl = setupTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
    const avgR = setupTrades.reduce((sum, t) => sum + t.rMultiple, 0) / setupTrades.length;
    let profitFactor = 0;
    if (grossLoss === 0) profitFactor = grossProfit > 0 ? 99.99 : 0;
    else profitFactor = Number((grossProfit / grossLoss).toFixed(2));
    return {
      setupName, tradesCount: setupTrades.length,
      winRate: Number(((wins.length / setupTrades.length) * 100).toFixed(1)),
      avgR: Number(avgR.toFixed(2)), totalPnl: Number(totalPnl.toFixed(2)), profitFactor,
    };
  });
}
