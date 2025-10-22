import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { rename } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/types";

// Adjusted to use null for consistency, matching the Product type.
const initialProducts: Omit<Product, "id">[] = Array.from(
  { length: 15 },
  (_, i) => ({
    name: `Product ${String.fromCharCode(65 + i)}`,
    price: Math.floor(Math.random() * 200) + 50,
    stock: Math.floor(Math.random() * 200) + 1,
    status: ["in stock", "low stock", "out of stock"][
      Math.floor(Math.random() * 3)
    ] as "in stock" | "low stock" | "out of stock",
    description: `Description for product ${String.fromCharCode(65 + i)}`,
    images: ["/placeholder.svg"],
    createdAt: new Date().toISOString(),
    categoryId: null,
  })
);

async function getDb() {
  const client = await clientPromise;
  return client.db("authdb");
}

async function seedProducts() {
  const db = await getDb();
  const productsCollection = db.collection("products");
  const count = await productsCollection.countDocuments();
  if (count === 0) {
    await productsCollection.insertMany(initialProducts as any);
  }
}

export async function GET(request: Request) {
  try {
    await seedProducts();
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    let matchStage = {};
    if (categoryId && categoryId !== "all") {
      matchStage = { categoryId: new ObjectId(categoryId) };
    }

    const products = await db
      .collection("products")
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            stock: 1,
            status: 1,
            description: 1,
            images: 1,
            createdAt: 1,
            categoryId: 1,
            category: {
              id: "$category._id",
              name: "$category.name",
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    const formattedProducts = products.map((p) => {
      const formatted = {
        ...p,
        id: p._id.toString(),
        categoryId: p.categoryId ? p.categoryId.toString() : null,
        _id: undefined,
      };
      console.log("Formatted product:", {
        id: formatted.id,
        createdAt: p.createdAt,
        category: p.category,
      });
      return formatted;
    });
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const productData = await request.json();

    // If there are uploaded images with temporary product ID, move them to the real product directory
    const images = productData.images || [];
    let finalImages = images;

    if (images.length > 0) {
      const tempProductId = images
        .find((img: string) => img.includes("/uploads/products/"))
        ?.split("/")[3];
      if (tempProductId && !tempProductId.match(/^[0-9a-fA-F]{24}$/)) {
        // Check if it's a temporary ID (not a MongoDB ObjectId)
        // This is a new product with uploaded images using temp ID
        // Images will be moved after product creation
        finalImages = [];
      }
    }

    const productForDb = {
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      status:
        productData.stock > 0
          ? productData.stock < 50
            ? "low stock"
            : "in stock"
          : "out of stock",
      description: productData.description,
      images: finalImages,
      createdAt: new Date().toISOString(),
      categoryId: productData.categoryId
        ? new ObjectId(productData.categoryId)
        : null,
    };

    const result = await db
      .collection("products")
      .insertOne(productForDb as any);

    const realProductId = result.insertedId.toString();

    // Move uploaded images from temp directory to real product directory
    if (images.length > 0) {
      const updatedImages = [];
      for (const imageUrl of images) {
        if (imageUrl.startsWith("/uploads/products/")) {
          const parts = imageUrl.split("/");
          const tempProductId = parts[3];
          const filename = parts[4];

          if (tempProductId && !tempProductId.match(/^[0-9a-fA-F]{24}$/)) {
            // Move file from temp directory to real directory
            const tempDir = path.join(
              process.cwd(),
              "public",
              "uploads",
              "products",
              tempProductId
            );
            const realDir = path.join(
              process.cwd(),
              "public",
              "uploads",
              "products",
              realProductId
            );

            try {
              // Create real directory
              await import("fs/promises").then(({ mkdir }) =>
                mkdir(realDir, { recursive: true })
              );

              // Move file
              const oldPath = path.join(tempDir, filename);
              const newPath = path.join(realDir, filename);
              await rename(oldPath, newPath);

              // Add updated URL to images array
              updatedImages.push(
                `/uploads/products/${realProductId}/${filename}`
              );
            } catch (error) {
              console.error("Error moving image file:", error);
              // If move fails, keep original URL (though this shouldn't happen in production)
              updatedImages.push(imageUrl);
            }
          } else {
            // Already has real product ID
            updatedImages.push(imageUrl);
          }
        } else {
          // External URL
          updatedImages.push(imageUrl);
        }
      }

      // Update product with correct image URLs
      if (updatedImages.length > 0) {
        await db
          .collection("products")
          .updateOne(
            { _id: result.insertedId },
            { $set: { images: updatedImages } }
          );
      }
    }

    const insertedProduct: Product = {
      ...productData,
      id: realProductId,
      images: finalImages.length > 0 ? finalImages : images,
      categoryId: productData.categoryId || null,
    };

    return NextResponse.json(insertedProduct, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { message: "Error adding product" },
      { status: 500 }
    );
  }
}
