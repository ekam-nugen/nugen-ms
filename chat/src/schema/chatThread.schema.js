import mongoose from 'mongoose';

const chatThreadSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    lastMessage: {
      type: String,
      ref: 'Message',
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'audio', 'video'],
      default: 'text',
    },
    archiveTheradUserId: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    muteTheradUserId: {
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
