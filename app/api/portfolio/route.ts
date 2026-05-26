import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("portfolio_db");

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}
