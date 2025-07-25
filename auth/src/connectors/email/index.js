import { APP_URL } from '../../config/index.js';
import { Token } from '../../schemas/token.schema.js';
import { User } from '../../schemas/user.schema.js';
import { AuthenticationError, DatabaseError } from '../../utils/errors.js';
import crypto from 'crypto';

/**
 * Email/Password Authentication Connector
 * @class
 */
export class EmailConnector {
  /**
   * Signup with email and password
   * @param {Object} params - User details
   * @returns {Object} User data
   */
  async signup({
    email,
    password,
    firstName,
    lastName,
    isInvited,
    invitationStatus,
    invitedBy,
  }) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AuthenticationError('User already exists');
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        provider: 'email',
        isInvited,
        invitationStatus,
        invitedBy,
      });

      await user.save();
      return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: 'email',
        isInvited,
        invitationStatus,
        invitedBy,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new AuthenticationError('User already exists');
      }
      throw new DatabaseError(`Email signup failed: ${error.message}`);
    }
  }

  /**
   * Login with email and password
   * @param {Object} params - Login credentials
   * @returns {Object} User data
   */
  async login({ email, password }) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      if (user?.isInvited) {
        if (user.invitationStatus == 'pending') {
          throw new Error('Invitation is pending');
        }
      }
      if (!(await user.comparePassword(password))) {
        throw new AuthenticationError('Invalid password');
      }

      return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: 'email',
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError(`Email login failed: ${error.message}`);
    }
  }

  /**
   * Change password
   * @param {Object} params - User details
   * @returns {Object} User data
   */
  async changePassword({ userId, oldPassword, newPassword }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      if (!(await user.comparePassword(oldPassword))) {
        throw new AuthenticationError('Invalid old password');
      }
      user.password = newPassword;
      await user.save();
      return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: 'email',
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError(`Change password failed: ${error.message}`);
    }
  }

  /**
   * Request password reset
   * @param {Object} params - User details
   * @returns {string} Reset link
   */
  async forgotPassword({ email }) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await Token.create({
        userId: user._id,
        token: resetToken,
        type: 'reset',
        expiresAt,
      });
      const resetLink = `${APP_URL || 'http://localhost:8000'}/reset-password?token=${resetToken}`;
      return resetLink;
      //Todo: Send mail for the reset link
      // await sendMail(
      //   email,
      //   'Password Reset Request',
      //   `Click to reset your password: ${resetLink}`,
      //   `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
      // );
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError(`Change password failed: ${error.message}`);
    }
  }

  /**
   * Reset password
   * @param {Object} params - User details
   * @returns {Object} User data
   */
  async resetPassword({ token, newPassword }) {
    try {
      const tokenDoc = await Token.findOne({
        token,
        type: 'reset',
        expiresAt: { $gt: new Date() },
      });
      if (!tokenDoc) {
        throw new AuthenticationError('Invalid or expired token');
      }
      const user = await User.findById(tokenDoc.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      user.password = newPassword;
      await user.save();
      await Token.deleteOne({ _id: tokenDoc._id });
      return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: 'email',
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError(`Reset password failed: ${error.message}`);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const tokenDoc = await Token.findOne({
        token: refreshToken,
        type: 'refresh',
        expiresAt: { $gt: new Date() },
      });
      if (!tokenDoc) {
        throw new AuthenticationError('Invalid or expired token');
      }
      const user = await User.findById(tokenDoc.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      return {
        user,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError(`Refresh token failed: ${error.message}`);
    }
  }
}
