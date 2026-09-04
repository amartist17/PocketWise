import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env.js';
import { requireAuth } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { transactionRouter } from './routes/transaction.routes.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }), authRouter);
app.get('/api/health', (_request, response) => response.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/transactions', requireAuth, transactionRouter);
app.use(notFound);
app.use(errorHandler);
