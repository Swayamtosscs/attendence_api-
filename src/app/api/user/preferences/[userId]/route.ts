import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import UserPreferencesModel from "@/models/UserPreferences";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";

export async function GET(
    _request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return errorResponse("Unauthorized", { status: 401 });
        }

        const { userId } = params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return errorResponse("Invalid user id", { status: 400 });
        }

        // Only user themselves can view their preferences
        if (sessionUser.id !== userId) {
            return errorResponse("Forbidden", { status: 403 });
        }

        let preferences = await UserPreferencesModel.findOne({
            userId: userId
        }).lean() as any;

        // If no preferences exist, create default ones
        if (!preferences) {
            const newPreferences = await UserPreferencesModel.create({
                userId: userId,
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                },
                language: "en",
                theme: "system"
            });
            preferences = newPreferences.toJSON();
        }

        return jsonResponse({
            success: true,
            data: {
                notifications: preferences.notifications,
                language: preferences.language,
                theme: preferences.theme
            }
        });
    } catch (error) {
        return handleApiError("user/preferences/get", error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return errorResponse("Unauthorized", { status: 401 });
        }

        const { userId } = params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return errorResponse("Invalid user id", { status: 400 });
        }

        // Only user themselves can update their preferences
        if (sessionUser.id !== userId) {
            return errorResponse("Forbidden", { status: 403 });
        }

        const body = await request.json();

        const updateData: any = {};

        if (body.notifications !== undefined) {
            updateData.notifications = body.notifications;
        }
        if (body.language !== undefined) {
            updateData.language = body.language;
        }
        if (body.theme !== undefined) {
            updateData.theme = body.theme;
        }

        // Update or create preferences
        const preferences = await UserPreferencesModel.findOneAndUpdate(
            { userId: userId },
            { userId: userId, ...updateData },
            { upsert: true, new: true, lean: true }
        ) as any;

        if (!preferences) {
            return errorResponse("Failed to save preferences", { status: 500 });
        }

        return jsonResponse({
            success: true,
            data: {
                notifications: preferences.notifications,
                language: preferences.language,
                theme: preferences.theme
            }
        });
    } catch (error) {
        return handleApiError("user/preferences/update", error);
    }
}
