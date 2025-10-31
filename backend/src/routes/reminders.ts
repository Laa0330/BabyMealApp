import { Router } from 'express';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';

const router = Router();

function getUserId(req: any) {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || 'my-secret';
    const payload = jwt.verify(token, secret) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

router.post('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { type, message, atTime, enabled = true, channel } = req.body;
  try {
    const reminder = await prisma.reminder.create({
      data: {
        userId,
        type,
        message: message ?? null,
        atTime: new Date(atTime),
        enabled: Boolean(enabled),
        channel: channel ?? null,
      },
    });
    res.json(reminder);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});


router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const reminders = await prisma.reminder.findMany({
    where: { userId },
    orderBy: { atTime: 'desc' },
  });
  res.json(reminders);
});

router.patch('/:id/toggle', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const existing = await prisma.reminder.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const updated = await prisma.reminder.update({
      where: { id: existing.id },
      data: { enabled: !existing.enabled },
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to toggle reminder' });
  }
});

export default router;
