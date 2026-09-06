import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/db";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messageId, to, subject, replyText, originalMessage } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: "messageId is required" },
        { status: 400 }
      );
    }

    if (!to || !to.trim()) {
      return NextResponse.json(
        { success: false, error: "Recipient email address is required" },
        { status: 400 }
      );
    }

    if (!replyText || !replyText.trim()) {
      return NextResponse.json(
        { success: false, error: "Reply message cannot be empty" },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email credentials (EMAIL_USER and EMAIL_PASS) are not configured in environment variables.",
        },
        { status: 500 }
      );
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const emailSubject = subject?.trim() || "Response to your inquiry";

    // Dispatch email
    await transporter.sendMail({
      from: `"Nawfs Ul Ahsun" <${emailUser}>`,
      to: to.trim(),
      replyTo: emailUser,
      subject: emailSubject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0; font-size: 20px; font-weight: 700;">Nawfs Ul Ahsun</h2>
            <p style="margin: 3px 0 0 0; color: #64748b; font-size: 13px;">Web Developer & Software Engineer</p>
          </div>

          <div style="margin-bottom: 24px; font-size: 15px; color: #1e293b; white-space: pre-wrap; line-height: 1.7;">
${replyText.trim()}
          </div>

          ${
            originalMessage
              ? `
          <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-left: 3px solid #cbd5e1; border-radius: 6px; font-size: 13px; color: #475569;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #64748b;">Quoted original message:</p>
            <p style="margin: 0; white-space: pre-wrap; font-style: italic;">"${originalMessage.trim()}"</p>
          </div>
          `
              : ""
          }

          <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
            <span>Best regards,<br/><strong>Nawfs Ul Ahsun</strong></span>
            <span style="text-align: right;"><a href="mailto:${emailUser}" style="color: #2563eb; text-decoration: none;">${emailUser}</a></span>
          </div>
        </div>
      `,
    });

    // Update MongoDB document
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("messages");

    const replyRecord = {
      subject: emailSubject,
      replyText: replyText.trim(),
      sentAt: new Date(),
      sentBy: session.username,
      recipient: to.trim(),
    };

    await collection.updateOne(
      { _id: new ObjectId(messageId) },
      {
        $push: { replies: replyRecord } as any,
        $set: {
          status: "replied",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Direct email reply sent successfully!",
      reply: replyRecord,
    });
  } catch (error: any) {
    console.error("Admin messages reply POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send reply email" },
      { status: 500 }
    );
  }
}
