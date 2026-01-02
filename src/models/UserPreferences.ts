import { Schema, model, models } from "mongoose";

export interface UserPreferencesDocument {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    language: string;
    theme: "light" | "dark" | "system";
    createdAt: Date;
    updatedAt: Date;
}

const userPreferencesSchema = new Schema<UserPreferencesDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            }
        },
        language: {
            type: String,
            default: "en",
            trim: true
        },
        theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system"
        }
    },
    { timestamps: true }
);

userPreferencesSchema.set("toJSON", {
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const UserPreferencesModel = models.UserPreferences || model<UserPreferencesDocument>("UserPreferences", userPreferencesSchema);

export default UserPreferencesModel;
