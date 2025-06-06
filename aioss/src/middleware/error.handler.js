import { NODE_ENV } from '../config/index.js';
import log from '../config/logger.js';
import { AuthenticationError, DatabaseError } from '../utils/errors.js';

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  log.error(err.message);

  let status = err.statusCode || 500;
  let type = 'Internal Server Error';
  let message = err.message || 'An unexpected error occurred';

  if (err.name === 'ValidationError') {
    status = 400;
    type = 'Missing Fields';
    message = err.message;
  } else if (err instanceof AuthenticationError) {
    status = 401;
    type = 'Authentication Error';
    message = err.message;
  } else if (err instanceof DatabaseError) {
    status = 500;
    type = 'Database Error';
    message = NODE_ENV === 'production' ? 'Database error' : err.message;
  } else if (err.message.includes('Provider not registered')) {
    status = 400;
    type = 'Invalid Provider';
    message = err.message;
  }

  res.status(status).json({
    errors: {
      type,
      message,
      statusCode: status,
    },
  });
};