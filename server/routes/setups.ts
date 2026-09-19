import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const setups = await prisma.setup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ setups });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch setups' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Setup name is required' });
    }

    const setup = await prisma.setup.create({
      data: {
        userId,
        name,
        description,
      },
    });

    return res.status(201).json({ setup });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create setup' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.setup.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Setup not found' });

    await prisma.setup.delete({ where: { id } });
    return res.json({ message: 'Setup deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete setup' });
  }
});

export default router;
