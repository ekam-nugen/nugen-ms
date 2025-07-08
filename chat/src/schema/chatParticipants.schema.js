import mongoose from 'mongoose';

const chatParticipantSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Types.ObjectId,
      ref: 'ChatThread',
      required: true,
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },

    // Group-specific
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },

    // Direct chat: user-specific view customization
    customImage: { type: String },
    customName: { type: String },

    // Common per-user controls
    isMuted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'chat-participant' },
);

export const ChatParticipant = mongoose.model(
  'chat-participant',
  chatParticipantSchema,
);
