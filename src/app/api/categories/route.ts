
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Category } from '@/lib/types';

async function getDb() {
    const client = await clientPromise;
    return client.db('authdb');
}

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db.collection('categories').find({}).toArray();
    const formattedCategories = categories.map(c => ({ ...c, id: c._id.toString(), _id: undefined }));
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const db = await getDb();
        const categoryData = await request.json();

        const newCategory: Omit<Category, 'id' | '_id'> = {
          name: categoryData.name,
          description: categoryData.description,
        };

        const result = await db.collection('categories').insertOne(newCategory as any);
        const insertedCategory = { ...newCategory, id: result.insertedId.toString() };

        return NextResponse.json(insertedCategory, { status: 201 });
    } catch (error) {
        console.error('Error adding category:', error);
        return NextResponse.json({ message: 'Error adding category' }, { status: 500 });
    }
}
