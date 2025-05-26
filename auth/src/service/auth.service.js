import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_REFRESH_SECRET,
  JWT_SECRET,
} from '../config/index.js';
import superConnector from '../connectors/super.connector.js';
import { User } from '../schemas/user.schema.js';
import log from '../config/logger.js';
import { ValidationError } from '../utils/errors.js';
import { Token } from '../schemas/token.schema.js';

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
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: user.provider,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );
  }

  /**
   * Generate refresh token
   * @param {Object} user - User data
   * @returns {string} Refresh token
   */
  static async generateRefreshToken(user) {
    const refreshToken = jwt.sign(
      { sub: user.id },
      JWT_ACCESS_TOKEN_REFRESH_SECRET,
      { expiresIn: '7d' },
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Token.create({
      userId: user.id,
      token: refreshToken,
      type: 'refresh',
      expiresAt,
    });
    return refreshToken;
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
          firstName: userData.givenName,
          lastName: userData.familyName ? userData.familyName : userData.name,
          // name: userData.name,
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
      return {
        user: { id: user._id, email: user.email, name: user.name },
        token,
      };
    } catch (error) {
      if (error.name === 'MongoServerError') {
        const dbError = new DatabaseError(
          `Database error during social login: ${error.message}`,
        );
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
    const emailConnector = superConnector.getProvider('email');
    const userData = await emailConnector.login(params);
    const token = this.generateToken(userData);
    const refreshToken = await this.generateRefreshToken(userData);
    return { user: userData, token, refreshToken };
  }

  /**
   * Handle Change Password
   * @param {Object} params - Change password details
   * @returns {Object} User data
   */
  static async handleChangePassword(params) {
    const emailConnector = superConnector.getProvider('email');
    const userData = await emailConnector.changePassword(params);
    return { user: userData };
  }

  /**
   * Handle Forgot Password
   * @param {Object} params - Forgot password details
   * @returns {Object} Reset link
   */
  static async handleForgotPassword(params) {
    const emailConnector = superConnector.getProvider('email');
    const resetLink = await emailConnector.forgotPassword(params);
    return { resetLink };
  }

  /**
   * Handle Reset Password
   * @param {Object} params - Reset password details
   * @returns {Object} User data
   */
  static async handleResetPassword(params) {
    const emailConnector = superConnector.getProvider('email');
    const userData = await emailConnector.resetPassword(params);
    return { user: userData };
  }

  /**
   * Handle Reset Password
   * @param {Object} params - refresh token details
   * @returns {Object} new token and refresh token
   */
  static async refreshToken(refreshToken) {
    const emailConnector = superConnector.getProvider('email');
    const userData = await emailConnector.refreshToken(refreshToken);
    const newAccessToken = generateToken(userData);
    const newRefreshToken = await generateRefreshToken(userData);
    await Token.deleteOne({ _id: tokenDoc._id });
    return { token: newAccessToken, refreshToken: newRefreshToken };
  }
}
