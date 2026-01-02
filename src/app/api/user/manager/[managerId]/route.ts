import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";

export async function GET(
    _request: NextRequest,
    { params }: { params: { managerId: string } }
) {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return errorResponse("Unauthorized", { status: 401 });
        }

        const { managerId } = params;
        if (!mongoose.Types.ObjectId.isValid(managerId)) {
            return errorResponse("Invalid manager id", { status: 400 });
        }

        const manager = await UserModel.findById(managerId)
            .select("name email phone designation department role")
            .lean() as any;

        if (!manager) {
            return errorResponse("Manager not found", { status: 404 });
        }

        // Check if the manager has manager or admin role
        if (manager.role !== "manager" && manager.role !== "admin") {
            return errorResponse("User is not a manager", { status: 400 });
        }

        return jsonResponse({
            success: true,
            data: {
                name: manager.name,
                email: manager.email,
                phone: manager.phone,
                designation: manager.designation,
                department: manager.department
            }
        });
    } catch (error) {
        return handleApiError("user/manager/get", error);
    }
}
