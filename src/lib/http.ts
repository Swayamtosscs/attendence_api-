import { NextResponse } from "next/server";

interface ErrorResponseOptions {
  status?: number;
  code?: string;
  details?: unknown;
}

export function jsonResponse<T>(
  data: T,
  init?: ResponseInit
): NextResponse<T> {
  return NextResponse.json(data, init);
}

export function errorResponse(
  message: string,
  { status = 400, code, details }: ErrorResponseOptions = {}
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
      details
    },
    { status }
  );
}



