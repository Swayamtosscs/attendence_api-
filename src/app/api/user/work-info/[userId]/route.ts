import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import UserModel, { UserDocument } from "@/models/User";
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

        // Check permissions
        if (
            sessionUser.role !== "admin" &&
            sessionUser.id !== userId &&
            sessionUser.role !== "manager"
        ) {
            return errorResponse("Forbidden", { status: 403 });
        }

        const user = await UserModel.findById(userId)
            .select(
                "department designation role employeeType manager joinDate workLocation shiftTiming team"
            )
            .populate("manager", "name email phone designation")
            .lean() as (Partial<UserDocument> & { manager?: any }) | null;

        if (!user) {
            return errorResponse("User not found", { status: 404 });
        }

        // Additional permission check for managers
        if (
            sessionUser.role === "manager" &&
            sessionUser.id !== user.manager?._id?.toString() &&
            sessionUser.id !== userId
        ) {
            return errorResponse("Forbidden", { status: 403 });
        }

        return jsonResponse({
            success: true,
            data: {
                department: user.department,
                designation: user.designation,
                role: user.role,
                employeeType: user.employeeType,
                managerId: user.manager?._id,
                managerName: user.manager?.name,
                managerEmail: user.manager?.email,
                managerPhone: user.manager?.phone,
                managerDesignation: user.manager?.designation,
                joinDate: user.joinDate,
                workLocation: user.workLocation,
                shiftTiming: user.shiftTiming,
                team: user.team
            }
        });
    } catch (error) {
        return handleApiError("user/work-info/get", error);
    }
}
