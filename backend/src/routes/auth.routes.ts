import { Router } from 'express';

import { changePassword, deleteAccount, forgotPassword, login, me, register, resetPassword } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/me', requireAuth, me);
authRouter.patch('/password', requireAuth, changePassword);
authRouter.delete('/me', requireAuth, deleteAccount);
