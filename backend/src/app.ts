/// <reference path="./types/express.d.ts" />

import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { requireAuth } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { transactionRouter } from './routes/transaction.routes.js';
import { asyncHandler } from './utils/async-handler.js';

export const app = express();
app.disable('x-powered-by');
if (env.NODE_ENV === 'production') {
  app.use(asyncHandler(async (_request, _response, next) => {
    await connectDatabase();
    next();
  }));
}
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }), authRouter);
app.get('/api/health', (_request, response) => response.json({ service: 'pocketwise-api', status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/transactions', requireAuth, transactionRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
