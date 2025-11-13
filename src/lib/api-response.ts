import { NextResponse } from "next/server";
import { errorResponse } from "./http";
import { logApiError } from "./api-logger";

export function handleApiError(route: string, error: unknown): NextResponse {
  logApiError(route, error);

  if (error instanceof Error) {
    switch (error.message) {
      case "Unauthorized":
        return errorResponse("Unauthorized", { status: 401 });
      case "Forbidden":
        return errorResponse("Forbidden", { status: 403 });
      default:
        return errorResponse(error.message, { status: 400 });
    }
  }

  return errorResponse("Unexpected error", { status: 500 });
}



