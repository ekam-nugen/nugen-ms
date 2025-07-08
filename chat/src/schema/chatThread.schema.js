import mongoose from 'mongoose';

const chatThreadSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      // required: true,
    },
    title: {
      type: String,
    },
    lastMessage: {
      type: String,
      ref: 'Message',
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupCreatedBy: {
      type: mongoose.Types.ObjectId,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'audio', 'video'],
      default: 'text',
    },
    archiveThreadUserId: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    muteTheradUserId: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    pinThread: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    isChatDeleted: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'chat-thread',
    timestamps: true,
  },
);

export const ChatThread = mongoose.model('ChatThread', chatThreadSchema);
