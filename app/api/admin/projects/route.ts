import db from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.get("projects");

    return Response.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await db.insertOne("projects", body);

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
