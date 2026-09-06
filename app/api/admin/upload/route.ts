import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

function sanitizeFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${baseName || "image"}-${timestamp}-${randomStr}${ext}`;
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

    const formData = await req.formData();
    const folderParam = (formData.get("folder") as string) || "projects";
    // Sanitize folder name so it can only be alphanumeric or dashes
    const safeFolder = folderParam.replace(/[^a-zA-Z0-9_-]/g, "") || "projects";

    // Can receive single 'file' or multiple 'files'
    const files: File[] = [];
    const singleFile = formData.get("file") as File | null;
    if (singleFile && typeof singleFile === "object" && singleFile.size > 0) {
      files.push(singleFile);
    }

    const multiFiles = formData.getAll("files") as File[];
    if (multiFiles && multiFiles.length > 0) {
      for (const f of multiFiles) {
        if (typeof f === "object" && f.size > 0 && !files.includes(f)) {
          files.push(f);
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    // Validate all files first
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" has unsupported format (${file.type}). Allowed: PNG, JPEG, WebP, SVG, GIF, AVIF.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" exceeds maximum allowed size of 10MB.`,
          },
          { status: 400 }
        );
      }
    }

    // Target directory: public/uploads/<safeFolder>
    const targetDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    await mkdir(targetDir, { recursive: true });

    const uploadedResults: Array<{
      url: string;
      originalName: string;
      fileName: string;
      size: number;
    }> = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = sanitizeFileName(file.name);
      const filePath = path.join(targetDir, safeName);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${safeName}`;
      uploadedResults.push({
        url: publicUrl,
        originalName: file.name,
        fileName: safeName,
        size: file.size,
      });
    }

    if (uploadedResults.length === 1) {
      return NextResponse.json({
        success: true,
        url: uploadedResults[0].url,
        fileName: uploadedResults[0].fileName,
        size: uploadedResults[0].size,
        files: uploadedResults,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedResults,
      urls: uploadedResults.map((r) => r.url),
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
