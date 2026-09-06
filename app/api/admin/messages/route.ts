import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/db";
import { ObjectId } from "mongodb";
import { initRealtimeServer } from "@/lib/realtime";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure WebSocket server is listening on port 3001
    try {
      initRealtimeServer();
    } catch (wsErr) {
      console.warn("WebSocket initialization warning:", wsErr);
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("messages");

    const messages = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const total = messages.length;
    const unread = messages.filter((m) => m.status === "unread").length;
    const replied = messages.filter((m) => m.status === "replied").length;
    const read = messages.filter((m) => m.status === "read").length;

    return NextResponse.json({
      success: true,
      data: messages,
      stats: {
        total,
        unread,
        replied,
        read,
      },
    });
  } catch (error: any) {
    console.error("Admin messages GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("messages");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Message status updated to ${status}`,
    });
  } catch (error: any) {
    console.error("Admin messages PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message id is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("messages");

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    console.error("Admin messages DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete message" },
      { status: 500 }
    );
  }
}
