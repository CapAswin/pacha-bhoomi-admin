import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'in stock' | 'low stock' | 'out of stock';
  description: string;
  images: string[];
  createdAt: string;
  categoryId:string;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
};

export type Promotion = {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value: string;
  status: 'Active' | 'Expired' | 'Scheduled';
  startDate: string;
  endDate: string;
};
