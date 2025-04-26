import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { config } from '../../config/index.js';
import { User } from '../../schemas/user.js';

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
  async signup({ email, password, name }) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        name,
        provider: 'email',
        createdAt: new Date(),
      });

      await user.save();
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: 'email',
      };
    } catch (error) {
      throw new Error(`Email signup failed: ${error.message}`);
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
        throw new Error('User not found');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: 'email',
      };
    } catch (error) {
      throw new Error(`Email login failed: ${error.message}`);
    }
  }
}
