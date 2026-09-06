import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import db from "@/lib/db";
import { ObjectId } from "mongodb";

const ALLOWED_COLLECTIONS = new Set([
  "personal_information",
  "projects",
  "experiences",
  "skills",
  "education",
  "services",
  "hobbies",
  "faqs",
]);

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(
  req: Request,
  props: { params: Promise<{ collection: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { collection } = await props.params;
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return NextResponse.json({ success: false, error: "Invalid collection" }, { status: 400 });
    }

    if (collection === "personal_information") {
      const data = await db.getPersonalInfo();
      return NextResponse.json({ success: true, data });
    }

    const data = await db.get(collection);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Admin data GET error:", error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ collection: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { collection } = await props.params;
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return NextResponse.json({ success: false, error: "Invalid collection" }, { status: 400 });
    }

    const body = await req.json();
    if (body._id) delete body._id;

    const result = await db.insertOne(collection, {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Admin data POST error:", error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ collection: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { collection } = await props.params;
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return NextResponse.json({ success: false, error: "Invalid collection" }, { status: 400 });
    }

    const body = await req.json();

    if (collection === "personal_information") {
      const result = await db.updatePersonalInfo(body);
      return NextResponse.json({ success: true, result });
    }

    const id = body._id || body.id;
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required for update" }, { status: 400 });
    }

    const cleanData = { ...body, updatedAt: new Date() };
    delete cleanData._id;

    const col = await db.collection(collection);
    let result;

    if (ObjectId.isValid(id)) {
      result = await col.updateOne({ _id: new ObjectId(id) }, { $set: cleanData });
    } else {
      result = await col.updateOne({ id }, { $set: cleanData });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Admin data PUT error:", error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ collection: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { collection } = await props.params;
    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return NextResponse.json({ success: false, error: "Invalid collection" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID query parameter is required" }, { status: 400 });
    }

    const col = await db.collection(collection);
    let result;

    if (ObjectId.isValid(id)) {
      result = await col.deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await col.deleteOne({ id });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Admin data DELETE error:", error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
