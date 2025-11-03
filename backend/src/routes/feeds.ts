import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.ts';

const router = Router();

const FeedCreate = z.object({
  infantId: z.string().cuid(),
  type: z.enum(['Milk', 'Formula', 'Solid', 'Water']),
  amountMl: z.number().int().positive().max(2000).optional(),
  notes: z.string().max(500).optional(),
  startedAt: z.string().datetime().optional(),
});

const FeedUpdate = FeedCreate.partial();

router.post('/', async (req, res) => {
  const parsed = FeedCreate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { infantId, type, amountMl, notes, startedAt } = parsed.data;
  const feed = await prisma.feed.create({
    data: { infantId, type, amountMl, notes, startedAt: startedAt ? new Date(startedAt) : undefined }
  });
  res.status(201).json(feed);
});

router.get('/', async (req, res) => {
  const Query = z.object({
    infantId: z.string().cuid().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    type: z.enum(['breast_milk', 'formula', 'solid']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    cursor: z.string().cuid().optional(),
  });
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { infantId, dateFrom, dateTo, type, limit, cursor } = parsed.data;
  const where: any = {};
  if (infantId) where.infantId = infantId;
  if (type) where.type = type;
  if (dateFrom || dateTo) {
    where.startedAt = {};
    if (dateFrom) where.startedAt.gte = new Date(dateFrom);
    if (dateTo) where.startedAt.lte = new Date(dateTo);
  }

  const feeds = await prisma.feed.findMany({
    where, take: limit, ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { startedAt: 'desc' }
  });
  const nextCursor = feeds.length === limit ? feeds[feeds.length - 1].id : null;
  res.json({ items: feeds, nextCursor });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const feed = await prisma.feed.findUnique({ where: { id } });
  if (!feed) return res.status(404).json({ message: 'Not found' });
  res.json(feed);
});

router.patch('/:id', async (req, res) => {
  const parsed = FeedUpdate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const id = req.params.id;
  try {
    const feed = await prisma.feed.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(parsed.data.startedAt ? { startedAt: new Date(parsed.data.startedAt) } : {}),
      },
    });
    res.json(feed);
  } catch (e) {
    res.status(404).json({ message: 'Not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.feed.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ message: 'Not found' });
  }
});

export default router;
