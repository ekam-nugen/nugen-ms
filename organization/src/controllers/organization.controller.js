import log from '../config/logger.js';
import * as orgService from '../service/organization.service.js';
import sendResponse from '../utils/response.handler.js';

export const createOrganization = async (req, res) => {
  try {
    let { userId, ...details } = req.body;
    const organization = await orgService.createOrganization(userId, details);
    log.info(`Organization created: ${details.email}`);
    return sendResponse(res, {
      data: organization,
      message: 'Organization created successfully',
      statusCode: 201,
    });
  } catch (err) {
    log.error(`Create organization error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const checkOrganization = async (req, res) => {
  try {
    const organization = await orgService.checkOrganization(req.body);
    log.info(`Organization: ${organization.email} by user: ${req.body.email}`);
    return sendResponse(res, {
      data: organization || { exists: false },
      message: `Organization checked: ${req.body.email || req.body.mobile}`,
    });
  } catch (err) {
    log.error(`Check organization error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const listOrganizations = async (req, res) => {
  try {
    const { userId } = req.body;
    const organizations = await orgService.listOrganizations(userId);
    log.info(
      `Organizations listed for user: ${req.body.email || req.body.mobile}`,
    );
    return sendResponse(res, {
      data: organizations,
      message: 'Organizations listed successfully',
    });
  } catch (err) {
    log.error(`List organizations error: ${err.message}`);
    return sendResponse(res, {
      error: err,
    });
  }
};
