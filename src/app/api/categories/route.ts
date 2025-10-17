
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { categorySchema } from '@/lib/types';

const jsonPath = path.join(process.cwd(), 'src/lib/categories.json');

async function readCategories() {
  try {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData.categories || [];
  } catch (error) {
    // Type-safe check for Node.js file errors
    if (error instanceof Error && 'code' in error && (error as any).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeCategories(categories: any) {
  await fs.writeFile(jsonPath, JSON.stringify({ categories }, null, 2));
}

export async function GET() {
  const categories = await readCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const newCategoryData = await request.json();
  try {
    const parsedCategory = categorySchema.omit({ id: true }).parse(newCategoryData);
    const categories = await readCategories();

    const newCategory = {
      id: `cat-${new Date().getTime()}`,
      ...parsedCategory,
    };

    categories.push(newCategory);
    await writeCategories(categories);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
