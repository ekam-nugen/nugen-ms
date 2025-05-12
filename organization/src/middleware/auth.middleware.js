import axios from 'axios';
import log from '../config/logger.js';
import { AuthenticationError } from '../utils/errors.js';
import { AUTH_SERVICE_URL } from '../config/index.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    log.error('No token provided');
    throw new AuthenticationError('No token provided');
  }

  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/validate`, {
      accessToken: token,
    });
    if (response.data.valid) {
      req.body = {
        ...response.data.payload,
        ...req.body,
      };
      log.info(`Token validated for user: ${req.body.email}`);
      next();
    } else {
      log.error('Token validation failed');
      throw new AuthenticationError('Token validation failed');
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
