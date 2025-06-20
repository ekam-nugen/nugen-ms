import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    chatThreadId: {
      type: mongoose.Types.ObjectId,
    },
    messageContent: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'audio', 'video'],
      default: 'text',
    },
    // messageReaction: {
    //   type: String,
    // },
    url: {
      type: String,
    },
    isEdited: {
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
    collection: 'message',
    timestamps: true,
  },
);

export const Message = mongoose.model('Message', messageSchema);
