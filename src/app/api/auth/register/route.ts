import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { hashPassword, signAuthToken, setAuthCookie } from "@/lib/auth";
import { registerUserSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerUserSchema.parse(body);

    await connectDB();

    const existingUser = await UserModel.findOne({ email: parsed.email });

    if (existingUser) {
      return errorResponse("Email already registered", { status: 409 });
    }

    const totalUsers = await UserModel.countDocuments();
    const passwordHash = await hashPassword(parsed.password);

    const user = await UserModel.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: totalUsers === 0 ? "admin" : parsed.role,
      department: parsed.department,
      designation: parsed.designation,
      manager: parsed.managerId
    });

    const token = signAuthToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    });

    setAuthCookie(token);

    return jsonResponse({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation
      }
    });
  } catch (error) {
    return handleApiError("auth/register", error);
  }
}



