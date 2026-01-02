import { Schema, model, models } from "mongoose";

export interface EmergencyContactDocument {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    contactName: string;
    relationship: string;
    phone: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

const emergencyContactSchema = new Schema<EmergencyContactDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        contactName: {
            type: String,
            required: true,
            trim: true
        },
        relationship: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

emergencyContactSchema.set("toJSON", {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const EmergencyContactModel = models.EmergencyContact || model<EmergencyContactDocument>("EmergencyContact", emergencyContactSchema);

export default EmergencyContactModel;
