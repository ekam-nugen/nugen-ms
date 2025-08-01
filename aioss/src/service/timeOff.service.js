import { TimeOff } from "../schemas/timeOff.schema.js";
import { Organization } from "../schemas/organization.schema.js";
import moment from "moment";
import { Types } from "mongoose";

export class TimeOffRequestService {
  static async createTimeOffRequest({
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
  }) {
    try {
      const timeOffRequest = await TimeOff.create({
        organizationId,
        // projectId,
        startTime: start,
        closeTime: end,
        userId,
        allDay,
        // dateOfTimeOff: timeOffDate.toDate(),
        totalTimeOffDays,
        description,
        isActive: true,
        type,
      });

      return timeOffRequest;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  static async fetchUserTimeOffRequest({
    organizationId,
    userId,
    timeOffPolicy,
  }) {
    try {
      const query = {
        userId,
        isDeleted: false,
      };

      if (timeOffPolicy) {
        query.type = timeOffPolicy;
      }

      const checkOrganizationExist = await Organization({
        _id: new Types.ObjectId(organizationId),
        isDeleted: false,
      });

      if (!checkOrganizationExist) {
        throw Error("Organization is not found");
      }

      query.organizationId = organizationId;

      return await TimeOff.find(query).sort({ dateOfTimeOff: -1 });
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchUseTimeOffStats({ organizationId, userId }) {
    try {
      const query = {
        userId,
        isDeleted: false,
      };

      const checkOrganizationExist = await Organization({
        _id: new Types.ObjectId(organizationId),
        isDeleted: false,
      });

      if (!checkOrganizationExist) {
        throw Error("Organization is not found");
      }

      query.organizationId = organizationId;
      query.type = "time-off";
      const timeOffCount = await TimeOff.find(query);

      query.type = "sick-leave";
      const sickLeaveCount = await TimeOff.find(query);

      query.type = "unpaid-leave";
      const unpaidLeaveCount = await TimeOff.find(query);

      const stats = {
        timeOffCount: timeOffCount.length || 0,
        sickLeaveCount: sickLeaveCount.length || 0,
        unpaidLeaveCount: unpaidLeaveCount.length || 0,
      };
      return stats;
    } catch (error) {
      console.log(error);
    }
  }

  static async approveTimeOff(timeOffId, approverId) {
    try {
      const timeOffObjectId = new Types.ObjectId(timeOffId);
      const approverObjectId = new Types.ObjectId(approverId);

      // Find the time-off request
      const timeOff = await TimeOff.findOne({
        _id: timeOffObjectId,
        isDeleted: false,
        isActive: true,
        approved: false,
      });

      if (!timeOff) {
        throw new Error("Time-off request not found or is inactive");
      }

      // Check if already approved
      if (timeOff.approved) {
        throw new Error("Time-off request is already approved");
      }

      // Update the time-off request
      const updatedTimeOff = await TimeOff.findByIdAndUpdate(
        timeOffObjectId,
        {
          $set: {
            approved: true,
            approvedBy: approverObjectId,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedTimeOff) {
        throw new Error("Failed to approve time-off request");
      }

      return updatedTimeOff;
    } catch (error) {
      console.error("Error in approveTimeOff:", error);
      throw new Error(`Failed to approve time-off request: ${error.message}`);
    }
  }
}
