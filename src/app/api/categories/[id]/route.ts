import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Category } from "@/lib/types";

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const resolvedParams = await params;
    const category = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(resolvedParams.id) });
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    const formattedCategory = {
      ...category,
      id: category._id.toString(),
      _id: undefined,
    };
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const resolvedParams = await params;
    const categoryData = await request.json();

    // Remove createdAt from update data to prevent it from being overwritten
    const updateData = { ...categoryData };
    delete updateData.createdAt;

    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      {
        $set: {
          ...updateData,
          modifiedAt: new Date().toISOString(),
        },
      }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Error updating category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();

    // Await params as per Next.js 15+ requirement
    const resolvedParams = await params;

    // Handle multiple IDs for bulk delete
    const ids = resolvedParams.id.split(",");
    console.log("Deleting categories with IDs:", ids);

    const objectIds = ids.map((id) => {
      try {
        return new ObjectId(id.trim());
      } catch (error) {
        console.error(`Invalid ObjectId: ${id}`, error);
        throw new Error(`Invalid category ID: ${id}`);
      }
    });

    const result = await db
      .collection("categories")
      .deleteMany({ _id: { $in: objectIds } });

    console.log(`Deleted ${result.deletedCount} categories`);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Categories not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `${result.deletedCount} categorie(s) deleted`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting categories:", error);
    return NextResponse.json(
      { message: "Error deleting categories" },
      { status: 500 }
    );
  }
}
