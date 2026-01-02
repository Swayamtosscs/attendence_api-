import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return errorResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.currentPassword || !body.newPassword) {
            return errorResponse("Missing required fields: currentPassword, newPassword", {
                status: 400
            });
        }

        // Validate new password strength
        if (body.newPassword.length < 6) {
            return errorResponse("New password must be at least 6 characters long", {
                status: 400
            });
        }

        // Get user with password hash
        const user = await UserModel.findById(sessionUser.id);
        if (!user) {
            return errorResponse("User not found", { status: 404 });
        }

        // Verify current password
        const isValidPassword = await verifyPassword(
            body.currentPassword,
            user.passwordHash
        );

        if (!isValidPassword) {
            return errorResponse("Current password is incorrect", { status: 401 });
        }

        // Hash and update new password
        user.passwordHash = await hashPassword(body.newPassword);
        await user.save();

        return jsonResponse({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return handleApiError("user/change-password", error);
    }
}
