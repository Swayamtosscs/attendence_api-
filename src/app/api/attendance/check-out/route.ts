import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import AttendanceModel from "@/models/Attendance";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";
import { attendanceCheckOutSchema } from "@/lib/validators";

function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return errorResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const parsed = attendanceCheckOutSchema.parse(body);

    await connectDB();

    const now = new Date();
    const { start, end } = getDayRange(now);

    const attendance = await AttendanceModel.findOne({
      user: sessionUser.id,
      date: { $gte: start, $lt: end }
    });

    if (!attendance) {
      return errorResponse("No check-in found for today", { status: 404 });
    }

    if (attendance.checkOutAt) {
      return errorResponse("Already checked out for today", { status: 409 });
    }

    attendance.checkOutAt = now;
    attendance.notes = parsed.notes ?? attendance.notes;
    await attendance.save();

    return jsonResponse({
      success: true,
      data: {
        id: attendance._id,
        checkInAt: attendance.checkInAt,
        checkOutAt: attendance.checkOutAt,
        workDurationMinutes: attendance.workDurationMinutes
      }
    });
  } catch (error) {
    return handleApiError("attendance/check-out", error);
  }
}



