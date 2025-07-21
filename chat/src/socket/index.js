import { Server } from 'socket.io';
import { Message } from '../schema/chat.schema.js';
import { ChatThread } from '../schema/chatThread.schema.js';
import { Types } from 'mongoose';
import { ChatParticipant } from '../schema/chatParticipants.schema.js';
import { User } from '../schema/user.schema.js';
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', async (socket) => {
    console.log('a user connected', socket.id);

    // Initial connection - fetch and join all user's chatrooms
    socket.on('initialize', async ({ userId }) => {
      try {
        if (!userId) {
          socket.emit('error', { message: 'Invalid user ID' });
          return;
        }
        //note: Join notification room
        socket.join(userId.toString());
        console.log(`User ${userId} joined their personal notification room`);

        // fetch all one to one chat threads for the user
        const chatThreads = await ChatThread.find({
          $or: [{ senderId: userId }, { receiverId: userId }],
          isDeleted: false,
        });

        //fetch all group chat threads for the user;
        const getUserGroupChatThreads = await ChatThread.aggregate([
          {
            $match: {
              isGroupChat: true,
              isActive: true,
            },
          },
          {
            $lookup: {
              from: 'chat-participant',
              localField: '_id',
              foreignField: 'threadId',
              as: 'memberInfo',
            },
          },
          {
            $unwind: {
              path: '$memberInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              userId: '$memberInfo.userId',
            },
          },
          {
            $match: {
              userId: new Types.ObjectId(userId),
            },
          },
          {
            $project: {
              memberInfo: 0,
            },
          },
        ]);

        chatThreads.push(...getUserGroupChatThreads);

        // Join all chatroom
        for (const chatroomId of chatThreads) {
          // update chat participant to initialized status
          await ChatParticipant.findOneAndUpdate(
            {
              threadId: chatroomId?._id,
              userId: userId,
            },
            { isUserInitialized: true },
            { new: true, upsert: true },
          );
          // Join the chatroom
          console.log('chat room  id ', chatroomId?._id?.toString());
          socket.join(chatroomId?._id?.toString());
          console.log(`User ${userId} joined chatroom ${chatroomId}`);
        }

        // Send confirmation to client with list of joined chatrooms
        socket.emit('chatroomsJoined', {
          userId,
          chatThread: Array.from(chatThreads),
        });
      } catch (error) {
        console.error('Error initializing user chatrooms:', error);
        socket.emit('error', { message: 'Failed to join chatrooms' });
      }
    });
    // Send message
    socket.on(
      'sendMessage',
      async ({
        senderId,
        receiverId,
        chatThreadId,
        content,
        groupChat = false,
        imageUrl = null,
      }) => {
        try {
          if (!senderId || !chatThreadId || (!content && !imageUrl)) {
            socket.emit('error', { message: 'Invalid message format' });
            return;
          }

          //check if chatThreadId is valid
          if (!Types.ObjectId.isValid(chatThreadId) || !chatThreadId) {
            console.log('Invalid chat thread ID:', chatThreadId);
            socket.emit('error', { message: 'Invalid chat thread ID' });
            return;
          }

          if (!Types.ObjectId.isValid(senderId) || !senderId) {
            console.log('Invalid sender ID:', senderId);
            socket.emit('error', { message: 'Invalid sender ID' });
            return;
          }

          const sendUserInfo = await User.findOne(
            {
              _id: senderId,
              isDeleted: false,
            },
            {
              firstName: 1,
              lastName: 1,
              email: 1,
              image: 1,
            },
          );
          if (!sendUserInfo) {
            console.log('Sender user not found', senderId);
            socket.emit('error', { message: 'Sender user not found' });
            return;
          }

          // check if chatThread exists
          const chatThread = await ChatThread.findById(chatThreadId);

          if (!chatThread) {
            socket.emit('error', { message: 'Chat thread does not exist' });
            return;
          }

          await ChatThread.findByIdAndUpdate(chatThreadId, {
            lastMessage: content,
          });

          // check for user ChatThread initialized
          const userParticipantsInfo = await ChatParticipant.find({
            threadId: chatThreadId,
            isUserInitialized: false,
          });

          // Create chat participant if not exists

          const message = new Message({
            senderId,
            receiverId,
            groupChat,
            chatThreadId: chatThreadId,
            imageUrl,
            messageContent: content,
            isActive: true,
          });

          await message.save();
          const newMessage = message.toObject();
          newMessage.userInfo = sendUserInfo;
          io.to(chatThreadId?.toString()).emit('newMessage', newMessage);

          if (userParticipantsInfo.length > 0) {
            for (const user of userParticipantsInfo) {
              let userId = user?.userId;
              console.log('New Chat thread for User ID:', userId);
              if (userId) {
                io.to(userId.toString()).emit('newChatThread', newMessage);
                await ChatParticipant.findOneAndUpdate({
                  threadId: chatThreadId,
                  userId: userId,
                  isUserInitialized: true,
                });
              }
            }
          }

          socket.emit('messageSent', newMessage);
        } catch (error) {
          console.error('Error handling message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      },
    );

    // Handle message reactions
    socket.on('reactToMessage', async ({ messageId, reaction }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        message.messageReaction = reaction;
        await message.save();

        const chatroomId = message.groupChat
          ? message.receiverId[0]
          : [message.senderId, ...message.receiverId].sort().join('_');
        io.to(chatroomId).emit('messageReaction', {
          messageId,
          reaction,
        });
      } catch (error) {
        console.error('Error handling message reaction:', error);
        socket.emit('error', { message: 'Failed to update reaction' });
      }
    });

    // Delete message (soft delete)
    socket.on('deleteMessage', async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        message.isDeleted = true;
        await message.save();

        const chatroomId = message.groupChat
          ? message.receiverId[0]
          : [message.senderId, ...message.receiverId].sort().join('_');
        io.to(chatroomId).emit('messageDeleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  global.io = io;
  return io;
};
