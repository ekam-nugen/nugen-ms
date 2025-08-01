import { Types } from 'mongoose';
import { UserActivityLog } from '../schemas/activity-log.schema.js';

export class UserActivityLogService {
  static async createLog(data) {
    const {
      organisationId,
      userId,
      action,
      description,
      resourceType,
      resourceId,
    } = data;

    const log = new UserActivityLog({
      organisationId,
      userId,
      action,
      description,
      resourceType,
      resourceId,
      isActive: true,
    });

    return await log.save();
  }

  static async getLog(logId) {
    const log = await UserActivityLog.findOne({
      _id: logId,
      isDeleted: false,
    });

    if (!log) {
      throw new Error('Activity log not found');
    }

    return log;
  }

  static async getLogsByOrganisation(organisationId) {
    const pipeline = [
      {
        $match: {
          organisationId: new Types.ObjectId(organisationId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                profileImageUrl: 1,
              },
            },
          ],
          as: 'userInfo',
        },
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];
    // console.log('PIPELINE :: ', JSON.stringify(pipeline));
    const getLogsInfo = await UserActivityLog.aggregate(pipeline);
    let result = [];
    const grouped = {};
    if (getLogsInfo.length > 0) {
      getLogsInfo.forEach((item) => {
        const date = item.date;
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(item);
      });

      result = {
        data: Object.entries(grouped)
          .sort((a, b) => new Date(b[0]) - new Date(a[0])) // sort by date descending
          .map(([date, items]) => ({ date, data: items })),
      };
    }

    return result.data;
  }

  static async getLogByUserId(userId) {
    try {
      const pipeline = [
        {
          $match: {
            userId: new Types.ObjectId(userId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  profileImageUrl: 1,
                },
              },
            ],
            as: 'userInfo',
          },
        },
        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ];
      // console.log('PIPELINE :: ', JSON.stringify(pipeline));
      const getLogsInfo = await UserActivityLog.aggregate(pipeline);
      let result = [];
      const grouped = {};
      if (getLogsInfo.length > 0) {
        getLogsInfo.forEach((item) => {
          const date = item.date;
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(item);
        });

        result = {
          data: Object.entries(grouped)
            .sort((a, b) => new Date(b[0]) - new Date(a[0])) // sort by date descending
            .map(([date, items]) => ({ date, data: items })),
        };
      }

      return result.data;
    } catch {
      console.log(error);
      throw new Error('error ::', error.message);
    }
  }

  static async updateLog(logId, updateData) {
    const log = await UserActivityLog.findOne({
      _id: logId,
      isDeleted: false,
    });

    if (!log) {
      throw new Error('Activity log not found');
    }

    // Only allow updating certain fields
    const allowedUpdates = [
      'action',
      'description',
      'resourceType',
      'resourceId',
    ];
    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        log[key] = updateData[key];
      }
    });

    return await log.save();
  }

  static async deleteLog(logId) {
    const log = await UserActivityLog.findOne({
      _id: logId,
      isDeleted: false,
    });

    if (!log) {
      throw new Error('Activity log not found');
    }

    log.isDeleted = true;
    await log.save();
  }
}
