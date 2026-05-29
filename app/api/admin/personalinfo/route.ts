import db from "@/lib/db";

export async function GET() {
  const data = await db.getOne("myinfo");

  return Response.json(data);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Remove _id from body to prevent immutable field update error
    if (body._id) {
      delete body._id;
    }

    await db.updateOne("myinfo", {}, body);

    return Response.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Error updating personal info:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
