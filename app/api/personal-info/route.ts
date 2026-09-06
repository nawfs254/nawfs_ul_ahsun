import { NextResponse } from "next/server";
import db, { portfolioData } from "@/lib/db";

export async function GET() {
  try {
    const data = await db.getPersonalInfo();
    return NextResponse.json({
      success: true,
      source: data === portfolioData.personal ? "fallback" : "mongodb",
      data,
    });
  } catch (error: any) {
    console.error("Error fetching personal info from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        source: "fallback",
        data: portfolioData.personal,
        error: error?.message || "Unknown error",
      },
      { status: 200 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await db.updatePersonalInfo(body);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Error updating personal info:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to update personal info",
      },
      { status: 500 }
    );
  }
}
