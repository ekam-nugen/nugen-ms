import axios from 'axios';
import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URI } from '../../config/index.js';

/**
 * Facebook Authentication Connector
 * @class
 */
export class FacebookConnector {
  constructor() {
    this.appId = FACEBOOK_CLIENT_ID;
    this.appSecret = FACEBOOK_CLIENT_SECRET;
    this.redirectUri = FACEBOOK_REDIRECT_URI;
  }

  /**
   * Get Facebook login URL
   * @returns {string} Login URL
   */
  getLoginUrl() {
    return `https://www.facebook.com/v12.0/dialog/oauth?client_id=${this.appId}&redirect_uri=${this.redirectUri}&scope=email,public_profile`;
  }

  /**
   * Handle Facebook callback
   * @param {Object} params - Callback parameters
   * @returns {Object} User data
   */
  async handleCallback({ code }) {
    try {
      const { data: tokenData } = await axios.get(
        `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${this.appId}&client_secret=${this.appSecret}&code=${code}&redirect_uri=${this.redirectUri}`
      );

      const { data: userData } = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`
      );

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        provider: 'facebook',
      };
    } catch (error) {
      throw new Error(`Facebook authentication failed: ${error.message}`);
    }
  }
}