import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import {
  calculateDashboardMetrics,
  calculateEquityCurve,
  calculateSetupAnalytics,
} from '../../src/utils/calculations.js';
import { Trade } from '../../src/types/index.js';

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/analytics/dashboard
 */
router.get('/dashboard', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const tradesRaw = await prisma.trade.findMany({
      where: { userId },
      include: { mistakes: true, screenshots: true },
      orderBy: { tradeDate: 'desc' },
    });

    const trades = tradesRaw as unknown as Trade[];

    const metrics = calculateDashboardMetrics(trades);
    const equityCurve = calculateEquityCurve(trades);
    const setupAnalytics = calculateSetupAnalytics(trades);
    const recentTrades = trades.slice(0, 7);

    // Group daily P&L for chart
    const dailyMap: Record<string, { date: string; pnl: number; count: number }> = {};
    const closedTrades = trades.filter((t) => t.status === 'Closed' && t.exitPrice !== null);

    for (const t of closedTrades) {
      if (!dailyMap[t.tradeDate]) {
        dailyMap[t.tradeDate] = { date: t.tradeDate, pnl: 0, count: 0 };
      }
      dailyMap[t.tradeDate].pnl += t.pnl;
      dailyMap[t.tradeDate].count += 1;
    }

    const dailyPnL = Object.values(dailyMap)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((d) => ({ ...d, pnl: Number(d.pnl.toFixed(2)) }));

    return res.json({
      metrics,
      equityCurve,
      dailyPnL,
      setupAnalytics,
      recentTrades,
    });
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    return res.status(500).json({ error: 'Failed to calculate dashboard analytics' });
  }
});

/**
 * GET /api/analytics/full
 */
router.get('/full', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const tradesRaw = await prisma.trade.findMany({
      where: { userId },
      include: { mistakes: true, screenshots: true },
      orderBy: { tradeDate: 'asc' },
    });

    const trades = tradesRaw as unknown as Trade[];
    const closedTrades = trades.filter((t) => t.status === 'Closed' && t.exitPrice !== null);

    const metrics = calculateDashboardMetrics(trades);
    const equityCurve = calculateEquityCurve(trades);
    const setupAnalytics = calculateSetupAnalytics(trades);

    // Emotion performance analytics
    const emotionMap: Record<string, { emotion: string; tradesCount: number; wins: number; totalPnl: number }> = {};
    
    for (const t of closedTrades) {
      const emotion = t.beforeEmotion || 'Unspecified';
      if (!emotionMap[emotion]) {
        emotionMap[emotion] = { emotion, tradesCount: 0, wins: 0, totalPnl: 0 };
      }
      emotionMap[emotion].tradesCount += 1;
      if (t.pnl > 0) emotionMap[emotion].wins += 1;
      emotionMap[emotion].totalPnl += t.pnl;
    }

    const emotionAnalytics = Object.values(emotionMap).map((e) => ({
      emotion: e.emotion,
      tradesCount: e.tradesCount,
      winRate: Number(((e.wins / e.tradesCount) * 100).toFixed(1)),
      avgPnl: Number((e.totalPnl / e.tradesCount).toFixed(2)),
      totalPnl: Number(e.totalPnl.toFixed(2)),
    }));

    // Day of week performance
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMap: Record<string, { day: string; pnl: number; count: number; wins: number }> = {};
    daysOfWeek.forEach((d) => (dayMap[d] = { day: d, pnl: 0, count: 0, wins: 0 }));

    for (const t of closedTrades) {
      const date = new Date(t.tradeDate);
      const dayName = daysOfWeek[date.getDay()];
      if (dayMap[dayName]) {
        dayMap[dayName].pnl += t.pnl;
        dayMap[dayName].count += 1;
        if (t.pnl > 0) dayMap[dayName].wins += 1;
      }
    }

    const dayOfWeekAnalytics = Object.values(dayMap).map((d) => ({
      ...d,
      pnl: Number(d.pnl.toFixed(2)),
      winRate: d.count > 0 ? Number(((d.wins / d.count) * 100).toFixed(1)) : 0,
    }));

    // Asset type breakdown
    const assetMap: Record<string, { assetType: string; pnl: number; count: number; wins: number }> = {};
    for (const t of closedTrades) {
      if (!assetMap[t.assetType]) {
        assetMap[t.assetType] = { assetType: t.assetType, pnl: 0, count: 0, wins: 0 };
      }
      assetMap[t.assetType].pnl += t.pnl;
      assetMap[t.assetType].count += 1;
      if (t.pnl > 0) assetMap[t.assetType].wins += 1;
    }

    const assetAnalytics = Object.values(assetMap).map((a) => ({
      ...a,
      pnl: Number(a.pnl.toFixed(2)),
      winRate: Number(((a.wins / a.count) * 100).toFixed(1)),
    }));

    // Long vs Short breakdown
    const longTrades = closedTrades.filter((t) => t.direction === 'Long');
    const shortTrades = closedTrades.filter((t) => t.direction === 'Short');

    const directionAnalytics = {
      long: {
        count: longTrades.length,
        winRate: longTrades.length > 0 ? Number(((longTrades.filter((t) => t.pnl > 0).length / longTrades.length) * 100).toFixed(1)) : 0,
        totalPnl: Number(longTrades.reduce((acc, t) => acc + t.pnl, 0).toFixed(2)),
        avgR: longTrades.length > 0 ? Number((longTrades.reduce((acc, t) => acc + t.rMultiple, 0) / longTrades.length).toFixed(2)) : 0,
      },
      short: {
        count: shortTrades.length,
        winRate: shortTrades.length > 0 ? Number(((shortTrades.filter((t) => t.pnl > 0).length / shortTrades.length) * 100).toFixed(1)) : 0,
        totalPnl: Number(shortTrades.reduce((acc, t) => acc + t.pnl, 0).toFixed(2)),
        avgR: shortTrades.length > 0 ? Number((shortTrades.reduce((acc, t) => acc + t.rMultiple, 0) / shortTrades.length).toFixed(2)) : 0,
      },
    };

    return res.json({
      metrics,
      equityCurve,
      setupAnalytics,
      emotionAnalytics,
      dayOfWeekAnalytics,
      assetAnalytics,
      directionAnalytics,
    });
  } catch (error) {
    console.error('Full analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch detailed analytics' });
  }
});

export default router;
