import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export const requireAuth: RequestHandler = (request, _response, next) => {
  const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) return next(new AppError(401, 'Authentication required.'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || !payload.sub) throw new Error('Invalid payload');
    request.userId = payload.sub;
    next();
  } catch {
    next(new AppError(401, 'Your session is invalid or has expired.'));
  }
};
