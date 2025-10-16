
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

export async function GET() {
  // In a real application, you would fetch this data from a database.
  return NextResponse.json(products);
}
