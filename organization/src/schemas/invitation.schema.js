import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'used', 'expired'],
    default: 'pending',
  },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Invitation = mongoose.model('Invitation', InvitationSchema);
