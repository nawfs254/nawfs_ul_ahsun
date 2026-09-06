import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  req: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: urlSegments } = await props.params;
    if (!urlSegments || urlSegments.length === 0) {
      return new Response("Image path required", { status: 400 });
    }

    const folder = urlSegments.length > 1 ? urlSegments[0] : "projects";
    const filename = urlSegments[urlSegments.length - 1];
    const ext = path.extname(filename).toLowerCase();
    const defaultMime = MIME_MAP[ext] || "application/octet-stream";

    // 1. Try serving from local disk first if exists
    try {
      const localFilePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        ...urlSegments
      );
      if (fs.existsSync(localFilePath)) {
        const fileBuffer = fs.readFileSync(localFilePath);
        return new Response(fileBuffer, {
          headers: {
            "Content-Type": defaultMime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // Local disk read failed or running in serverless container
    }

    // 2. Fetch from MongoDB Atlas "media" collection
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const mediaCol = db.collection("media");

      const doc = await mediaCol.findOne({
        $or: [
          { filename: filename, folder: folder },
          { filename: filename },
          { url: `/uploads/${urlSegments.join("/")}` },
        ],
      });

      if (doc && doc.data) {
        const buffer = Buffer.from(doc.data, "base64");
        return new Response(buffer, {
          headers: {
            "Content-Type": doc.contentType || defaultMime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (dbErr) {
      console.warn("MongoDB media fetch error:", dbErr);
    }

    return new Response("Image not found", { status: 404 });
  } catch (error: any) {
    console.error("Uploads route handler error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
