import jwt from 'jsonwebtoken';
import log from '../config/logger.js';
import { JWT_SECRET } from '../config/index.js';
import { AuthenticationError } from '../utils/errors.js';

export class TokenController {
  /**
   * Handle token validation
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async validateToken(req, res) {
    const { accessToken } = req.body;
    try {
      const payload = jwt.verify(accessToken, JWT_SECRET);
      log.info(`Token validated for user: ${payload.email}`);
      res.json({ valid: true, payload });
    } catch (error) {
      log.error(`Token validation failed: ${error.message}`);
      throw new AuthenticationError('Token validation failed', error);
    }
  }
}
