import bcrypt from 'bcryptjs';
import { createHash, randomInt } from 'node:crypto';

import { env } from '../config/env.js';
import { TransactionModel } from '../models/transaction.model.js';
import { UserModel } from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { AppError } from '../utils/app-error.js';
import { createToken } from '../utils/token.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validation/auth.schemas.js';

const publicUser = (user: { _id: unknown; name: string; email: string }) => ({ id: String(user._id), name: user.name, email: user.email });

export const register = asyncHandler(async (request, response) => {
  const input = registerSchema.parse(request.body);
  if (await UserModel.exists({ email: input.email })) throw new AppError(409, 'An account with this email already exists.');
  const user = await UserModel.create({ name: input.name, email: input.email, passwordHash: await bcrypt.hash(input.password, 12) });
  response.status(201).json({ token: createToken(String(user._id)), user: publicUser(user) });
});

export const login = asyncHandler(async (request, response) => {
  const input = loginSchema.parse(request.body);
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new AppError(401, 'Email or password is incorrect.');
  response.json({ token: createToken(String(user._id)), user: publicUser(user) });
});

export const me = asyncHandler(async (request, response) => {
  const user = await UserModel.findById(request.userId);
  if (!user) throw new AppError(404, 'User not found.');
  response.json({ user: publicUser(user) });
});

export const changePassword = asyncHandler(async (request, response) => {
  const input = changePasswordSchema.parse(request.body);
  const user = await UserModel.findById(request.userId).select('+passwordHash');
  if (!user || !(await bcrypt.compare(input.currentPassword, user.passwordHash))) throw new AppError(401, 'Current password is incorrect.');
  user.passwordHash = await bcrypt.hash(input.newPassword, 12);
  await user.save();
  response.json({ message: 'Password updated successfully.' });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  const { email } = forgotPasswordSchema.parse(request.body);
  const user = await UserModel.findOne({ email }).select('+resetPasswordTokenHash +resetPasswordExpiresAt');
  let developmentCode: string | undefined;

  if (user) {
    const code = randomInt(100000, 1000000).toString();
    user.resetPasswordTokenHash = createHash('sha256').update(code).digest('hex');
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    if (env.RESEND_API_KEY) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.EMAIL_FROM, to: [email], subject: 'Your PocketWise reset code', html: `<p>Your PocketWise password reset code is <strong>${code}</strong>.</p><p>It expires in 15 minutes.</p>` }),
      });
      if (!emailResponse.ok) throw new AppError(502, 'Password reset email could not be sent. Please try again.');
    } else if (env.NODE_ENV !== 'production') {
      developmentCode = code;
    }
  }

  response.json({ message: 'If that email is registered, a reset code has been sent.', developmentCode });
});

export const resetPassword = asyncHandler(async (request, response) => {
  const input = resetPasswordSchema.parse(request.body);
  const tokenHash = createHash('sha256').update(input.code).digest('hex');
  const user = await UserModel.findOne({ email: input.email, resetPasswordTokenHash: tokenHash, resetPasswordExpiresAt: { $gt: new Date() } })
    .select('+passwordHash +resetPasswordTokenHash +resetPasswordExpiresAt');
  if (!user) throw new AppError(400, 'The reset code is invalid or has expired.');
  user.passwordHash = await bcrypt.hash(input.newPassword, 12);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();
  response.json({ message: 'Password reset successfully.' });
});

export const deleteAccount = asyncHandler(async (request, response) => {
  await TransactionModel.deleteMany({ userId: request.userId });
  await UserModel.deleteOne({ _id: request.userId });
  response.status(204).send();
});
