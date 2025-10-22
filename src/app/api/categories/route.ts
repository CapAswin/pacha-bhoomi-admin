
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db('authdb');
}

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db.collection('categories').find({}).toArray();
    const formattedCategories = categories.map(category => ({
      ...category,
      id: category._id.toString(),
      _id: undefined,
    }));
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const categoryData = await request.json();
        const db = await getDb();
        const result = await db.collection('categories').insertOne(categoryData);
        const newCategory = {
            ...categoryData,
            id: result.insertedId.toString(),
            _id: undefined,
        };

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
    }
}
