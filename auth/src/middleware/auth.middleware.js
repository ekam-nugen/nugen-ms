import axios from 'axios';
import log from '../config/logger.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    log.error('No token provided');
    return res.status(401).json({
      errors: {
        type: 'Authentication Error',
        message: 'No token provided',
        statusCode: 401,
      },
    });
  }

  try {
    const response = await axios.post(
      'http://validator_service:8001/validate',
      { token },
    );
    if (response.data.valid) {
      req.user = response.data.payload;
      log.info(`Token validated for user: ${req.user.email}`);
      next();
    } else {
      log.error('Token validation failed');
      return res.status(401).json({
        errors: {
          type: 'Authentication Error',
          message: 'Invalid token',
          statusCode: 401,
        },
      });
    }
  } catch (err) {
    log.error(`Validation request failed: ${err.message}`);
    return res.status(err.response?.status || 500).json({
      errors: {
        type: err.response?.data.errors?.type || 'Server Error',
        message:
          err.response?.data.errors?.message || 'Failed to validate token',
        statusCode: err.response?.status || 500,
      },
    });
  }
};
