import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import AttendanceModel from "@/models/Attendance";
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

        const user = await UserModel.findById(userId).lean() as any;
        if (!user) {
            return errorResponse("User not found", { status: 404 });
        }

        // Calculate years with company
        const joinDate = user.joinDate || user.createdAt;
        const yearsWithCompany = joinDate
            ? Number(((Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1))
            : 0;

        // Get attendance stats for the last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const attendanceRecords = await AttendanceModel.find({
            user: userId,
            date: { $gte: ninetyDaysAgo }
        }).lean() as any[];

        const totalDays = 90;
        const presentDays = attendanceRecords.filter(
            (a) => a.status === "present" || a.status === "half-day"
        ).length;
        const attendanceRate = totalDays > 0 ? Number(((presentDays / totalDays) * 100).toFixed(1)) : 0;

        // Calculate average daily hours
        const workRecords = attendanceRecords.filter(
            (a) => a.workDurationMinutes && a.workDurationMinutes > 0
        );
        const totalMinutes = workRecords.reduce(
            (sum, record) => sum + (record.workDurationMinutes || 0),
            0
        );
        const avgDailyHours =
            workRecords.length > 0
                ? Number((totalMinutes / workRecords.length / 60).toFixed(1))
                : 0;

        // Placeholder for performance rating (this would come from a performance review system)
        const performanceRating = 4.5;

        return jsonResponse({
            success: true,
            data: {
                yearsWithCompany,
                attendanceRate,
                avgDailyHours,
                performanceRating
            }
        });
    } catch (error) {
        return handleApiError("user/stats/get", error);
    }
}
