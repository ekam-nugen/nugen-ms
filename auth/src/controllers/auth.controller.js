import { AuthService } from '../service/auth.service.js';
import superConnector from '../connectors/super.connector.js';
import AgvValidator from '../middlewares/ajv-validator.middleware.js';
import { emailConnectorSchema }  from './auth.validation.js';

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
    try {
      const { provider } = req.params;
      const url = await superConnector.getLoginUrl(provider);
      res.json({ url });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle social login callback
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async handleSocialCallback(req, res) {
    try {
      const { provider } = req.params;
      const result = await AuthService.handleSocialLogin(provider, req.query);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle email signup
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async emailSignup(req, res) {
    try {
      // Validate the request body
      // const { email, password, name } = req.body;
      const validatEmailConnector =  AgvValidator.ajvValidator(emailConnectorSchema,
        { email, password }
      );

      if(!validatEmailConnector.isValid){
        return res.status(400).json({
          message: "Invalid Input Errors",
          error: validatEmailConnector?.errors
        })
      }
      const result = await AuthService.handleEmailSignup(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle email login
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async emailLogin(req, res) {
    try {
      const result = await AuthService.handleEmailLogin(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}