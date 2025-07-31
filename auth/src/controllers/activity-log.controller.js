import { UserActivityLogService } from '../service/activity-log.service.js';

export const createActivityLog = async (req, res) => {
  try {
    const {
      organisationId,
      userId,
      action,
      description,
      resourceType,
      resourceId,
    } = req.body;
    const logData = {
      organisationId,
      userId,
      action,
      description,
      resourceType,
      resourceId,
    };
    const result = await UserActivityLogService.createLog(logData);
    return res.status(201).json({
      success: true,
      message: 'Activity log created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getActivityLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const result = await UserActivityLogService.getLog(logId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLogsByOrganisation = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const result =
      await UserActivityLogService.getLogsByOrganisation(organisationId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserActivityLog = async (req, res) => {
  const { userId } = req.user;
  try {
    const result = await UserActivityLogService.getLogByUserId(userId);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
