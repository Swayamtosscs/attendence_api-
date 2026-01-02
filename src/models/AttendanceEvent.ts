import { Schema, model, models } from "mongoose";

export interface AttendanceEventDocument {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  type: "check-in" | "check-out";
  timestamp: Date;
  date: Date; // Date only (for grouping)
  location?: {
    latitude: number;
    longitude: number;
  };
  deviceInfo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceEventSchema = new Schema<AttendanceEventDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["check-in", "check-out"],
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    deviceInfo: String,
    notes: String
  },
  { timestamps: true }
);

// Index for efficient queries
attendanceEventSchema.index({ user: 1, date: 1, type: 1 });
attendanceEventSchema.index({ user: 1, timestamp: -1 });
attendanceEventSchema.index({ date: 1, type: 1 });

const AttendanceEventModel =
  models.AttendanceEvent ||
  model<AttendanceEventDocument>("AttendanceEvent", attendanceEventSchema);

export default AttendanceEventModel;

