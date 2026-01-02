import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import WorkLocationModel from "@/models/WorkLocation";
import { handleApiError } from "@/lib/api-response";
import { errorResponse, jsonResponse } from "@/lib/http";
import { getSessionUser } from "@/lib/current-user";
import { workLocationUpdateSchema } from "@/lib/validators";

function ensureObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid location id");
  }
  return new mongoose.Types.ObjectId(id);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getSessionUser(false);
    if (!sessionUser) {
      return errorResponse("Unauthorized", { status: 401 });
    }

    const locationId = ensureObjectId(params.id);

    await connectDB();
    const workLocation = await WorkLocationModel.findById(locationId)
      .populate("createdBy", "name email")
      .lean();

    if (!workLocation) {
      return errorResponse("Location not found", { status: 404 });
    }

    const location = workLocation as any;

    return jsonResponse({
      success: true,
      data: {
        id: location._id.toString(),
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        radius: location.radius,
        createdBy: location.createdBy
          ? {
              id: (location.createdBy as any)._id?.toString(),
              name: (location.createdBy as any).name,
              email: (location.createdBy as any).email
            }
          : undefined,
        isActive: location.isActive,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid location id") {
      return errorResponse("Invalid location id", { status: 400 });
    }
    return handleApiError("work-locations/get", error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getSessionUser(false);
    if (!sessionUser) {
      return errorResponse("Unauthorized", { status: 401 });
    }

    const locationId = ensureObjectId(params.id);
    const body = await request.json();
    const parsed = workLocationUpdateSchema.parse(body);

    await connectDB();
    const workLocation = await WorkLocationModel.findById(locationId);

    if (!workLocation) {
      return errorResponse("Location not found", { status: 404 });
    }

    if (parsed.name !== undefined) {
      workLocation.name = parsed.name;
    }
    if (parsed.latitude !== undefined) {
      workLocation.latitude = parsed.latitude;
    }
    if (parsed.longitude !== undefined) {
      workLocation.longitude = parsed.longitude;
    }
    if (parsed.radius !== undefined) {
      workLocation.radius = parsed.radius;
    }
    if (parsed.isActive !== undefined) {
      workLocation.isActive = parsed.isActive;
    }

    await workLocation.save();

    return jsonResponse({
      success: true,
      message: "Location updated successfully",
      data: {
        id: workLocation._id.toString(),
        name: workLocation.name,
        latitude: workLocation.latitude,
        longitude: workLocation.longitude,
        radius: workLocation.radius,
        isActive: workLocation.isActive,
        createdAt: workLocation.createdAt,
        updatedAt: workLocation.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid location id") {
      return errorResponse("Invalid location id", { status: 400 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      const zodError = error as any;
      const firstError = zodError.errors?.[0];
      if (firstError) {
        let errorMessage = "Invalid location data";
        if (firstError.path.includes("latitude")) {
          errorMessage = "Latitude must be between -90 and 90";
        } else if (firstError.path.includes("longitude")) {
          errorMessage = "Longitude must be between -180 and 180";
        } else if (firstError.path.includes("radius")) {
          errorMessage = "Radius must be between 1 and 10000 meters";
        }
        return errorResponse(errorMessage, { status: 400 });
      }
    }
    return handleApiError("work-locations/update", error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getSessionUser(false);
    if (!sessionUser) {
      return errorResponse("Unauthorized", { status: 401 });
    }

    const locationId = ensureObjectId(params.id);

    await connectDB();
    const workLocation = await WorkLocationModel.findById(locationId);

    if (!workLocation) {
      return errorResponse("Location not found", { status: 404 });
    }

    // Soft delete - set isActive to false
    workLocation.isActive = false;
    await workLocation.save();

    return jsonResponse({
      success: true,
      message: "Location deleted successfully"
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid location id") {
      return errorResponse("Invalid location id", { status: 400 });
    }
    return handleApiError("work-locations/delete", error);
  }
}

