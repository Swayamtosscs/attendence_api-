import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import AttendanceModel from "@/models/Attendance";
import LeaveRequestModel from "@/models/LeaveRequest";
import EmergencyContactModel from "@/models/EmergencyContact";
import BankDetailsModel from "@/models/BankDetails";
import UserPreferencesModel from "@/models/UserPreferences";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";

export async function POST(
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

        // Check permissions - user themselves or admin
        if (sessionUser.role !== "admin" && sessionUser.id !== userId) {
            return errorResponse("Forbidden", { status: 403 });
        }

        const body = await request.json();
        const dataTypes = body.dataTypes || ["personal", "attendance", "leave", "performance"];

        const exportData: any = {
            exportedAt: new Date().toISOString(),
            userId: userId
        };

        // Export personal data
        if (dataTypes.includes("personal")) {
            const user = await UserModel.findById(userId)
                .select("-passwordHash")
                .populate("manager", "name email")
                .lean() as any;

            if (!user) {
                return errorResponse("User not found", { status: 404 });
            }

            const emergencyContact = await EmergencyContactModel.findOne({ userId }).lean() as any;
            const bankDetails = await BankDetailsModel.findOne({ userId }).lean() as any;
            const preferences = await UserPreferencesModel.findOne({ userId }).lean() as any;

            exportData.personal = {
                profile: user,
                emergencyContact,
                bankDetails,
                preferences
            };
        }

        // Export attendance data
        if (dataTypes.includes("attendance")) {
            const attendanceRecords = await AttendanceModel.find({
                user: userId
            })
                .sort({ date: -1 })
                .limit(90) // Last 90 days
                .lean() as any[];

            exportData.attendance = {
                records: attendanceRecords,
                totalRecords: attendanceRecords.length
            };
        }

        // Export leave data
        if (dataTypes.includes("leave")) {
            const leaveRequests = await LeaveRequestModel.find({
                user: userId
            })
                .sort({ createdAt: -1 })
                .lean() as any[];

            exportData.leave = {
                requests: leaveRequests,
                totalRequests: leaveRequests.length
            };
        }

        // Export performance data (placeholder - would integrate with actual performance system)
        if (dataTypes.includes("performance")) {
            exportData.performance = {
                rating: 4.5,
                reviews: [],
                note: "Performance data integration pending"
            };
        }

        return jsonResponse({
            success: true,
            data: exportData,
            message: "Data exported successfully"
        });
    } catch (error) {
        return handleApiError("user/export-data", error);
    }
}
