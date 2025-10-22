import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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
      ])
      .toArray();

    const formattedProducts = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      categoryId: p.categoryId ? p.categoryId.toString() : null,
      _id: undefined,
    }));
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
      images:
        productData.images && productData.images.length > 0
          ? productData.images
          : ["/placeholder.svg"],
      createdAt: new Date().toISOString(),
      categoryId: productData.categoryId
        ? new ObjectId(productData.categoryId)
        : null,
    };

    const result = await db
      .collection("products")
      .insertOne(productForDb as any);

    const insertedProduct: Product = {
      ...productData,
      id: result.insertedId.toString(),
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
