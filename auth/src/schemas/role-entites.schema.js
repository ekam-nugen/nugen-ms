import mongoose from 'mongoose';

const RoleEntitySchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    entityId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    // RoleEntityRouteId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    create: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
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
    timestamps: true,
    collation: 'role-entity',
  },
);

export const RoleEntity = mongoose.model('role-entity', RoleEntitySchema);
