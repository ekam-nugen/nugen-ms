import log from "../config/logger.js";
import { DashboardService } from "../service/dashboard.service.js";

export const getCreateOrganizationJson = async (req, res) => {
  try {
    const json = DashboardService.getCreateOrganizatoinJson();
    return res.status(200).json({
      data: json,
      message: "Create organization JSON send successfully",
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const json = DashboardService.getDashboardJson();
    return res.status(200).json({
      data: json.dashboard,
      message: "Organization JSON send successfully",
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

export const getlayoutData = async (req, res) => {
  try {
    const json = DashboardService.getLayoutJson();
    return res.status(200).json({
      data: json,
      message: "Create organization JSON send successfully",
    });
  } catch (err) {
    log.error(`Get create organization JSON error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};
