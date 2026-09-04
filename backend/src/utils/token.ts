import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';

export function createToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] });
}
