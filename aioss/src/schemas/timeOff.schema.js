import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    allDay: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: String,
      enum: ["time-off", "sick-leave", "unpaid-leave"],
    },
    startTime: {
      type: Date,
    },
    closeTime: {
      type: Date,
    },
    totalTimeOffDays: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
    collection: "time-off",
  }
);

export const TimeOff = mongoose.model("time-off", leaveSchema);
