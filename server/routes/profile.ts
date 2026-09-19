import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        currency: user.currency,
        timezone: user.timezone,
        defaultRiskPct: user.defaultRiskPct,
        defaultAsset: user.defaultAsset,
        defaultQuantity: user.defaultQuantity,
        subscriptionPlan: user.subscription?.plan || 'FREE',
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, currency, timezone, defaultRiskPct, defaultAsset, defaultQuantity, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(currency && { currency }),
        ...(timezone && { timezone }),
        ...(defaultRiskPct !== undefined && { defaultRiskPct: Number(defaultRiskPct) }),
        ...(defaultAsset && { defaultAsset }),
        ...(defaultQuantity !== undefined && { defaultQuantity: Number(defaultQuantity) }),
        ...(avatar !== undefined && { avatar }),
      },
      include: { subscription: true },
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        currency: user.currency,
        timezone: user.timezone,
        defaultRiskPct: user.defaultRiskPct,
        defaultAsset: user.defaultAsset,
        defaultQuantity: user.defaultQuantity,
        subscriptionPlan: user.subscription?.plan || 'FREE',
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * DELETE /api/profile
 * Deletes user account and cascade deletes all user trades, screenshots, mistakes, and goals.
 */
router.delete('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    await prisma.user.delete({ where: { id: userId } });
    return res.json({ message: 'Account and associated data deleted permanently' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
