import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import AttendanceModel from "@/models/Attendance";
import AttendanceEventModel from "@/models/AttendanceEvent";
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

    // Check for existing attendance (for backward compatibility)
    const existingAttendance = await AttendanceModel.findOne({
      user: sessionUser.id,
      date: { $gte: start, $lt: end }
    });

    // Create attendance event (allows multiple check-ins per day)
    const event = await AttendanceEventModel.create({
      user: sessionUser.id,
      type: "check-in",
      timestamp: now,
      date: start,
      notes: parsed.notes,
      deviceInfo: parsed.deviceInfo,
      location:
        parsed.latitude && parsed.longitude
          ? { latitude: parsed.latitude, longitude: parsed.longitude }
          : undefined
    });

    // Create or update attendance record (for backward compatibility)
    let attendance;
    if (existingAttendance) {
      // Update existing attendance with latest check-in
      existingAttendance.checkInAt = now;
      if (parsed.notes) existingAttendance.notes = parsed.notes;
      if (parsed.deviceInfo) existingAttendance.deviceInfo = parsed.deviceInfo;
      if (parsed.latitude && parsed.longitude) {
        existingAttendance.location = {
          latitude: parsed.latitude,
          longitude: parsed.longitude
        };
      }
      await existingAttendance.save();
      attendance = existingAttendance;
    } else {
      attendance = await AttendanceModel.create({
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
    }

    return jsonResponse({
      success: true,
      data: {
        id: attendance._id,
        eventId: event._id,
        checkInAt: attendance.checkInAt,
        status: attendance.status,
        notes: attendance.notes,
        totalCheckInsToday: await AttendanceEventModel.countDocuments({
          user: sessionUser.id,
          type: "check-in",
          date: start
        })
      }
    });
  } catch (error) {
    return handleApiError("attendance/check-in", error);
  }
}



