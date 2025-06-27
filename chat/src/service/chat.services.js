import { User } from '../schema/user.schema.js';
import { makeRequest } from '../middleware/axios.js';
import { ChatThread } from '../schema/chatThread.schema.js';
import { Types } from 'mongoose';
import { Message } from '../schema/chat.schema.js';
const authBaseUrl = process.env.AUTH_SERVICE_URL; // organizational filter and service

/**
 * Authentication Service
 * @class
 */
export class ChatServices {
  /**
   * Get User data
   * @returns {Array} user - User data
   */
  static async getUserData(search, userId) {
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const pipeline = [];
    pipeline.push({
      $match: {
        isDeleted: false,
      },
    });

    if (search) {
      pipeline.push({
        $match: searchQuery,
      });
    }

    // console.log(JSON.stringify(pipeline));
    const userInfo = await User.aggregate(pipeline);
    return userInfo;
  }

  static async getChatByChatThreadId(chatThreadId) {
    const pipeline = [];
    pipeline.push({
      $match: {
        chatThreadId: new Types.ObjectId(chatThreadId),
      },
    });

    pipeline.push({
      $sort: {
        updatedAt: -1,
      },
    });
    console.log(JSON.stringify(pipeline));
    const chatThread = await Message.aggregate(pipeline);
    return chatThread;
  }

  static async getChatThreads(userId) {
    const pipeline = [];

    pipeline.push({
      $match: {
        $or: [
          {
            senderId: new Types.ObjectId(userId),
          },
          {
            receiverId: new Types.ObjectId(userId),
          },
        ],
      },
    });
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              profileImage: 1,
            },
          },
        ],
        as: 'senderUserInfo',
      },
    });
    pipeline.push({
      $unwind: {
        path: '$senderUserInfo',
        preserveNullAndEmptyArrays: false,
      },
    });
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'receiverId',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              profileImage: 1,
            },
          },
        ],
        as: 'receiverUserInfo',
      },
    });
    pipeline.push({
      $unwind: {
        path: '$receiverUserInfo',
        preserveNullAndEmptyArrays: false,
      },
    });
    pipeline.push({
      $sort: {
        updatedAt: -1,
      },
    });
    //console.log(JSON.stringify(pipeline));
    const chatThreads = await ChatThread.aggregate(pipeline);
    return chatThreads;
  }

  static async createChatThread(receiverId, context) {
    try {
      const { userId } = context;

      const checkChatThreadExist = await ChatThread.findOne({
        $or: [
          { senderId: receiverId, receiverId: userId },
          { senderId: userId, receiverId },
        ],
      });
      if (checkChatThreadExist) {
        return checkChatThreadExist;
      } else {
        const chatThreadInfo = await ChatThread.create({
          senderId: userId,
          receiverId: receiverId,
        });
        return chatThreadInfo;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
