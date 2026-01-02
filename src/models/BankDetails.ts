import { Schema, model, models } from "mongoose";

export interface BankDetailsDocument {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bankDetailsSchema = new Schema<BankDetailsDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        bankName: {
            type: String,
            required: true,
            trim: true
        },
        accountNumber: {
            type: String,
            required: true,
            trim: true
        },
        ifscCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        branch: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

bankDetailsSchema.set("toJSON", {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const BankDetailsModel = models.BankDetails || model<BankDetailsDocument>("BankDetails", bankDetailsSchema);

export default BankDetailsModel;
