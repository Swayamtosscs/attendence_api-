import { Schema, model, models } from "mongoose";

export interface LeaveRequestDocument {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  manager?: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  type: "sick" | "casual" | "earned" | "unpaid" | "other";
  status: "pending" | "approved" | "rejected";
  reason?: string;
  reply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<LeaveRequestDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ["sick", "casual", "earned", "unpaid", "other"],
      default: "other"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    reason: String,
    reply: String
  },
  { timestamps: true }
);

leaveRequestSchema.index({ user: 1, startDate: 1 });

const LeaveRequestModel =
  models.LeaveRequest ||
  model<LeaveRequestDocument>("LeaveRequest", leaveRequestSchema);

export default LeaveRequestModel;



