import { User } from '../schemas/user.schema.js';

/**
 * Authentication Service
 * @class
 */
export class UserService {
  /**
   * Get User data
   * @returns {Array} user - User data
   */
  static async getUserData(userId) {
    const userInfo = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
          isActive: true,
          isDeleted: false,
        },
      },
    ]);
    // console.log(userInfo);
    return userInfo;
  }
}
