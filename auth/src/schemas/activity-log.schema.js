import mongoose from 'mongoose';

const userActivityLogSchema = new mongoose.Schema(
  {
    organisationId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'other'],
    },
    description: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['project', 'task', 'timeclock', 'user', 'organisation', 'other'],
    },
    resourceId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'activity-log',
  },
);

export const UserActivityLog = mongoose.model(
  'activity-log',
  userActivityLogSchema,
);
