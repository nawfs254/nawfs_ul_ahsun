import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import db, { DB_NAME } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeData = searchParams.get("data") === "true";

    const client = await clientPromise;
    const mongoDb = client.db(DB_NAME);

    const collections = await mongoDb.listCollections().toArray();
    const stats: Record<string, number> = {};

    for (const col of collections) {
      stats[col.name] = await mongoDb.collection(col.name).countDocuments();
    }

    let allData = null;
    if (includeData) {
      allData = await db.getAllPortfolioData();
    }

    return NextResponse.json({
      success: true,
      database: DB_NAME,
      collections: collections.map((c) => c.name),
      documentCounts: stats,
      ...(includeData ? { data: allData } : {}),
    });
  } catch (error: any) {
    console.error("MongoDB portfolio API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to query MongoDB portfolio database",
      },
      { status: 500 }
    );
  }
}
