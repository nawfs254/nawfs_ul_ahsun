import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone } = body;
    const name = body.name || [firstName, lastName].filter(Boolean).join(" ");
    const email = body.email;
    const subject = body.subject || "Portfolio Inquiry";
    const message = body.message;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Insert only into MongoDB "messages" collection (no email sent to Gmail)
    const messageDoc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phone ? String(phone).trim() : "",
      status: "unread", // "unread" | "read" | "replied"
      createdAt: new Date(),
      replies: [],
    };

    const result = await db.insertOne("messages", messageDoc);

    // Broadcast new visitor message simultaneously via WebSocket & Event stream
    try {
      const { broadcastNewMessage } = await import("@/lib/realtime");
      broadcastNewMessage({
        ...messageDoc,
        _id: result.insertedId.toString(),
      });
    } catch (realtimeErr) {
      console.warn("Realtime broadcast warning:", realtimeErr);
    }

    return NextResponse.json({
      success: true,
      message: "Message received successfully",
      id: result.insertedId,
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
