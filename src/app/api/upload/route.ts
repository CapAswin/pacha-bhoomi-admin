import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file received." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get productId from form data
    const productId = data.get("productId") as string;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    // Create product-specific directory
    const productDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      productId
    );
    await mkdir(productDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const filepath = path.join(productDir, filename);

    await writeFile(filepath, buffer);

    // Return the public URL path
    const imageUrl = `/uploads/products/${productId}/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "File uploaded successfully.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload file." },
      { status: 500 }
    );
  }
}
