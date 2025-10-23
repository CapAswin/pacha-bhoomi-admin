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

    const images = productData.images || [];
    let finalImages = images;

    // Process images - move from temp to product directory if needed
    if (images.length > 0) {
      const tempImages = images.filter((img: string) =>
        img.includes("/uploads/temp/")
      );
      if (tempImages.length > 0) {
        // We need to move images from temp directories to the new product directory
        finalImages = [];
        // We'll handle this after creating the product
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

    // Move images from temp directories to product directory
    if (images.length > 0) {
      const updatedImages = [];
      for (const imageUrl of images) {
        if (imageUrl.startsWith("/uploads/temp/")) {
          // Move from temp to products directory
          const tempParts = imageUrl.split("/");
          const tempId = tempParts[3];
          const filename = tempParts[4];

          const tempDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "temp",
            tempId
          );
          const productDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "products",
            realProductId
          );

          try {
            // Create product directory
            await import("fs/promises").then(({ mkdir }) =>
              mkdir(productDir, { recursive: true })
            );

            // Move file
            const oldPath = path.join(tempDir, filename);
            const newPath = path.join(productDir, filename);
            await rename(oldPath, newPath);

            // Add updated URL to images array
            updatedImages.push(
              `/uploads/products/${realProductId}/${filename}`
            );
          } catch (error) {
            console.error("Error moving image file:", error);
            // Keep original URL if move fails
            updatedImages.push(imageUrl);
          }
        } else {
          // Keep non-temp images as-is
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
        finalImages = updatedImages;
      }
    }

    const insertedProduct: Product = {
      ...productData,
      id: realProductId,
      images: finalImages,
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
