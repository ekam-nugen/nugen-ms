import { User } from '../schema/user.schema.js';
import { ChatThread } from '../schema/chatThread.schema.js';
import { ChatParticipant } from '../schema/chatParticipants.schema.js';
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
        isDeleted: false,
      },
    });

    pipeline.push({
      $sort: {
        updatedAt: -1,
      },
    });
    // console.log(JSON.stringify(pipeline));
    const chatThread = await Message.aggregate(pipeline);
    return chatThread;
  }

  static async getChatThreads(userId, archived = false) {
    const pipeline = [];

    pipeline.push({
      $match: {
        isDeleted: false,
      },
    });

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

    pipeline.push(
      {
        $unwind: {
          path: '$archiveThreadUserId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          chatArchived: {
            $cond: [
              {
                $eq: ['$archiveThreadUserId', new Types.ObjectId(userId)],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          senderId: {
            $first: '$senderId',
          },
          receiverId: {
            $first: '$receiverId',
          },
          senderUserInfo: {
            $first: '$senderUserInfo',
          },
          messageType: {
            $first: '$messageType',
          },
          isActive: {
            $first: '$isActive',
          },
          isDeleted: {
            $first: '$isDeleted',
          },
          lastMessage: {
            $first: '$lastMessage',
          },
          isArchived: {
            $push: '$chatArchived',
          },
          pinThread: {
            $first: '$pinThread',
          },
        },
      },
      {
        $addFields: {
          isArchive: {
            $anyElementTrue: '$isArchived',
          },
        },
      },
    );

    if (archived) {
      pipeline.push({
        $match: {
          isArchive: true,
        },
      });
    } else {
      pipeline.push({
        $match: {
          isArchive: false,
        },
      });
    }

    pipeline.push({
      $project: {
        isArchived: 0,
        isArchive: 0,
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

    pipeline.push(
      {
        $unwind: {
          path: '$receiverUserInfo',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: '$pinThread',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          pinThread: {
            $cond: [
              {
                $eq: ['$pinThread', new Types.ObjectId(userId)],
              },
              true,
              false,
            ],
          },
        },
      },
    );

    pipeline.push({
      $sort: {
        pinThread: -1,
        updatedAt: -1,
      },
    });

    // console.log(JSON.stringify(pipeline));
    const chatThreads = await ChatThread.aggregate(pipeline);
    // get user group chat threads

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
        isDeleted: false,
      });
      if (checkChatThreadExist) {
        checkChatThreadExist.exist = true;
        return checkChatThreadExist;
      } else {
        const chatThreadInfo = await ChatThread.create({
          senderId: userId,
          receiverId: receiverId,
        });
        // create a participant for sender
        await ChatParticipant.create({
          threadId: chatThreadInfo._id,
          userId: userId,
        });
        // create a participant for receiver
        await ChatParticipant.create({
          threadId: chatThreadInfo._id,
          userId: receiverId,
        });
        return chatThreadInfo;
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async createGroupChat(context, userId) {
    try {
      const checkChatGroupExist = await ChatThread.findOne({
        title: context.title,
        isDeleted: false,
      });

      if (checkChatGroupExist) {
        throw new Error('Chat group existed successfully');
      }

      const newChatThread = await ChatThread.create({
        title: context.title,
        isGroupChat: true,
        groupCreatedBy: userId,
      });

      // create a admin
      await ChatParticipant.create({
        threadId: newChatThread._id,
        userId: userId,
        role: 'admin',
      });

      // create rest of members
      if (context.members.length > 0) {
        let members = context.members;
        members.forEach(async (member) => {
          console.log('member :::::: ', member);
          await ChatParticipant.create({
            threadId: newChatThread._id,
            userId: member,
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async archiveChatThread(chatThreadId, userId) {
    // Check if the chat thread exists
    const chatThreadInfo = await ChatThread.findById(chatThreadId);
    if (!chatThreadInfo) {
      throw new Error('Chat thread not found');
    }

    const isUserAlreadyArchived =
      chatThreadInfo.archiveThreadUserId.includes(userId);
    if (isUserAlreadyArchived) {
      // remove user from archiveThreadUserId
      const chatThread = await ChatThread.findByIdAndUpdate(
        chatThreadId,
        {
          $pull: { archiveThreadUserId: userId },
        },
        { new: true },
      );
      return chatThread;
    }

    const chatThread = await ChatThread.findByIdAndUpdate(
      chatThreadId,
      {
        $addToSet: { archiveThreadUserId: userId },
      },
      { new: true },
    );
    return chatThread;
  }

  static async pinChatThread(chatThreadId, userId) {
    const chatThreadInfo = await ChatThread.findById(chatThreadId);
    if (!chatThreadInfo) {
      throw new Error('Chat thread not found');
    }

    const isThreadPinned = chatThreadInfo.pinThread.includes(userId);
    if (isThreadPinned) {
      // remove user from pinThread
      const chatThread = await ChatThread.findByIdAndUpdate(
        chatThreadId,
        {
          $pull: { pinThread: userId },
        },
        { new: true },
      );
      return chatThread;
    }

    const chatThread = await ChatThread.findByIdAndUpdate(
      chatThreadId,
      {
        $addToSet: { pinThread: userId },
      },
      { new: true },
    );
    return chatThread;
  }

  static async deleteChatThread(chatThreadId, userId) {
    // Check if the chat thread exists
    const chatThreadInfo = await ChatThread.findById(chatThreadId);
    if (!chatThreadInfo) {
      throw new Error('Chat thread not found');
    }
    // check user chatThread exist
    const chatThreads = await ChatThread.findOne({
      $or: [
        {
          _id: chatThreadId,
          senderId: userId,
        },
        {
          _id: chatThreadId,
          receiverId: userId,
        },
      ],
    });

    if (!chatThreads) {
      throw new Error('Chat Thread does not exist');
    }
    let status = chatThreads.isDeleted;
    // soft delete chat thread
    const updatedChatThread = await ChatThread.findOneAndUpdate(
      {
        _id: chatThreadId,
      },
      {
        $set: {
          isDeleted: !status,
        },
      },
    );

    return updatedChatThread;
  }
}
