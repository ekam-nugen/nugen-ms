import log from '../config/logger.js';
import orgJson from '../constants/organizationCreation.json' assert { type: 'json' };
import layout from '../constants/layout.json' assert { type: 'json' };
import dashboard from '../constants/dashboard.json' assert { type: 'json' };
import sendResponse from '../../../organization/src/utils/response.handler.js';

export const getCreateOrganizationJson = async (req, res) => {
  try {
    const json = orgJson;
    return sendResponse(res, {
      data: json.orgJson,
      message: 'Create organization JSON send successfully',
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const json = dashboard;
    return sendResponse(res, {
      data: json,
      message: 'Create organization JSON send successfully',
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const getlayoutData = async (req, res) => {
  try {
    const json = layout;
    return sendResponse(res, {
      data: json,
      message: 'Create organization JSON send successfully',
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};
