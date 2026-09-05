import mongoose from 'mongoose';

import { env } from './env.js';

let connectionPromise: Promise<void> | null = null;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  connectionPromise ??= mongoose.connect(env.MONGODB_URI).then(() => {
    console.log('MongoDB connected');
  });

  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}
