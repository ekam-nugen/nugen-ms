import { UserService } from '../service/user.service.js';
import log from '../config/logger.js';

/**
 * Authentication Controller
 * @class
 */
export class UserController {
  /**
   * Get login URL for social provider
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async getAllUserList(req, res) {
    const { userId } = req.body;
    const userInfo = await UserService.getUserData(userId);
    log.info(`Get user data`);
    res.json({ data: userInfo });
  }
}
