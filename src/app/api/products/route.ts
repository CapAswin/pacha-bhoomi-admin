
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db('authdb');
}

export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find({}).toArray();
    const formattedProducts = products.map(product => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
      categoryId: product.categoryId.toString(), // Ensure categoryId is a string
    }));
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const { categoryId, ...rest } = productData;
    
    const db = await getDb();
    const result = await db.collection('products').insertOne({
      ...rest,
      categoryId: new ObjectId(categoryId),
    });
    
    const newProduct = {
      ...productData,
      id: result.insertedId.toString(),
    };

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}
