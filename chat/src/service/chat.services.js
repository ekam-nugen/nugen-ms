import { User } from '../schema/user.schema.js';
import { ChatThread } from '../schema/chatThread.schema.js';
import { ChatParticipant } from '../schema/chatParticipants.schema.js';
import { Types } from 'mongoose';
import { Message } from '../schema/chat.schema.js';

export class ChatServices {
  static async getUserData(search, userId) {
    try {
      const searchQuery = search
        ? {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const pipeline = [
        { $match: { isDeleted: false } },
        ...(search ? [{ $match: searchQuery }] : []),
      ];

      return await User.aggregate(pipeline);
    } catch (error) {
      console.error('Error in getUserData:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  static async getChatByChatThreadId(chatThreadId) {
    try {
      const pipeline = [
        {
          $match: {
            chatThreadId: new Types.ObjectId(chatThreadId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  profileImageUrl: 1,
                },
              },
            ],
            as: 'userInfo',
          },
        },
        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $sort: { updatedAt: -1 },
        },
      ];

      return await Message.aggregate(pipeline);
    } catch (error) {
      console.error('Error in getChatByChatThreadId:', error);
      throw new Error('Failed to fetch chat messages');
    }
  }

  static async getChatThreads(userId, archived = false) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const pipeline = [
        {
          $match: {
            $or: [
              {
                $and: [
                  {
                    senderId: userObjectId,
                  },
                  {
                    isGroupChat: false,
                  },
                  {
                    isDeleted: false,
                  },
                ],
              },
              {
                $and: [
                  {
                    receiverId: userObjectId,
                  },
                  {
                    isGroupChat: false,
                  },
                  {
                    isDeleted: false,
                  },
                ],
              },
              {
                $and: [
                  {
                    isGroupChat: true,
                  },
                  {
                    isActive: true,
                  },
                ],
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'chat-participant',
            localField: '_id',
            foreignField: 'threadId',
            as: 'memberInfo',
            pipeline: [
              {
                $match: {
                  userId: userObjectId,
                },
              },
              {
                $project: {
                  _id: 1,
                  userId: 1,
                },
              },
            ],
          },
        },
        {
          $match: {
            $or: [
              {
                isGroupChat: false,
              },
              {
                'memberInfo.userId': userObjectId,
              },
            ],
          },
        },
        {
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
        },
        {
          $unwind: {
            path: '$senderUserInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
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
        },
        {
          $unwind: {
            path: '$receiverUserInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$archiveThreadUserId',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            chatArchived: {
              $eq: ['$archiveThreadUserId', userObjectId],
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            title: {
              $first: '$title',
            },
            description: {
              $first: '$description',
            },
            profile: {
              $first: '$profile',
            },
            senderId: {
              $first: '$senderId',
            },
            receiverId: {
              $first: '$receiverId',
            },
            senderUserInfo: {
              $first: '$senderUserInfo',
            },
            receiverUserInfo: {
              $first: '$receiverUserInfo',
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
            isGroupChat: {
              $first: '$isGroupChat',
            },
            isArchived: {
              $push: '$chatArchived',
            },
            pinThread: {
              $first: '$pinThread',
            },
            updatedAt: {
              $first: '$updatedAt',
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
        {
          $match: {
            isArchive: archived,
          },
        },
        {
          $project: {
            isArchived: 0,
            isArchive: 0,
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
              $eq: ['$pinThread', userObjectId],
            },
          },
        },
        {
          $sort: {
            pinThread: -1,
            updatedAt: -1,
          },
        },
      ];
      // console.log(JSON.stringify(pipeline));
      const chatThreads = await ChatThread.aggregate(pipeline);
      return chatThreads;
    } catch (error) {
      console.error('Error in getChatThreads:', error);
      throw new Error('Failed to fetch chat threads');
    }
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
      }

      const chatThreadInfo = await ChatThread.create({
        senderId: userId,
        receiverId: receiverId,
      });

      await ChatParticipant.create({ threadId: chatThreadInfo._id, userId });
      await ChatParticipant.create({
        threadId: chatThreadInfo._id,
        userId: receiverId,
      });

      return chatThreadInfo;
    } catch (error) {
      console.error('Error in createChatThread:', error);
      throw new Error('Failed to create chat thread');
    }
  }

  static async createGroupChat(context, userId) {
    try {
      if (!context?.admin || context.admin.length === 0) {
        context.admin = [userId];
      }

      const checkChatGroupExist = await ChatThread.findOne({
        title: context.title,
        isDeleted: false,
      });

      if (checkChatGroupExist) throw new Error('Chat group already exists');

      const newChatThread = await ChatThread.create({
        profile: context?.profile,
        title: context?.title,
        description: context?.description,
        isGroupChat: true,
        groupCreatedBy: userId,
      });

      for (const member of context?.members || []) {
        await ChatParticipant.create({
          threadId: newChatThread._id,
          userId: member,
        });
      }

      for (const admin of context?.admin || []) {
        const existing = await ChatParticipant.findOne({
          threadId: newChatThread._id,
          userId: new Types.ObjectId(admin),
          role: 'member',
        });

        if (!existing) {
          await ChatParticipant.create({
            threadId: newChatThread._id,
            userId: new Types.ObjectId(admin),
            role: 'admin',
          });
        } else {
          await ChatParticipant.findOneAndUpdate(
            { threadId: newChatThread._id, userId: new Types.ObjectId(admin) },
            { $set: { role: 'admin' } },
          );
        }
      }

      return newChatThread;
    } catch (error) {
      console.error('Error in createGroupChat:', error);
      throw new Error('Failed to create group chat');
    }
  }

  static async getChatThreadParticipantInfo(userId, threadId) {
    try {
      let checkThreadIdExist = await ChatThread.find({
        _id: new Types.ObjectId(threadId),
      });
      if (!checkThreadIdExist) {
        throw new Error("Chat thread does't exist");
      }
      const pipeline = [
        {
          $match: {
            _id: new Types.ObjectId(threadId),
          },
        },
        {
          $lookup: {
            from: 'chat-participant',
            localField: '_id',
            foreignField: 'threadId',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  userId: 1,
                  role: 1,
                },
              },
            ],
            as: 'memberInfo',
          },
        },
        {
          $unwind: {
            path: '$memberInfo',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            groupCreatedBy: 1,
            userId: '$memberInfo.userId',
            role: '$memberInfo.role',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
            ],
            as: 'userInfo',
          },
        },
        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            'userInfo.role': '$role',
          },
        },
        {
          $group: {
            _id: '$_id',
            title: {
              $first: '$title',
            },
            description: {
              $first: '$description',
            },
            groupCreatedBy: {
              $first: '$groupCreatedBy',
            },
            membersInfo: {
              $push: '$userInfo',
            },
          },
        },
      ];
      // console.log(JSON.stringify(pipeline));
      const chatParticipantsInfo = await ChatThread.aggregate(pipeline);
      if (chatParticipantsInfo.length > 0) {
        return chatParticipantsInfo[0];
      } else {
        console.log(error.message);
        throw new Error('error');
      }
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  static async updateChatParticipant(userId, threadId, updateData) {
    try {
      // Validate thread existence
      const threadExists = await ChatThread.findById({
        _id: threadId,
        isGroupChat: true,
      });
      if (!threadExists) {
        throw new Error("Group chat does't exist");
      }

      const checkUser = await ChatParticipant.findOne({
        threadId,
        userId,
        role: 'admin',
      });

      if (!checkUser) {
        throw new Error(
          "Can't perform this action, only admin can update group info",
        );
      }

      const updatedChatThread = await ChatThread.findOneAndUpdate(
        {
          _id: threadId,
          isGroupChat: true,
        },
        {
          $set: {
            title: updateData.title,
            profile: updateData.profile,
            description: updateData.description,
          },
        },
        {
          new: 1,
        },
      );

      // chatParticipants is still pending

      return updatedChatThread;
    } catch (error) {
      console.error('Error updating chat participant:', error.message);
      throw new Error(error.message);
    }
  }

  static async archiveChatThread(chatThreadId, userId) {
    try {
      const chatThreadInfo = await ChatThread.findById(chatThreadId);
      if (!chatThreadInfo) throw new Error('Chat thread not found');

      const isArchived = chatThreadInfo.archiveThreadUserId.includes(userId);

      const update = isArchived
        ? { $pull: { archiveThreadUserId: userId } }
        : { $addToSet: { archiveThreadUserId: userId } };

      return await ChatThread.findByIdAndUpdate(chatThreadId, update, {
        new: true,
      });
    } catch (error) {
      console.error('Error in archiveChatThread:', error);
      throw new Error('Failed to archive/unarchive chat thread');
    }
  }

  static async pinChatThread(chatThreadId, userId) {
    try {
      const chatThreadInfo = await ChatThread.findById(chatThreadId);
      if (!chatThreadInfo) throw new Error('Chat thread not found');

      const isPinned = chatThreadInfo.pinThread.includes(userId);

      const update = isPinned
        ? { $pull: { pinThread: userId } }
        : { $addToSet: { pinThread: userId } };

      return await ChatThread.findByIdAndUpdate(chatThreadId, update, {
        new: true,
      });
    } catch (error) {
      console.error('Error in pinChatThread:', error);
      throw new Error('Failed to pin/unpin chat thread');
    }
  }

  static async archiveChatThreadV2(chatThreadId, userId, method) {
    try {
      const chatThreadInfo = await ChatThread.findById(chatThreadId);
      if (!chatThreadInfo) throw new Error('Chat thread not found');

      const participant = await ChatParticipant.findOne({
        threadId: chatThreadId,
        userId,
        isActive: true,
        isDeleted: false,
      });

      if (!participant)
        throw new Error('Chat Thread does not exist for this user');

      const update =
        method === 'archive'
          ? { isArchived: !participant.isArchived }
          : { isPinned: !participant.isPinned };

      await ChatParticipant.findOneAndUpdate(
        { threadId: chatThreadId, userId },
        { $set: update },
      );
    } catch (error) {
      console.error('Error in archiveChatThreadV2:', error);
      throw new Error('Failed to update chat thread archive/pin status');
    }
  }

  static async deleteChatThread(chatThreadId, userId) {
    try {
      const chatThreadInfo = await ChatThread.findById(chatThreadId);
      if (!chatThreadInfo) throw new Error('Chat thread not found');

      const chatThreads = await ChatThread.findOne({
        _id: chatThreadId,
        $or: [{ senderId: userId }, { receiverId: userId }],
      });

      if (!chatThreads) throw new Error('Chat Thread does not exist');

      const updated = await ChatThread.findOneAndUpdate(
        { _id: chatThreadId },
        { $set: { isDeleted: !chatThreads.isDeleted } },
        { new: true },
      );

      return updated;
    } catch (error) {
      console.error('Error in deleteChatThread:', error);
      throw new Error('Failed to delete chat thread');
    }
  }
}
