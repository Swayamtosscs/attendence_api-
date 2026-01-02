import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import EmergencyContactModel from "@/models/EmergencyContact";
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

        const emergencyContact = await EmergencyContactModel.findOne({
            userId: userId
        }).lean() as any;

        if (!emergencyContact) {
            return jsonResponse({
                success: true,
                data: null
            });
        }

        return jsonResponse({
            success: true,
            data: {
                contactName: emergencyContact.contactName,
                relationship: emergencyContact.relationship,
                phone: emergencyContact.phone,
                address: emergencyContact.address
            }
        });
    } catch (error) {
        return handleApiError("user/emergency-contact/get", error);
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

        // Check permissions - only user themselves or admin can update
        if (sessionUser.role !== "admin" && sessionUser.id !== userId) {
            return errorResponse("Forbidden", { status: 403 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.contactName || !body.relationship || !body.phone) {
            return errorResponse("Missing required fields: contactName, relationship, phone", {
                status: 400
            });
        }

        // Update or create emergency contact
        const emergencyContact = await EmergencyContactModel.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                contactName: body.contactName,
                relationship: body.relationship,
                phone: body.phone,
                address: body.address
            },
            { upsert: true, new: true, lean: true }
        ) as any;

        if (!emergencyContact) {
            return errorResponse("Failed to save emergency contact", { status: 500 });
        }

        return jsonResponse({
            success: true,
            data: {
                contactName: emergencyContact.contactName,
                relationship: emergencyContact.relationship,
                phone: emergencyContact.phone,
                address: emergencyContact.address
            }
        });
    } catch (error) {
        return handleApiError("user/emergency-contact/update", error);
    }
}
