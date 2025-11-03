import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import feedsRouter from './routes/feeds.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'feeding' }));

app.use('/api/feeds', feedsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`[feeding] API listening on http://localhost:${port}`));
