import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid request: ids must be a non-empty array" },
        { status: 400 }
      );
    }

    const objectIds = ids.map((id: string) => new ObjectId(id));
    const result = await db.collection("promotions").deleteMany({
      _id: { $in: objectIds },
    });

    return NextResponse.json({
      message: `Deleted ${result.deletedCount} promotions`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting promotions:", error);
    return NextResponse.json(
      { message: "Error deleting promotions" },
      { status: 500 }
    );
  }
}
