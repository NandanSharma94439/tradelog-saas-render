import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const goals = await prisma.tradingGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ goals });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trading goals' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, targetValue, currentVal = 0, unit = 'trades', deadline, status = 'In Progress' } = req.body;

    if (!title || targetValue === undefined) {
      return res.status(400).json({ error: 'Title and target value are required' });
    }

    const goal = await prisma.tradingGoal.create({
      data: {
        userId,
        title,
        description,
        targetValue: Number(targetValue),
        currentVal: Number(currentVal),
        unit,
        deadline,
        status,
      },
    });

    return res.status(201).json({ goal });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create goal' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, targetValue, currentVal, unit, deadline, status } = req.body;

    const existing = await prisma.tradingGoal.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Goal not found' });

    const updated = await prisma.tradingGoal.update({
      where: { id },
      data: {
        title: title || existing.title,
        description: description !== undefined ? description : existing.description,
        targetValue: targetValue !== undefined ? Number(targetValue) : existing.targetValue,
        currentVal: currentVal !== undefined ? Number(currentVal) : existing.currentVal,
        unit: unit || existing.unit,
        deadline: deadline !== undefined ? deadline : existing.deadline,
        status: status || existing.status,
      },
    });

    return res.json({ goal: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update goal' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.tradingGoal.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Goal not found' });

    await prisma.tradingGoal.delete({ where: { id } });
    return res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
