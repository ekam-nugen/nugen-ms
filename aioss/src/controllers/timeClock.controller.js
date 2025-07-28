import { TimeClockService } from "../service/timeClock.service.js";
import moment from "moment";

export class TimeClockController {
  static async clockIn(req, res) {
    try {
      const { userId, projectId, organisationId } = req.body;
      const clockInData = {
        userId,
        projectId,
        organisationId,
        clockIn: moment().toDate(),
        isClockIn: true,
      };
      const result = await TimeClockService.createClockIn(clockInData);
      return res.status(201).json({
        success: true,
        message: "Clock-in recorded successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async clockOut(req, res) {
    try {
      const { userId, timeLogId } = req.body;
      const clockOutTime = moment().toDate();
      const result = await TimeClockService.updateClockOut({
        timeLogId,
        userId,
        clockOutTime,
      });
      return res.status(200).json({
        success: true,
        message: "Clock-out recorded successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getTimeLog(req, res) {
    try {
      const { timeLogId } = req.params;
      const result = await TimeClockService.getTimeLog(timeLogId);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getUserTimeLogs(req, res) {
    try {
      const { userId } = req.params;
      const result = await TimeClockService.getUserTimeLogs(userId);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
