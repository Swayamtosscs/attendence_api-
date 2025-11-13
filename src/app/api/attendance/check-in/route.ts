import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import AttendanceModel from "@/models/Attendance";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";
import { attendanceCheckInSchema } from "@/lib/validators";

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
    const parsed = attendanceCheckInSchema.parse(body);

    await connectDB();

    const now = new Date();
    const { start, end } = getDayRange(now);

    const existingAttendance = await AttendanceModel.findOne({
      user: sessionUser.id,
      date: { $gte: start, $lt: end }
    });

    if (existingAttendance) {
      return errorResponse("Already checked in for today", { status: 409 });
    }

    const attendance = await AttendanceModel.create({
      user: sessionUser.id,
      date: start,
      checkInAt: now,
      status: "present",
      notes: parsed.notes,
      deviceInfo: parsed.deviceInfo,
      location:
        parsed.latitude && parsed.longitude
          ? { latitude: parsed.latitude, longitude: parsed.longitude }
          : undefined
    });

    return jsonResponse({
      success: true,
      data: {
        id: attendance._id,
        checkInAt: attendance.checkInAt,
        status: attendance.status,
        notes: attendance.notes
      }
    });
  } catch (error) {
    return handleApiError("attendance/check-in", error);
  }
}



