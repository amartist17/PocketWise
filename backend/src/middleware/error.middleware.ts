import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../utils/app-error.js';

export const notFound: RequestHandler = (_request, _response, next) => next(new AppError(404, 'Route not found.'));

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({ message: 'Please check the submitted fields.', issues: error.flatten().fieldErrors });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ message: 'Something went wrong on the server.' });
};
