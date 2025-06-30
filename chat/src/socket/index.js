import { Server } from 'socket.io';
import { Message } from '../schema/chat.schema.js';
import { ChatThread } from '../schema/chatThread.schema.js';
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

        // fetch all chat threads for the user
        const chatThreads = await ChatThread.find({
          $or: [{ senderId: userId }, { receiverId: userId }],
          isDeleted: false,
        });

        // Join all chatrooms
        for (const chatroomId of chatThreads) {
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
        content,
        groupChat = false,
        imageUrl = null,
      }) => {
        try {
          if (!senderId || !receiverId || (!content && !imageUrl)) {
            socket.emit('error', { message: 'Invalid message format' });
            return;
          }
          const checkChatThreadExist = await ChatThread.findOne({
            $or: [
              { senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          });
          let chatThread = {};

          if (!checkChatThreadExist) {
            chatThread = new ChatThread({
              senderId,
              receiverId: receiverId,
              groupChat: false,
              lastMessage: content,
            });
            await chatThread.save();
          } else {
            await ChatThread.findByIdAndUpdate(checkChatThreadExist._id, {
              lastMessage: content,
            });
          }

          // Create message in database
          let chatThreadId = checkChatThreadExist
            ? checkChatThreadExist._id
            : chatThread._id;

          // console.log('chatThreadId');
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

          // Broadcast message to the receiver's userId room

          io.to(chatThreadId?.toString()).emit('newMessage', message);

          socket.emit('messageSent', message);
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
