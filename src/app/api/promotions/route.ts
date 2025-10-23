import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Promotion } from "@/lib/types";

const initialPromotions: Omit<Promotion, "id">[] = [
  {
    code: "FALL20",
    type: "Percentage",
    value: "20%",
    status: "Active",
    startDate: "2023-09-01",
    endDate: "2023-11-30",
  },
  {
    code: "FREESHIP",
    type: "Free Shipping",
    value: "N/A",
    status: "Active",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  {
    code: "SUMMER10",
    type: "Fixed Amount",
    value: "$10",
    status: "Expired",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
  },
];

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

async function seedPromotions() {
  const db = await getDb();
  const promotionsCollection = db.collection("promotions");
  const count = await promotionsCollection.countDocuments();
  if (count === 0) {
    await promotionsCollection.insertMany(initialPromotions as any);
  }
}

export async function GET(request: Request) {
  try {
    await seedPromotions();
    const db = await getDb();
    const promotions = await db
      .collection("promotions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedPromotions = promotions.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedPromotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { message: "Error fetching promotions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const promotionData = await request.json();

    const promotionForDb = {
      code: promotionData.code,
      type: promotionData.type,
      value: promotionData.value,
      status: promotionData.status || "Active",
      startDate: promotionData.startDate,
      endDate: promotionData.endDate,
      createdAt: new Date().toISOString(),
    };

    const result = await db
      .collection("promotions")
      .insertOne(promotionForDb as any);

    const insertedPromotion: Promotion = {
      ...promotionData,
      id: result.insertedId.toString(),
    };

    return NextResponse.json(insertedPromotion, { status: 201 });
  } catch (error) {
    console.error("Error adding promotion:", error);
    return NextResponse.json(
      { message: "Error adding promotion" },
      { status: 500 }
    );
  }
}
