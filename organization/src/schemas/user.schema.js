import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    firstName: {
      required: true,
      type: String,
      trim: true,
      lowercase: true,
    },
    lastName: {
      required: true,
      type: String,
      trim: true,
      lowercase: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'facebook', 'email'],
    },
    providerId: {
      type: String,
    },
    logo: {
      type: String,
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
  },
);

export const User = mongoose.model('User', userSchema);
