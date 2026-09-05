import express from 'express';

import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { asyncHandler } from './utils/async-handler.js';

const serverlessApp = express();

serverlessApp.use(
  asyncHandler(async (_request, _response, next) => {
    await connectDatabase();
    next();
  }),
);
serverlessApp.use(app);

export default serverlessApp;
