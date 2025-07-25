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
   * Get user chatThreads
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async getUserChatThreads(req, res) {
    const { userId } = req.user;
    const { archived, search } = req.query;
    const chatThreads = await ChatServices.getChatThreads(
      userId,
      archived,
      search,
    );
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

    if (!receiverId) {
      return res.status(400).json({ error: 'Invalid input in receiverId' });
    }
    const chatThread = await ChatServices.createChatThread(
      receiverId,
      req.user,
    );
    log.info(`Chat thread created successfully`);
    if (chatThread.exist) {
      res.status(200).json({
        message: 'Chat thread created successfully',
        data: chatThread,
      });
    }
    res
      .status(201)
      .json({ message: 'Chat thread created successfully', data: chatThread });
  }

  /**
   * Create group chat
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async createGroupChat(req, res) {
    const { userId } = req.user;
    const { title, description, profile, members, admin } = req.body;

    if (!title || !description || !members || !admin) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const chatThread = await ChatServices.createGroupChat(req.body, userId);
    log.info(`Chat thread created successfully`);

    res.status(201).json({
      message: 'Group Chat-thread created successfully',
      data: chatThread || {},
    });
  }

  /**
   * Get user chatThread Info
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async getChatThreadInfo(req, res) {
    const { userId } = req.user;
    const { chatThreadId } = req.params;

    if (!chatThreadId) {
      return res.status(400).json({ error: 'Invalid input chatThreadId' });
    }
    const chatThread = await ChatServices.getChatThreadParticipantInfo(
      userId,
      chatThreadId,
    );
    log.info(`Chat thread created successfully`);

    res.status(201).json({
      message: 'Group Chat-thread members fetched successfully',
      data: chatThread || {},
    });
  }

  /**
   * Get user chatThread Info
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async updateChatParticipantsInfo(req, res) {
    const { userId } = req.user;
    const { chatThreadId } = req.params;
    const { title, profile, description, members, admin } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Invalid input in the chat' });
    }

    if (!chatThreadId) {
      return res.status(400).json({ error: 'Invalid input chatThreadId' });
    }

    const chatThread = await ChatServices.updateChatParticipant(
      userId,
      chatThreadId,
      { title, profile, description, members, admin },
    );
    log.info(`Chat thread created successfully`);

    res.status(201).json({
      message: 'Group Chat-thread members fetched successfully',
      data: chatThread || {},
    });
  }

  /**
   * Archive/Pin/Mute chat thread
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async updateChatThreadStatus(req, res) {
    const { method, chatThreadId } = req.params;
    const { userId } = req.user;
    const chatThread = await ChatServices.archiveChatThreadV2(
      method,
      chatThreadId,
      userId,
    );
    log.info(`Chat thread ${method} status updated successfully`);
    res.json({
      message: `Chat thread ${method} status updated successfully`,
    });
  }

  /**
   * Archive chat thread
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async archiveChatThread(req, res) {
    const { chatThreadId } = req.params;
    const { userId } = req.user;
    const chatThread = await ChatServices.archiveChatThread(
      chatThreadId,
      userId,
    );
    log.info(`Chat thread archive status updated successfully`);
    res.json({
      warning:
        'NOTE::: This api is deprecated, use /chat/chat-thread/:method/:chatThreadId instead method can be archive/pin/mute',
      message: 'Chat thread archive status updated successfully',
      // data: chatThread,
    });
  }

  /**
   * Pin chat thread
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async pinChatThread(req, res) {
    const { chatThreadId } = req.params;
    const { userId } = req.user;
    const chatThread = await ChatServices.pinChatThread(chatThreadId, userId);
    log.info(`Chat thread pin status updated successfully`);
    res.json({
      warning:
        'NOTE::: This api is deprecated, use /chat/chat-thread/:method/:chatThreadId instead method can be archive/pin/mute',
      message: 'Chat thread pin status updated successfully',
      // data: chatThread,
    });
  }

  /**
   * delete chat
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async deleteChatThread(req, res) {
    const { chatThreadId } = req.params;
    const { userId } = req.user;
    const chatThread = await ChatServices.deleteChatThread(
      chatThreadId,
      userId,
    );
    log.info(`Chat thread updated successfully`);
    res.json({
      message: 'Chat thread updated successfully',
      // data: chatThread,
    });
  }
}
