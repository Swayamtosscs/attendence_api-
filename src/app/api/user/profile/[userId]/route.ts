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

        // Check permissions - user can view their own profile, managers can view their team, admins can view all
        if (
            sessionUser.role !== "admin" &&
            sessionUser.id !== userId &&
            sessionUser.role !== "manager"
        ) {
            return errorResponse("Forbidden", { status: 403 });
        }

        const user = await UserModel.findById(userId)
            .select("-passwordHash")
            .populate("manager", "name email phone designation")
            .lean() as (Omit<UserDocument, "passwordHash"> & { manager?: any }) | null;

        if (!user) {
            return errorResponse("User not found", { status: 404 });
        }

        // Additional permission check for managers
        if (
            sessionUser.role === "manager" &&
            sessionUser.id !== user.manager?._id?.toString() &&
            sessionUser.id !== user._id.toString()
        ) {
            return errorResponse("Forbidden", { status: 403 });
        }

        return jsonResponse({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender,
                bloodGroup: user.bloodGroup,
                address: user.address,
                department: user.department,
                designation: user.designation,
                role: user.role,
                employeeType: user.employeeType,
                manager: user.manager,
                joinDate: user.joinDate,
                workLocation: user.workLocation,
                shiftTiming: user.shiftTiming,
                team: user.team,
                status: user.status,
                profilePicture: user.profilePicture,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        return handleApiError("user/profile/get", error);
    }
}

export async function PUT(
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

        const body = await request.json();

        // Find the user to update
        const user = await UserModel.findById(userId);
        if (!user) {
            return errorResponse("User not found", { status: 404 });
        }

        // Check permissions
        const isSelfUpdate = sessionUser.id === userId;
        const canManage =
            sessionUser.role === "admin" ||
            (sessionUser.role === "manager" && user.role === "employee");

        if (!isSelfUpdate && !canManage) {
            return errorResponse("Forbidden", { status: 403 });
        }

        // Update fields
        if (body.name !== undefined) user.name = body.name;
        if (body.phone !== undefined) user.phone = body.phone;
        if (body.dob !== undefined) user.dob = body.dob ? new Date(body.dob) : undefined;
        if (body.gender !== undefined) user.gender = body.gender;
        if (body.bloodGroup !== undefined) user.bloodGroup = body.bloodGroup;
        if (body.address !== undefined) user.address = body.address;

        // Only managers/admins can update these fields
        if (canManage) {
            if (body.department !== undefined) user.department = body.department;
            if (body.designation !== undefined) user.designation = body.designation;
            if (body.role !== undefined) user.role = body.role;
            if (body.employeeType !== undefined) user.employeeType = body.employeeType;
            if (body.joinDate !== undefined) user.joinDate = body.joinDate ? new Date(body.joinDate) : undefined;
            if (body.workLocation !== undefined) user.workLocation = body.workLocation;
            if (body.shiftTiming !== undefined) user.shiftTiming = body.shiftTiming;
            if (body.team !== undefined) user.team = body.team;
            if (body.status !== undefined) user.status = body.status;
            if (body.manager !== undefined) {
                user.manager = body.manager
                    ? new mongoose.Types.ObjectId(body.manager)
                    : undefined;
            }
        }

        await user.save();

        // Fetch updated user with populated manager
        const updatedUser = await UserModel.findById(userId)
            .select("-passwordHash")
            .populate("manager", "name email phone designation")
            .lean() as (Omit<UserDocument, "passwordHash"> & { manager?: any }) | null;

        if (!updatedUser) {
            return errorResponse("User not found after update", { status: 404 });
        }

        return jsonResponse({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                dob: updatedUser.dob,
                gender: updatedUser.gender,
                bloodGroup: updatedUser.bloodGroup,
                address: updatedUser.address,
                department: updatedUser.department,
                designation: updatedUser.designation,
                role: updatedUser.role,
                employeeType: updatedUser.employeeType,
                manager: updatedUser.manager,
                joinDate: updatedUser.joinDate,
                workLocation: updatedUser.workLocation,
                shiftTiming: updatedUser.shiftTiming,
                team: updatedUser.team,
                status: updatedUser.status,
                profilePicture: updatedUser.profilePicture,
                lastLoginAt: updatedUser.lastLoginAt,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });
    } catch (error) {
        return handleApiError("user/profile/update", error);
    }
}
