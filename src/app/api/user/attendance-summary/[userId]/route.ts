import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import AttendanceModel from "@/models/Attendance";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";

export async function GET(
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

        // Check permissions
        if (
            sessionUser.role !== "admin" &&
            sessionUser.id !== userId &&
            sessionUser.role !== "manager"
        ) {
            return errorResponse("Forbidden", { status: 403 });
        }

        // Get query parameters for date range
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        // Default to last 30 days if no date range provided
        const endDate = endDateParam ? new Date(endDateParam) : new Date();
        const startDate = startDateParam
            ? new Date(startDateParam)
            : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Fetch attendance records
        const attendanceRecords = await AttendanceModel.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).lean() as any[];

        // Calculate statistics
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(
            (a) => a.status === "present"
        ).length;
        const halfDays = attendanceRecords.filter(
            (a) => a.status === "half-day"
        ).length;
        const absentDays = attendanceRecords.filter(
            (a) => a.status === "absent"
        ).length;
        const onLeaveDays = attendanceRecords.filter(
            (a) => a.status === "on-leave"
        ).length;

        // Calculate average hours
        const workRecords = attendanceRecords.filter(
            (a) => a.workDurationMinutes && a.workDurationMinutes > 0
        );
        const totalMinutes = workRecords.reduce(
            (sum, record) => sum + (record.workDurationMinutes || 0),
            0
        );
        const avgHours =
            workRecords.length > 0
                ? Number((totalMinutes / workRecords.length / 60).toFixed(2))
                : 0;

        // Calculate late count
        const lateCount = attendanceRecords.filter(
            (a) => a.lateByMinutes && a.lateByMinutes > 0
        ).length;

        return jsonResponse({
            success: true,
            data: {
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
                totalDays,
                presentDays,
                halfDays,
                absentDays,
                onLeaveDays,
                avgHours,
                lateCount
            }
        });
    } catch (error) {
        return handleApiError("user/attendance-summary/get", error);
    }
}
