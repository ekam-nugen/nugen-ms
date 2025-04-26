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
      required: function () {
        return this.provider === 'email';
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'facebook', 'email'],
    },
    providerId: {
      type: String,
      required: function () {
        return this.provider !== 'email';
      },
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
