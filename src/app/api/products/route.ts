
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Product } from '@/lib/types';

const initialProducts: Omit<Product, 'id' | '_id'>[] = Array.from({ length: 15 }, (_, i) => ({
  name: `Product ${String.fromCharCode(65 + i)}`,
  price: Math.floor(Math.random() * 200) + 50,
  stock: Math.floor(Math.random() * 200) + 1,
  status: ['in stock', 'low stock', 'out of stock'][Math.floor(Math.random() * 3)] as 'in stock' | 'low stock' | 'out of stock',
  description: `Description for product ${String.fromCharCode(65 + i)}`,
  images: [''],
  createdAt: new Date().toISOString(),
}));


async function getDb() {
    const client = await clientPromise;
    return client.db('authdb');
}

async function seedProducts() {
    const db = await getDb();
    const productsCollection = db.collection<Product>('products');
    const count = await productsCollection.countDocuments();
    if (count === 0) {
        await productsCollection.insertMany(initialProducts as any);
    }
}

export async function GET() {
  try {
    await seedProducts();
    const db = await getDb();
    const products = await db.collection('products').find({}).toArray();
    const formattedProducts = products.map(p => ({ ...p, id: p._id.toString(), _id: undefined }));
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const db = await getDb();
        const productData = await request.json();

        const newProduct: Omit<Product, 'id' | '_id'> = {
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          status: productData.stock > 0 
            ? (productData.stock < 50 ? 'low stock' : 'in stock') 
            : 'out of stock',
          description: productData.description,
          images: [productData.imageUrl || '/placeholder.svg'],
          createdAt: new Date().toISOString(),
        };
        
        

        const result = await db.collection('products').insertOne(newProduct as any);
        const insertedProduct = { ...newProduct, id: result.insertedId.toString() };

        return NextResponse.json(insertedProduct, { status: 201 });
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
    }
}
