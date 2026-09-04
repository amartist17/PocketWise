import bcrypt from 'bcryptjs';

import { UserModel } from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { AppError } from '../utils/app-error.js';
import { createToken } from '../utils/token.js';
import { loginSchema, registerSchema } from '../validation/auth.schemas.js';

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
