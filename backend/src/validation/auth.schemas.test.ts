import assert from 'node:assert/strict';
import test from 'node:test';

import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schemas.js';

test('forgot-password normalizes email addresses', () => {
  assert.equal(forgotPasswordSchema.parse({ email: 'USER@Example.COM' }).email, 'user@example.com');
});

test('reset-password requires a six-digit code and strong-enough password', () => {
  assert.equal(resetPasswordSchema.safeParse({ email: 'user@example.com', code: '12345', newPassword: 'password' }).success, false);
  assert.equal(resetPasswordSchema.safeParse({ email: 'user@example.com', code: '123456', newPassword: 'password' }).success, true);
});

test('password changes reject passwords shorter than eight characters', () => {
  assert.equal(changePasswordSchema.safeParse({ currentPassword: 'old-password', newPassword: 'short' }).success, false);
});
