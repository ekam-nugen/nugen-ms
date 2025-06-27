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
    isArchive: {
      type: Boolean,
      default: false,
    },
    isMute: {
      type: Boolean,
      default: false,
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
