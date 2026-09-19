import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { generateFullSeedTrades, DEMO_SETUPS, DEMO_GOALS } from '../../src/utils/mockData.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tradelog_secret_key_2026';

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, currency = 'INR', defaultAsset = 'Stock' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        currency,
        defaultAsset,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({
      token,
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
        subscriptionPlan: 'FREE',
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      token,
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
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * POST /api/auth/demo
 * Creates or retrieves demo user with sample trades, setups, and goals pre-populated.
 */
router.post('/demo', async (req, res) => {
  try {
    const demoEmail = 'demo@tradelog.io';
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
      include: { subscription: true },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash('DemoPass123!', 10);
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          passwordHash,
          name: 'Alex Rivera (Demo)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          currency: 'INR',
          subscription: {
            create: {
              plan: 'PRO',
              status: 'ACTIVE',
            },
          },
        },
        include: { subscription: true },
      });

      // Seed setups
      for (const s of DEMO_SETUPS) {
        await prisma.setup.create({
          data: {
            userId: user.id,
            name: s.name,
            description: s.description,
          },
        });
      }

      // Seed goals
      for (const g of DEMO_GOALS) {
        await prisma.tradingGoal.create({
          data: {
            userId: user.id,
            title: g.title,
            description: g.description,
            targetValue: g.targetValue,
            currentVal: g.currentVal,
            unit: g.unit,
            deadline: g.deadline,
            status: g.status,
          },
        });
      }

      // Seed trades
      const fullTrades = generateFullSeedTrades(user.id);
      for (const t of fullTrades) {
        await prisma.trade.create({
          data: {
            userId: user.id,
            symbol: t.symbol,
            assetType: t.assetType,
            direction: t.direction,
            entryPrice: t.entryPrice,
            exitPrice: t.exitPrice,
            quantity: t.quantity,
            stopLoss: t.stopLoss,
            takeProfit: t.takeProfit,
            fees: t.fees,
            currency: t.currency,
            tradeDate: t.tradeDate,
            tradeTime: t.tradeTime,
            status: t.status,
            setupName: t.setupName,
            reason: t.reason,
            beforeEmotion: t.beforeEmotion,
            duringEmotion: t.duringEmotion,
            afterEmotion: t.afterEmotion,
            confidence: t.confidence,
            discipline: t.discipline,
            stress: t.stress,
            pnl: t.pnl,
            riskAmount: t.riskAmount,
            rewardAmount: t.rewardAmount,
            riskRewardRatio: t.riskRewardRatio,
            rMultiple: t.rMultiple,
            returnPercentage: t.returnPercentage,
            reviewWentWell: t.reviewWentWell,
            reviewWentWrong: t.reviewWentWrong,
            lessonLearned: t.lessonLearned,
            mistakes: {
              create: (t.mistakes || []).map((m) => ({ mistake: m.mistake })),
            },
            screenshots: {
              create: (t.screenshots || []).map((sc) => ({
                type: sc.type,
                url: sc.url,
                caption: sc.caption,
              })),
            },
          },
        });
      }
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      token,
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
        subscriptionPlan: user.subscription?.plan || 'PRO',
      },
      isDemo: true,
    });
  } catch (error) {
    console.error('Demo auth error:', error);
    return res.status(500).json({ error: 'Server error initializing demo mode' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { subscription: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
    return res.status(500).json({ error: 'Error fetching user profile' });
  }
});

export default router;
