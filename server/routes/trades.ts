import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateTradeMetrics } from '../../src/utils/calculations.js';

const router = Router();

// Apply auth middleware to all trade routes
router.use(authMiddleware);

/**
 * GET /api/trades
 * Fetches user-isolated trades with search, filtering, and sorting
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      search,
      symbol,
      direction,
      assetType,
      setup,
      result,
      emotion,
      mistake,
      sortBy = 'newest',
      startDate,
      endDate,
    } = req.query;

    const whereClause: any = { userId };

    if (symbol) {
      whereClause.symbol = { contains: String(symbol) };
    }

    if (direction && direction !== 'All') {
      whereClause.direction = String(direction);
    }

    if (assetType && assetType !== 'All') {
      whereClause.assetType = String(assetType);
    }

    if (setup && setup !== 'All') {
      whereClause.setupName = String(setup);
    }

    if (emotion && emotion !== 'All') {
      whereClause.OR = [
        { beforeEmotion: String(emotion) },
        { duringEmotion: String(emotion) },
        { afterEmotion: String(emotion) },
      ];
    }

    if (mistake && mistake !== 'All') {
      whereClause.mistakes = {
        some: { mistake: String(mistake) },
      };
    }

    if (result && result !== 'All') {
      if (result === 'Win') {
        whereClause.pnl = { gt: 0 };
      } else if (result === 'Loss') {
        whereClause.pnl = { lt: 0 };
      } else if (result === 'BreakEven') {
        whereClause.pnl = 0;
      }
    }

    if (startDate || endDate) {
      whereClause.tradeDate = {};
      if (startDate) whereClause.tradeDate.gte = String(startDate);
      if (endDate) whereClause.tradeDate.lte = String(endDate);
    }

    if (search) {
      const q = String(search).toLowerCase();
      whereClause.OR = [
        { symbol: { contains: q } },
        { setupName: { contains: q } },
        { reason: { contains: q } },
        { reviewWentWell: { contains: q } },
        { reviewWentWrong: { contains: q } },
        { lessonLearned: { contains: q } },
      ];
    }

    let orderBy: any = { tradeDate: 'desc' };
    if (sortBy === 'oldest') orderBy = { tradeDate: 'asc' };
    else if (sortBy === 'highest_pnl') orderBy = { pnl: 'desc' };
    else if (sortBy === 'lowest_pnl') orderBy = { pnl: 'asc' };
    else if (sortBy === 'highest_r') orderBy = { rMultiple: 'desc' };
    else if (sortBy === 'lowest_r') orderBy = { rMultiple: 'asc' };

    const trades = await prisma.trade.findMany({
      where: whereClause,
      include: {
        mistakes: true,
        screenshots: true,
      },
      orderBy,
    });

    return res.json({ trades });
  } catch (error) {
    console.error('Fetch trades error:', error);
    return res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

/**
 * GET /api/trades/:id
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const trade = await prisma.trade.findFirst({
      where: { id, userId },
      include: {
        mistakes: true,
        screenshots: true,
      },
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    return res.json({ trade });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trade detail' });
  }
});

/**
 * POST /api/trades
 * Creates a new trade record with automatic server-side P&L & R-multiple calculation
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      symbol,
      assetType,
      direction,
      entryPrice,
      exitPrice,
      quantity,
      stopLoss,
      takeProfit,
      fees = 0,
      currency = 'INR',
      tradeDate,
      tradeTime,
      status = 'Closed',
      setupName,
      reason,
      beforeEmotion,
      duringEmotion,
      afterEmotion,
      confidence = 5,
      discipline = 5,
      stress = 5,
      reviewWentWell,
      reviewWentWrong,
      lessonLearned,
      mistakes = [],
      screenshots = [],
    } = req.body;

    if (!symbol || !assetType || !direction || !entryPrice || !quantity || !stopLoss || !takeProfit || !tradeDate) {
      return res.status(400).json({ error: 'Please provide all required trade fields (Symbol, Entry, Stop Loss, Target, Quantity, Date)' });
    }

    // Server side metric calculation
    const calculated = calculateTradeMetrics({
      direction,
      entryPrice: Number(entryPrice),
      exitPrice: exitPrice ? Number(exitPrice) : null,
      quantity: Number(quantity),
      stopLoss: Number(stopLoss),
      takeProfit: Number(takeProfit),
      fees: Number(fees),
    });

    const trade = await prisma.trade.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        assetType,
        direction,
        entryPrice: Number(entryPrice),
        exitPrice: exitPrice ? Number(exitPrice) : null,
        quantity: Number(quantity),
        stopLoss: Number(stopLoss),
        takeProfit: Number(takeProfit),
        fees: Number(fees),
        currency,
        tradeDate,
        tradeTime: tradeTime || null,
        status: exitPrice ? 'Closed' : status,
        setupName,
        reason,
        beforeEmotion,
        duringEmotion,
        afterEmotion,
        confidence: Number(confidence),
        discipline: Number(discipline),
        stress: Number(stress),
        pnl: calculated.pnl,
        riskAmount: calculated.riskAmount,
        rewardAmount: calculated.rewardAmount,
        riskRewardRatio: calculated.riskRewardRatio,
        rMultiple: calculated.rMultiple,
        returnPercentage: calculated.returnPercentage,
        reviewWentWell,
        reviewWentWrong,
        lessonLearned,
        mistakes: {
          create: mistakes.map((m: string) => ({ mistake: m })),
        },
        screenshots: {
          create: screenshots.map((sc: { type: string; url: string; caption?: string }) => ({
            type: sc.type,
            url: sc.url,
            caption: sc.caption,
          })),
        },
      },
      include: {
        mistakes: true,
        screenshots: true,
      },
    });

    return res.status(201).json({ trade });
  } catch (error) {
    console.error('Create trade error:', error);
    return res.status(500).json({ error: 'Failed to create trade record' });
  }
});

/**
 * PUT /api/trades/:id
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.trade.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    const {
      symbol,
      assetType,
      direction,
      entryPrice,
      exitPrice,
      quantity,
      stopLoss,
      takeProfit,
      fees = 0,
      currency,
      tradeDate,
      tradeTime,
      status,
      setupName,
      reason,
      beforeEmotion,
      duringEmotion,
      afterEmotion,
      confidence,
      discipline,
      stress,
      reviewWentWell,
      reviewWentWrong,
      lessonLearned,
      mistakes = [],
      screenshots = [],
    } = req.body;

    const calculated = calculateTradeMetrics({
      direction: direction || existing.direction,
      entryPrice: Number(entryPrice || existing.entryPrice),
      exitPrice: exitPrice !== undefined ? (exitPrice ? Number(exitPrice) : null) : existing.exitPrice,
      quantity: Number(quantity || existing.quantity),
      stopLoss: Number(stopLoss || existing.stopLoss),
      takeProfit: Number(takeProfit || existing.takeProfit),
      fees: Number(fees !== undefined ? fees : existing.fees),
    });

    // Reset mistakes & screenshots for clean update
    await prisma.tradeMistake.deleteMany({ where: { tradeId: id } });
    await prisma.tradeScreenshot.deleteMany({ where: { tradeId: id } });

    const updatedTrade = await prisma.trade.update({
      where: { id },
      data: {
        symbol: symbol ? symbol.toUpperCase() : existing.symbol,
        assetType: assetType || existing.assetType,
        direction: direction || existing.direction,
        entryPrice: entryPrice ? Number(entryPrice) : existing.entryPrice,
        exitPrice: exitPrice !== undefined ? (exitPrice ? Number(exitPrice) : null) : existing.exitPrice,
        quantity: quantity ? Number(quantity) : existing.quantity,
        stopLoss: stopLoss ? Number(stopLoss) : existing.stopLoss,
        takeProfit: takeProfit ? Number(takeProfit) : existing.takeProfit,
        fees: fees !== undefined ? Number(fees) : existing.fees,
        currency: currency || existing.currency,
        tradeDate: tradeDate || existing.tradeDate,
        tradeTime: tradeTime !== undefined ? tradeTime : existing.tradeTime,
        status: exitPrice ? 'Closed' : status || existing.status,
        setupName,
        reason,
        beforeEmotion,
        duringEmotion,
        afterEmotion,
        confidence: confidence ? Number(confidence) : existing.confidence,
        discipline: discipline ? Number(discipline) : existing.discipline,
        stress: stress ? Number(stress) : existing.stress,
        pnl: calculated.pnl,
        riskAmount: calculated.riskAmount,
        rewardAmount: calculated.rewardAmount,
        riskRewardRatio: calculated.riskRewardRatio,
        rMultiple: calculated.rMultiple,
        returnPercentage: calculated.returnPercentage,
        reviewWentWell,
        reviewWentWrong,
        lessonLearned,
        mistakes: {
          create: mistakes.map((m: string) => ({ mistake: m })),
        },
        screenshots: {
          create: screenshots.map((sc: { type: string; url: string; caption?: string }) => ({
            type: sc.type,
            url: sc.url,
            caption: sc.caption,
          })),
        },
      },
      include: {
        mistakes: true,
        screenshots: true,
      },
    });

    return res.json({ trade: updatedTrade });
  } catch (error) {
    console.error('Update trade error:', error);
    return res.status(500).json({ error: 'Failed to update trade record' });
  }
});

/**
 * DELETE /api/trades/:id
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.trade.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    await prisma.trade.delete({ where: { id } });

    return res.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete trade' });
  }
});

export default router;
