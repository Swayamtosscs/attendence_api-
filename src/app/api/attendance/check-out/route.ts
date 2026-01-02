import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import AttendanceModel from "@/models/Attendance";
import AttendanceEventModel from "@/models/AttendanceEvent";
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

    // Check if there's at least one check-in today
    const checkInCount = await AttendanceEventModel.countDocuments({
      user: sessionUser.id,
      type: "check-in",
      date: start
    });

    if (checkInCount === 0) {
      return errorResponse("No check-in found for today", { status: 404 });
    }

    // Create attendance event (allows multiple check-outs per day)
    const event = await AttendanceEventModel.create({
      user: sessionUser.id,
      type: "check-out",
      timestamp: now,
      date: start,
      notes: parsed.notes,
      deviceInfo: parsed.deviceInfo,
      location:
        parsed.latitude && parsed.longitude
          ? { latitude: parsed.latitude, longitude: parsed.longitude }
          : undefined
    });

    // Update attendance record (for backward compatibility)
    const attendance = await AttendanceModel.findOne({
      user: sessionUser.id,
      date: { $gte: start, $lt: end }
    });

    if (attendance) {
      attendance.checkOutAt = now;
      if (parsed.notes) attendance.notes = parsed.notes;
      await attendance.save();
    }

    return jsonResponse({
      success: true,
      data: {
        eventId: event._id,
        checkOutAt: now,
        checkInAt: attendance?.checkInAt,
        workDurationMinutes: attendance?.workDurationMinutes,
        totalCheckOutsToday: await AttendanceEventModel.countDocuments({
          user: sessionUser.id,
          type: "check-out",
          date: start
        })
      }
    });
  } catch (error) {
    return handleApiError("attendance/check-out", error);
  }
}



