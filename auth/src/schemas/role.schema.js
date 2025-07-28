import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true },
    description: { type: String },
    companyId: { type: mongoose.Types.ObjectId },
    rolePermissions: {
      type: {},
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'role' },
);

export const Roles = mongoose.model('role', RoleSchema);
