import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { unlink, readdir } from "fs/promises";
import path from "path";

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const db = await getDb();
    const productData = await request.json();
    const { name, description, price, stock, images, categoryId } = productData;

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      {
        $set: {
          name,
          description,
          price,
          stock,
          images,
          categoryId: categoryId ? new ObjectId(categoryId) : null,
        },
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
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
    const productsCollection = db.collection("products");

    const productId = resolvedParams.id;

    // Get the product to check for images
    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete associated image files
    if (product.images && Array.isArray(product.images)) {
      for (const imagePath of product.images) {
        if (imagePath.startsWith("/uploads/products/")) {
          try {
            const fullPath = path.join(process.cwd(), "public", imagePath);
            await unlink(fullPath);
          } catch (error) {
            console.warn(`Failed to delete image file: ${imagePath}`, error);
          }
        }
      }
    }

    // Also try to delete the product directory if it exists and is empty
    try {
      const productDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "products",
        productId
      );
      const files = await readdir(productDir);
      for (const file of files) {
        await unlink(path.join(productDir, file));
      }
      // Note: Directory removal would require additional fs operations, but files are cleaned up
    } catch (error) {
      // Directory might not exist or already be empty, which is fine
    }

    // Delete the product
    await productsCollection.deleteOne({
      _id: new ObjectId(resolvedParams.id),
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
