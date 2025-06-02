import log from '../config/logger.js';
import orgJson from '../constants/organizationCreation.json' assert { type: 'json' };
import dashboard from '../constants/dashboard.json' assert { type: 'json' };
import sidebar from '../constants/sidebar.json' assert { type: 'json' };
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
      data: json.dashboard,
      message: 'Create organization JSON send successfully',
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};

export const getSidebarData = async (req, res) => {
  try {
    const json = sidebar;
    return sendResponse(res, {
      data: json.sidebar,
      message: 'Sidebar JSON send successfully',
    });
  } catch (err) {
    log.error(`Get sidebar JSON error: ${err.message}`);
    return sendResponse(res, { error: err });
  }
};
