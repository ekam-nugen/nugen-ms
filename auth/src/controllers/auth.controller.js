import { AuthService } from '../service/auth.service.js';
import superConnector from '../connectors/super.connector.js';
import log from '../config/logger.js';

/**
 * Authentication Controller
 * @class
 */
export class AuthController {
  /**
   * Get login URL for social provider
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async getLoginUrl(req, res) {
    const { provider } = req.params;
    if (!['google', 'facebook'].includes(provider)) {
      throw new ValidationError('Invalid provider');
    }
    const url = await superConnector.getLoginUrl(provider);
    log.info(`Generated login URL for provider: ${provider}`);
    res.json({ url });
  }

  /**
   * Handle social login callback
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async handleSocialCallback(req, res) {
    const { provider } = req.params;
    if (!['google', 'facebook'].includes(provider)) {
      throw new ValidationError('Invalid provider');
    }
    const result = await AuthService.handleSocialLogin(provider, req.query);
    log.info(
      `Successful social login for provider: ${provider}, user: ${result.user.email}`,
    );
    res.json(result);
  }

  /**
   * Handle email signup
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async emailSignup(req, res) {
    const result = await AuthService.handleEmailSignup(req.body);
    log.info(`Successful email signup for user: ${result.user.email}`);
    res.json(result);
  }

  /**
   * Handle email login
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async emailLogin(req, res) {
    const result = await AuthService.handleEmailLogin(req.body);
    log.info(`Successful email login for user: ${result.user.email}`);
    res.json(result);
  }

  /**
   * Handle password change
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async changePassword(req, res) {
    const result = await AuthService.handleChangePassword(req.body);
    log.info(`Successful change password: ${result.user.email}`);
    res.json({ result: 'Password changed successfully' });
  }

  /**
   * Handle forgot password
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async forgotPassword(req, res) {
    const result = await AuthService.handleForgotPassword(req.body);
    log.info(`Successfully sent forgot password link: ${req.body.email}`);
    res.json({
      result: 'Password reset link sent to email',
      link: result.resetLink,
    });
  }

  /**
   * Handle reset password
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async resetPassword(req, res) {
    const { token } = req.query;
    if (!token) {
      throw new ValidationError('Token is required');
    }
    const result = await AuthService.handleResetPassword({
      token,
      ...req.body,
    });
    log.info(`Successfully reset password for user: ${result.user.email}`);
    res.json({ result: 'Password reset successfully' });
  }
}
