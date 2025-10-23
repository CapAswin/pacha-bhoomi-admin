import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const db = await getDb();
    const promotion = await db.collection("promotions").findOne({
      _id: new ObjectId(resolvedParams.id),
    });

    if (!promotion) {
      return NextResponse.json(
        { message: "Promotion not found" },
        { status: 404 }
      );
    }

    const formattedPromotion = {
      ...promotion,
      id: promotion._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(formattedPromotion);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return NextResponse.json(
      { message: "Error fetching promotion" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const db = await getDb();
    const promotionData = await request.json();

    const result = await db.collection("promotions").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      {
        $set: {
          code: promotionData.code,
          type: promotionData.type,
          value: promotionData.value,
          status: promotionData.status,
          startDate: promotionData.startDate,
          endDate: promotionData.endDate,
        },
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("Promotion not found", { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update promotion:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const db = await getDb();

    const result = await db.collection("promotions").deleteOne({
      _id: new ObjectId(resolvedParams.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Promotion not found" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete promotion:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
