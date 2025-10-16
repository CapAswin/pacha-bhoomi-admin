
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';

export async function GET() {
  // In a real application, you would fetch this data from a database.
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const productData: Omit<Product, 'id' | 'status' | 'images'> & { category: string, imageUrl: string } = await request.json();

    if (productData.name === undefined || productData.price === undefined || productData.stock === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newProduct: Product = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      status: productData.stock > 0 ? (productData.stock < 50 ? 'low stock' : 'in stock') : 'out of stock',
      description: productData.description,
      images: [productData.imageUrl || '/placeholder.svg'],
    };

    products.unshift(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
  }
}
