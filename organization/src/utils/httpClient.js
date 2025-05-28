import axios from 'axios';
import logger from '../config/logger.js';

// Service to base URL mapping
const SERVICE_BASE_URLS = {
  auth: 'http://localhost:8000',
  org: 'http://localhost:8002', // For future extensibility
};

const httpRequest = async ({
  method,
  service,
  endpoint,
  body = null,
  headers = {},
}) => {
  if (!SERVICE_BASE_URLS[service]) {
    throw new Error(`Unknown service: ${service}`);
  }
  const url = `${SERVICE_BASE_URLS[service]}/${endpoint.replace(/^\//, '')}`;
  try {
    const response = await axios({
      method,
      url,
      data: body,
      headers,
    });
    logger.info(
      `HTTP ${method} request to ${url} succeeded with status ${response.status}`,
    );
    return response.data;
  } catch (err) {
    logger.error(`HTTP ${method} request to ${url} failed: ${err.message}`);
    throw {
      message: err.response?.data?.error || err.message,
      statusCode: err.response?.status || 500,
    };
  }
};

export const get = (service, endpoint, headers = {}) =>
  httpRequest({ method: 'GET', service, endpoint, headers });

export const post = (service, endpoint, body = null, headers = {}) =>
  httpRequest({ method: 'POST', service, endpoint, body, headers });

export const put = (service, endpoint, body = null, headers = {}) =>
  httpRequest({ method: 'PUT', service, endpoint, body, headers });

export const del = (service, endpoint, headers = {}) =>
  httpRequest({ method: 'DELETE', service, endpoint, headers });
