import { TimeOffRequestService } from "../service/timeOff.service.js";

export class TimeOffController {
  static async createTimeOffRequest(req, res) {
    try {
      const {
        organizationId,
        // projectId,
        allDay,
        // dateOfTimeOff,
        start,
        end,
        totalTimeOffDays,
        description,
        type,
      } = req.body;

      const { userId } = req.user;

      const result = await TimeOffRequestService.createTimeOffRequest({
        organizationId,
        // projectId,
        start,
        end,
        userId,
        allDay,
        // dateOfTimeOff,
        totalTimeOffDays,
        description,
        type,
      });
      return res.status(201).json({
        success: true,
        message: "Time-off request created successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getUserTimeOffRequests(req, res) {
    try {
      const { userId } = req.user;
      const { organizationId, timeOffPolicy } = req.query;
      const result = await TimeOffRequestService.fetchUserTimeOffRequest({
        userId,
        organizationId,
        timeOffPolicy,
      });
      return res.status(200).json({
        success: true,
        message: "Time-off requests retrieved successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async fetchTimeOffStats(req, res) {
    try {
      const { userId } = req.user;
      const { organizationId } = req.query;
      const result = await TimeOffRequestService.fetchUseTimeOffStats({
        userId,
        organizationId,
      });
      return res.status(200).json({
        success: true,
        message: "Time-off requests retrieved successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async timeOffApproval(req, res) {
    try {
      const { userId } = req.user;
      const { timeOffId } = req.query;

      if (!timeOffId) {
        throw new Error("Invalid input in timeOffId");
      }

      const result = await TimeOffRequestService.approveTimeOff(
        timeOffId,
        userId
      );
      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}
