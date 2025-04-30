import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import superConnector from '../connectors/super.connector.js';
import { User } from '../schemas/user.schema.js';
import log from '../config/logger.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Authentication Service
 * @class
 */
export class AuthService {
  /**
   * Generate JWT token
   * @param {Object} user - User data
   * @returns {string} JWT token
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        provider: user.provider,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  /**
   * Handle social login
   * @param {string} provider - Provider name
   * @param {Object} params - Callback parameters
   * @returns {Object} User data and token
   */
  static async handleSocialLogin(provider, params) {
    if (!params.code) {
      const error = new ValidationError('Missing authorization code');
      log.error(error.message);
      throw error;
    }
    try {
      const userData = await superConnector.handleCallback(provider, params);

      let user = await User.findOne({ email: userData.email, provider });
      if (!user) {
        user = new User({
          email: userData.email,
          name: userData.name,
          provider,
          providerId: userData.id,
        });
        await user.save();
        log.info(`Created new user for social login: ${userData.email}`);
      } else {
        log.info(`Found existing user for social login: ${userData.email}`);
      }

      const token = this.generateToken({
        id: user._id,
        email: user.email,
        provider: user.provider,
      });
      return { user: { id: user._id, email: user.email, name: user.name }, token };
    } catch (error) {
      if (error.name === 'MongoServerError') {
        const dbError = new DatabaseError(`Database error during social login: ${error.message}`);
        log.error(dbError.message);
        throw dbError;
      }
      log.error(error.message);
      throw error;
    }
  }

  /**
   * Handle email signup
   * @param {Object} params - User details
   * @returns {Object} User data and token
   */
  static async handleEmailSignup(params) {
    if (!params.email || !params.password || !params.name) {
      const error = new ValidationError('Email, password, and name are required');
      log.error(error.message);
      throw error;
    }
    const emailConnector = superConnector.getProvider('email');
    const userData = await emailConnector.signup(params);
    const token = this.generateToken(userData);
    return { user: userData, token };
  }

  /**
   * Handle email login
   * @param {Object} params - Login credentials
   * @returns {Object} User data and token
   */
  static async handleEmailLogin(params) {
    if (!params.email || !params.password) {
      const error = new ValidationError('Email and password are required');
      log.error(error.message);
      throw error;
    }
    const emailConnector = superConnector.getProvider('email');
    const userData = await emailConnector.login(params);
    const token = this.generateToken(userData);
    return { user: userData, token };
  }
}