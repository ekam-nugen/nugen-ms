import { ChatServices } from '../service/chat.services.js';
import log from '../config/logger.js';

/**
 * Authentication Controller
 * @class
 */
export class ChatController {
  /**
   * Get chat thread list by user
   * @param {Object} req - Request object
   * @param {Array} res - Response array
   */
  static async getAllUserList(req, res) {
    const { userId } = req.user;
    const { search, page, limit } = req.query;
    const userInfo = await ChatServices.getUserData(search, userId);
    log.info(`Get user data`);
    res.json({ data: userInfo });
  }
  /**
   * Get user chat by chatThreadId
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async getChatByChatThreadId(req, res) {
    const { chatThreadId } = req.params;
    // const { userId } = req.user;
    const chatThread = await ChatServices.getChatByChatThreadId(chatThreadId);
    log.info(`Get chat by chatThreadId`);
    res.json({ data: chatThread });
  }
  /**
   * Get user chatTherds
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async getUserChatThreads(req, res) {
    const { userId } = req.user;
    const chatThreads = await ChatServices.getChatThreads(userId);
    log.info(`Get chat threads`);
    res.json({ data: chatThreads });
  }
  /**
   * Create chat Thread
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async createChatThread(req, res) {
    const { receiverId } = req.body;
    //validation required
    if (!receiverId) {
      return res.status(400).json({ error: 'Invalid input in receiverId' });
    }
    const chatThread = await ChatServices.createChatThread(
      receiverId,
      req.user,
    );
    log.info(`Chat thread created successfully`);
    res.json({ data: chatThread });
  }
}
