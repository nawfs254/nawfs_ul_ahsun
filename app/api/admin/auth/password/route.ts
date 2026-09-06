import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = token ? verifyToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();
    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 4 characters" },
        { status: 400 }
      );
    }

    const isCurrentValid = await db.verifyAdmin(session.username, currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    await db.updateAdminPassword(session.username, newPassword.trim());

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
