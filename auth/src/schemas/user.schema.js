import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
      required: function () {
        return this.provider !== 'email';
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
