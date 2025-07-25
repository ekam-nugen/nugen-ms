import mongoose from "mongoose";

const timeClockSchema = new mongoose.Schema(
  {
    organisationId: {
      type: mongoose.Types.ObjectId,
    },
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    clockIn: {
      type: Date,
    },
    clockOut: {
      type: Date,
    },
    isClockIn: {
      type: Boolean,
      default: false,
    },
    isClockOut: {
      type: Boolean,
      default: false,
    },
    totalHoursClockedIn: {
      type: Number,
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
    collection: "time-log",
  }
);

export const TimeLog = mongoose.model("time-log", timeClockSchema);
