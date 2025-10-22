import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const formattedCategories = categories.map((c) => ({
      ...c,
      id: c._id.toString(),
      createdAt: c.createdAt || new Date(0).toISOString(), // Use epoch start for categories without createdAt to put them last
    }));
    console.log(
      "Categories data (sorted by createdAt desc):",
      formattedCategories
    );
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const categoryData = await request.json();

    const result = await db.collection("categories").insertOne({
      name: categoryData.name,
      description: categoryData.description,
      createdAt: categoryData.createdAt || new Date().toISOString(),
      modifiedAt: null,
    });
    const insertedCategory = {
      id: result.insertedId.toString(),
      name: categoryData.name,
      description: categoryData.description,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(insertedCategory, { status: 201 });
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
