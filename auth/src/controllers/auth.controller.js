import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, JWT_SECRET } from '../config/index.js';

class AuthService {
  /**
   * Generate JWT token
   * @param {Object} user - User data
   * @returns {string} JWT token
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      },
    );
  }

  /**
   * Handle social login
   * @param {string} provider - Provider name
   * @param {Object} params - Callback parameters
   * @returns {Object} User data and token
   */
  static async handleSocialLogin(provider, params) {
    // const user = await superConnector.handleCallback(provider, params);
    // const token = this.generateToken(user);
    // return { user, token };
  }

  /**
   * Handle email signup
   * @param {Object} params - User details
   * @returns {Object} User data and token
   */
  static async handleEmailSignup(params) {
    const emailConnector = superConnector.getProvider('email');
    const user = await emailConnector.signup(params);
    const token = this.generateToken(user);
    return { user, token };
  }

  /**
   * Handle email login
   * @param {Object} params - Login credentials
   * @returns {Object} User data and token
   */
  static async handleEmailLogin(params) {
    const emailConnector = superConnector.getProvider('email');
    const user = await emailConnector.login(params);
    const token = this.generateToken(user);
    return { user, token };
  }
}

export default AuthService;
