class SuperConnector {
  constructor() {
    this.providers = new Map();
  }

  /**
   * Register a new authentication provider
   * @param {string} name - Provider name
   * @param {Object} provider - Provider implementation
   */
  registerProvider(name, provider) {
    this.providers.set(name, provider);
  }

  /**
   * Get authentication provider
   * @param {string} name - Provider name
   * @returns {Object} Provider implementation
   */
  getProvider(name) {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not registered`);
    }
    return provider;
  }

  /**
   * Get login URL for a provider
   * @param {string} providerName - Provider name
   * @returns {string} Login URL
   */
  async getLoginUrl(providerName) {
    const provider = this.getProvider(providerName);
    return provider.getLoginUrl();
  }

  /**
   * Handle callback from provider
   * @param {string} providerName - Provider name
   * @param {Object} params - Callback parameters
   * @returns {Object} User data
   */
  async handleCallback(providerName, params) {
    const provider = this.getProvider(providerName);
    return provider.handleCallback(params);
  }
}

let superConnector = new SuperConnector();
export default superConnector;
