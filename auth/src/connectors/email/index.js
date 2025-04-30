import bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema.js';
import { AuthenticationError, DatabaseError } from '../../utils/errors.js';

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
        throw new AuthenticationError('User already exists');
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

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: 'email',
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError(`Email login failed: ${error.message}`);
    }
  }
}
