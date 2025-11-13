import { Schema, model, models } from "mongoose";

export interface AttendanceDocument {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  date: Date;
  checkInAt: Date;
  checkOutAt?: Date;
  workDurationMinutes?: number;
  status: "present" | "absent" | "half-day" | "on-leave";
  lateByMinutes?: number;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  deviceInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<AttendanceDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    checkInAt: {
      type: Date,
      required: true
    },
    checkOutAt: {
      type: Date
    },
    workDurationMinutes: {
      type: Number
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "on-leave"],
      default: "present"
    },
    lateByMinutes: Number,
    notes: String,
    location: {
      latitude: Number,
      longitude: Number
    },
    deviceInfo: String
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

attendanceSchema.pre("save", function calculateWorkDuration(next) {
  if (this.checkInAt && this.checkOutAt) {
    const diffMs = this.checkOutAt.getTime() - this.checkInAt.getTime();
    this.workDurationMinutes = Math.round(diffMs / (1000 * 60));
  }
  next();
});

const AttendanceModel =
  models.Attendance || model<AttendanceDocument>("Attendance", attendanceSchema);

export default AttendanceModel;



