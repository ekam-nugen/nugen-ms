import { Types } from "mongoose";
import { TimeLog } from "../schemas/timelog.schema.js";
import moment from "moment";
import axios from "axios";
export class TimeClockService {
  static async createClockIn(data) {
    const { userId, projectId, organisationId, clockIn, isClockIn } = data;

    // Check if user is already clocked in
    const existingClockIn = await TimeLog.findOne({
      userId,
      isClockIn: true,
      isClockOut: false,
      isDeleted: false,
    });

    if (existingClockIn) {
      throw new Error("User is already clocked in");
    }

    const timeLog = new TimeLog({
      userId,
      projectId,
      organisationId,
      clockIn,
      isClockIn,
      isActive: true,
    });

    const clockInLog = await timeLog.save();

    return clockInLog;
  }

  static async updateClockOut(data) {
    const { timeLogId, userId, clockOutTime } = data;

    const timeLog = await TimeLog.findOne({
      _id: timeLogId,
      userId,
      isClockIn: true,
      isClockOut: false,
      isDeleted: false,
    });

    if (!timeLog) {
      throw new Error("No active clock-in found for this user");
    }
    // need to update difference in hh:mm:ss
    const duration = moment.duration(
      moment(clockOutTime).diff(moment(timeLog.clockIn))
    );
    const totalHoursClockedIn = duration.asHours();

    timeLog.clockOut = clockOutTime;
    timeLog.isClockOut = true;
    timeLog.isClockIn = true;
    timeLog.totalHoursClockedIn = totalHoursClockedIn;

    return await timeLog.save();
  }

  static async getTimeLog(timeLogId) {
    try {
      const timeLog = await TimeLog.findOne({
        _id: new Types.ObjectId(timeLogId),
        isDeleted: false,
      });

      if (!timeLog) {
        throw new Error("Time log not found");
      }
      return timeLog;
    } catch (err) {
      throw {
        type: "Validation Error",
        message: `Signup failed: ${err.message}`,
        statusCode: 400,
      };
    }

    return timeLog;
  }

  static async getUserTimeLogs(userId) {
    return await TimeLog.find({
      userId,
      isDeleted: false,
    }).sort({ clockIn: -1 });
  }
}
