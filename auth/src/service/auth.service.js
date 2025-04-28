import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import superConnector from '../connectors/super.connector.js';
import { User } from '../schemas/user.schema.js';

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
    }

    const token = this.generateToken({
      id: user._id,
      email: user.email,
      provider: user.provider,
    });
    return { user: { id: user._id, email: user.email, name: user.name }, token };
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
    return { user: userData, token };
  }
}