
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns } from '@/components/admin/categories/category-table-columns';
import { DataTable } from '@/components/admin/categories/category-table';
import { categorySchema } from '@/lib/types';

async function getCategories() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/lib/placeholder-images.json')
  );

  const categories = JSON.parse(data.toString());

  return z.array(categorySchema).parse(categories.categories);
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your product categories.
          </p>
        </div>
      </div>
      <DataTable data={categories} columns={columns} />
    </div>
  );
}
