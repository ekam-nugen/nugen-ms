import { Types } from 'mongoose';
import { User } from '../schemas/user.schema.js';
import { Roles } from '../schemas/role.schema.js';
import { DatabaseError, ValidationError } from '../utils/errors.js';
import sendResponse from '../utils/response.handler.js';
import { UserOrganization } from '../schemas/user-organization.schema.js';

/**
 * Authentication Service
 * @class
 */
export class UserService {
  /**
   * Get User data
   * @returns {Array} user - User data
   */
  static async getUserData(userId, search, isInvited) {
    const pipeline = [];
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              firstName: {
                $regex: `${search}`,
                $options: 'i',
              },
            },
            {
              lastName: {
                $regex: `${search}`,
                $options: 'i',
              },
            },
          ],
        },
      });
    }
    if (isInvited) {
      pipeline.push({
        $match: {
          isInvited: true,
          isActive: true,
          isDeleted: false,
          invitationStatus: 'pending',
        },
      });
    } else {
      pipeline.push({
        $match: {
          isInvited: { $ne: true },
          isActive: true,
          isDeleted: false,
        },
      });
    }
    pipeline.push(
      {
        $lookup: {
          from: 'role',
          localField: 'roleId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                roleName: '$name',
              },
            },
          ],
          as: 'roleInfo',
        },
      },
      {
        $unwind: {
          path: '$roleInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          roleId: '$roleInfo.roleId',
          roleName: '$roleInfo.name',
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    );
    const userInfo = await User.aggregate(pipeline);
    // console.log(userInfo);
    return userInfo;
  }

  /**
   * get userInfo by userId
   * @returns {Object} user
   */
  static async getUserInfoById(userId) {
    try {
      const checkUserExist = await User.findOne({
        _id: userId,
        isActive: true,
        isDeleted: false,
      });

      if (!checkUserExist) {
        throw new Error('User does not exist.');
      }
      const userInfo = checkUserExist;
      return userInfo;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Edit User Info
   * @param {string} userId - The ID of the user to update
   * @param {string} roleId - The ID of the role to assign
   * @returns {Promise<Object>} The updated user document
   */
  static async updateUserInfo(userId, context) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new ValidationError('UserId is invalid');
      }

      if (!Types.ObjectId.isValid(context.roleId)) {
        throw new ValidationError('Invalid roleId.');
      }

      const user = await User.findOne({
        _id: new Types.ObjectId(userId),
        // isActive: true,
        isDeleted: false,
      });

      if (!user) {
        throw Error('User not found');
      }

      const role = await Roles.findOne({
        _id: new Types.ObjectId(context.roleId),
        isActive: true,
        isDeleted: false,
      });

      if (!role) {
        throw new DatabaseError('Role does not exist.');
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            firstName: context.firstName,
            lastName: context.lastName,
            email: context.email,
            phoneNumber: context.phone,
            roleId: context.roleId,
          },
        },
        { new: true },
      );

      return updatedUser;
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
    }
  }

  /**
   * Toggle user active status (true ⇄ false)
   * @param {string} userId - User ID
   * @returns {Object} Updated user document
   */
  static async userActivityStatus(userIds, adminId) {
    try {
      console.log(userIds, adminId);
      const checkAdminExist = await UserOrganization.findOne({
        userId: adminId,
        role: 'admin',
      });

      if (!checkAdminExist) {
        throw new Error(`Can't perform this action`);
      }
      for (let user of userIds) {
        const userInfo = await User.findOne({
          _id: new Types.ObjectId(user),
          isDeleted: false,
          isInvited: true,
          invitationStatus: 'pending',
        });

        if (!userInfo) {
          throw new DatabaseError('User approval request does not exist.');
        }

        const updatedUser = await User.findOneAndUpdate(
          { _id: user },
          { $set: { invitationStatus: 'approved' } },
          { new: true },
        );
      }
    } catch (error) {
      console.error(`Error toggling user activity status: ${error.message}`);
      throw new DatabaseError(error.message);
    }
  }
}
