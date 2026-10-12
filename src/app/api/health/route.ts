import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "UP",
    service: "flora-fusion-frontend",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
}
