import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";

export async function POST() {
  clearAuthCookie();
  return jsonResponse({ success: true });
}



