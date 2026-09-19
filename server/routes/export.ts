import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/csv', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const trades = await prisma.trade.findMany({
      where: { userId },
      include: { mistakes: true },
      orderBy: { tradeDate: 'desc' },
    });

    const headers = [
      'Trade ID',
      'Date',
      'Time',
      'Symbol',
      'Asset Type',
      'Direction',
      'Status',
      'Entry Price',
      'Exit Price',
      'Quantity',
      'Stop Loss',
      'Take Profit',
      'Fees',
      'Currency',
      'P&L',
      'R Multiple',
      'Risk Amount',
      'Reward Amount',
      'Risk/Reward Ratio',
      'Return %',
      'Setup',
      'Emotion Before',
      'Emotion During',
      'Emotion After',
      'Mistakes',
      'Reason',
      'Lesson Learned',
    ];

    const csvRows = [headers.join(',')];

    for (const t of trades) {
      const mistakesStr = (t.mistakes || []).map((m) => m.mistake).join('; ');
      const cleanReason = (t.reason || '').replace(/"/g, '""');
      const cleanLesson = (t.lessonLearned || '').replace(/"/g, '""');

      const row = [
        `"${t.id}"`,
        `"${t.tradeDate}"`,
        `"${t.tradeTime || ''}"`,
        `"${t.symbol}"`,
        `"${t.assetType}"`,
        `"${t.direction}"`,
        `"${t.status}"`,
        t.entryPrice,
        t.exitPrice ?? '',
        t.quantity,
        t.stopLoss,
        t.takeProfit,
        t.fees,
        `"${t.currency}"`,
        t.pnl,
        t.rMultiple,
        t.riskAmount,
        t.rewardAmount,
        t.riskRewardRatio,
        t.returnPercentage,
        `"${t.setupName || ''}"`,
        `"${t.beforeEmotion || ''}"`,
        `"${t.duringEmotion || ''}"`,
        `"${t.afterEmotion || ''}"`,
        `"${mistakesStr}"`,
        `"${cleanReason}"`,
        `"${cleanLesson}"`,
      ];

      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=TradeLog_Export_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    return res.status(500).json({ error: 'Failed to generate CSV export' });
  }
});

export default router;
