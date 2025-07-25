import { UserService } from '../service/user.service.js';
import log from '../config/logger.js';
import sendResponse from '../utils/response.handler.js';

/**
 * User Controller
 * Handles all user-related operations
 */
export class UserController {
  /**
   * Get the list of all users for the logged-in user
   * @param {Object} req - Express request object (expects req.user.userId)
   * @param {Object} res - Express response object
   */
  static async getAllUserList(req, res) {
    try {
      const { userId } = req.user;
      const { search, isInvited } = req.query;
      const userInfo = await UserService.getUserData(userId, search, isInvited);

      log.info(`Fetched user list for userId: ${userId}`);
      return sendResponse(res, {
        data: userInfo,
        message: 'Users listed successfully',
      });
    } catch (error) {
      log.error(`List users error: ${error.message}`);
      return sendResponse(res, {
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Get user information by userId
   * @param {Object} req - Express request object (expects req.params.userId)
   * @param {Object} res - Express response object
   */
  static async getUserInfoById(req, res) {
    try {
      const { userId } = req.params;
      const userInfo = await UserService.getUserInfoById(userId);

      log.info(`Fetched user info for userId: ${userId}`);
      return sendResponse(res, {
        data: userInfo,
        message: 'User info fetched successfully',
      });
    } catch (error) {
      log.error(`Get user info by userId error: ${error.message}`);
      return sendResponse(res, {
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Update user information
   * @param {Object} req - Express request object (expects req.params.userId, req.body)
   * @param {Object} res - Express response object
   */
  static async updateUserInfo(req, res) {
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, phone, roleId } = req.body;

      if (!firstName || !lastName || !email || !roleId) {
        return sendResponse(res, {
          error: {
            message: 'Invalid Input',
            statusCode: 401,
          },
        });
      }

      const userInfo = await UserService.updateUserInfo(userId, {
        firstName,
        lastName,
        email,
        phone,
        roleId,
      });

      log.info(`Updated user info for userId: ${userId}`);
      return sendResponse(res, {
        data: userInfo,
        message: 'User info updated successfully',
      });
    } catch (error) {
      log.error(`Update user info error: ${error.message}`);
      return sendResponse(res, {
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Update or fetch user activity status by userId
   * @param {Object} req - Express request object (expects req.params.userId)
   * @param {Object} res - Express response object
   */
  static async userActivityStatus(req, res) {
    try {
      const { userId } = req.user;
      const { userIds } = req.body;

      const userInfo = await UserService.userActivityStatus(userIds, userId);

      // log.info(`User activity status updated/fetched for userId: ${userId}`);
      return sendResponse(res, {
        data: userInfo,
        message: 'User invitation is approved successfully',
      });
    } catch (error) {
      log
        .error
        // `User activity status error for userId ${req.params.userId}: ${error.message}`,
        ();
      return sendResponse(res, {
        error: error.message || 'Internal server error',
      });
    }
  }
}
