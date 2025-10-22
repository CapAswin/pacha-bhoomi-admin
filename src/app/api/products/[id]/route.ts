import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db('authdb');
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const db = await getDb();
        const productData = await request.json();
        const { name, description, price, stock, images, categoryId } = productData;

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { name, description, price, stock, images, categoryId: new ObjectId(categoryId) } }
        );

        if (result.matchedCount === 0) {
            return new NextResponse('Product not found', { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to update product:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const db = await getDb();
        await db.collection('products').deleteOne({ _id: new ObjectId(params.id) });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
