import mongoose from 'mongoose';

const roleEntityRoutes = new mongoose.Schema(
  {
    entityId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    route: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    method: {
      type: String,
      trim: true,
      enum: ['get', 'post', 'put', 'delete', 'patch'],
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
    timestamps: true,
    collection: 'role-entity-route',
  },
);

export const RoleEntityRoutes = mongoose.model(
  'role-entity-route',
  roleEntityRoutes,
);
