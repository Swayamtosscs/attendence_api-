import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import BankDetailsModel from "@/models/BankDetails";
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

        // Check permissions - only user themselves or admin/HR can view
        if (sessionUser.role !== "admin" && sessionUser.id !== userId) {
            return errorResponse("Forbidden", { status: 403 });
        }

        const bankDetails = await BankDetailsModel.findOne({
            userId: userId
        }).lean() as any;

        if (!bankDetails) {
            return jsonResponse({
                success: true,
                data: null
            });
        }

        return jsonResponse({
            success: true,
            data: {
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNumber,
                ifscCode: bankDetails.ifscCode,
                branch: bankDetails.branch
            }
        });
    } catch (error) {
        return handleApiError("user/bank-details/get", error);
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
        if (!body.bankName || !body.accountNumber || !body.ifscCode) {
            return errorResponse(
                "Missing required fields: bankName, accountNumber, ifscCode",
                { status: 400 }
            );
        }

        // Update or create bank details
        const bankDetails = await BankDetailsModel.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                bankName: body.bankName,
                accountNumber: body.accountNumber,
                ifscCode: body.ifscCode.toUpperCase(),
                branch: body.branch
            },
            { upsert: true, new: true, lean: true }
        ) as any;

        if (!bankDetails) {
            return errorResponse("Failed to save bank details", { status: 500 });
        }

        return jsonResponse({
            success: true,
            data: {
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNumber,
                ifscCode: bankDetails.ifscCode,
                branch: bankDetails.branch
            }
        });
    } catch (error) {
        return handleApiError("user/bank-details/update", error);
    }
}
