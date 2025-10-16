
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    // A real application would do more robust validation here
    if (!productData.name || !productData.price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newProduct: Product = {
      id: `prod_${new Date().getTime()}`, // Generate a unique ID
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      imageUrl: productData.imageUrl || '/placeholder.svg',
      inventory: parseInt(productData.inventory, 10) || 0,
      category: productData.category || 'uncategorized',
      revenue: 0,
      sales: 0,
    };

    products.unshift(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}
