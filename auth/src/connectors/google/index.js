import { OAuth2Client } from 'google-auth-library';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from '../../config/index.js';

/**
 * Google Authentication Connector
 * @class
 */
export class GoogleConnector {
  constructor() {
    this.client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI,
    );
  }

  /**
   * Get Google login URL
   * @returns {string} Login URL
   */
  getLoginUrl() {
    return this.client.generateAuthUrl({
      scope: ['profile', 'email'],
    });
  }

  /**
   * Handle Google callback
   * @param {Object} params - Callback parameters
   * @returns {Object} User data
   */
  async handleCallback({ code }) {
    try {
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);

      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        provider: 'google',
      };
    } catch (error) {
      throw new Error(`Google authentication failed: ${error.message}`);
    }
  }
}
