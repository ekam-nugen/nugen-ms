import mongoose from 'mongoose';

const userOrganizationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
  },
  { timestamps: true },
);

export const UserOrganization = mongoose.model(
  'UserOrganization',
  userOrganizationSchema,
);
