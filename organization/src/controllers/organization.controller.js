import log from '../config/logger.js';
import * as orgService from '../service/organization.service.js';
import sendResponse from '../utils/response.handler.js';

export const createOrganization = async (req, res) => {
  try {
    let { userId, email } = req.user;
    let { ...details } = req.body;
    const organization = await orgService.createOrganization(
      userId,
      email,
      details,
    );
    log.info(`Organization created: ${details.email}`);
    if (organization.exist) {
      return sendResponse(res, {
        message: 'Organization already exist',
        statusCode: 200,
      });
    }
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

export const getOrganizationInfoById = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const organization =
      await orgService.getOrganizationInfoById(organizationId);
    // log.info(
    //   `Organization: ${req.user.mobile || req.user.email} by user: ${req.user.email}`,
    // );
    return sendResponse(res, {
      data: organization || {},
      message: `Organization checked: ${req.user.mobile || req.user.email}`,
    });
  } catch (err) {
    log.error(`Check organization error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const checkOrganization = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const organization = await orgService.checkOrganization({ email, mobile });
    // log.info(
    //   `Organization: ${req.user.mobile || req.user.email} by user: ${req.user.email}`,
    // );
    return sendResponse(res, {
      data: organization || [],
      message: `Organization checked: ${req.user.mobile || req.user.email}`,
    });
  } catch (err) {
    log.error(`Check organization error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const listOrganizations = async (req, res) => {
  try {
    const { userId } = req.user;
    const organizations = await orgService.listOrganizations(userId);
    log.info(
      `Organizations listed for user: ${req.user.email || req.user.mobile}`,
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

export const updateOrganization = async (req, res) => {
  try {
    let { userId } = req.user;
    let { ...details } = req.body;
    const updatedOrganization = await orgService.updateOrganization(
      userId,
      details,
    );
    if (updatedOrganization.acknowledged) {
      return sendResponse(res, {
        message: `Organization updated: ${details.companyName}`,
      });
    } else {
      return sendResponse(res, {
        message: `Organization not updated: ${details.companyName}`,
        statusCode: 400,
      });
    }
  } catch (err) {
    return sendResponse(res, { error: err });
  }
};

export const joinOrganization = async (req, res) => {
  try {
    const { invitationLink } = req.query;
    const { email, password, firstName, lastName, companyId, invitedBy } =
      req.body;

    if (invitationLink) {
      if (!companyId) {
        return sendResponse(res, {
          error: {
            type: 'Validation Error',
            message: 'CompanyId is required',
            statusCode: 400,
          },
        });
      }
    }
    if (!email || !password || !firstName || !lastName || !invitedBy) {
      return sendResponse(res, {
        error: {
          type: 'Validation Error',
          message: 'Email and password are required',
          statusCode: 400,
        },
      });
    }
    const result = await orgService.joinOrganization(
      req.params.token,
      invitationLink,
      {
        email,
        password,
        firstName,
        lastName,
        companyId,
        invitedBy,
      },
    );
    return sendResponse(res, {
      data: result,
      message: `User joined organization: ${result?.data?.user?.id}`,
      statusCode: 200,
    });
  } catch (err) {
    return sendResponse(res, { error: err });
  }
};
