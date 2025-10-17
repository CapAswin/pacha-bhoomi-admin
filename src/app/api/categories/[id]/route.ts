
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Category } from '@/lib/types';

async function getDb() {
    const client = await clientPromise;
    return client.db('authdb');
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const category = await db.collection('categories').findOne({ _id: new ObjectId(params.id) });
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    const formattedCategory = { ...category, id: category._id.toString(), _id: undefined };
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ message: 'Error fetching category' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const db = await getDb();
        const categoryData = await request.json();
        const result = await db.collection('categories').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: categoryData }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Category updated' });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ message: 'Error updating category' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const db = await getDb();
        const result = await db.collection('categories').deleteOne({ _id: new ObjectId(params.id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ message: 'Error deleting category' }, { status: 500 });
    }
}
