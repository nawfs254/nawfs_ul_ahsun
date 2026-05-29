import db from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const body = await req.json();
    
    // Remove _id from body to prevent MongoDB immutable field error
    delete body._id;

    const { id } = await params;

    const result = await db.updateOne(
      "projects",
      {
        _id: new ObjectId(id),
      },
      body,
    );

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

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await params;

    const result = await db.deleteOne("projects", {
      _id: new ObjectId(id),
    });

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
