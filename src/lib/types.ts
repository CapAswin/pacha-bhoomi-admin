import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  modifiedAt: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  status: z.enum(["in stock", "low stock", "out of stock"]),
  description: z.string().optional(),
  images: z.array(z.string()).default(["/placeholder.svg"]),
  createdAt: z.string(),
  categoryId: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  createdAt: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
  createdAt: string;
};

export type Promotion = {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount" | "Free Shipping";
  value: string;
  status: "Active" | "Expired" | "Scheduled";
  startDate: string;
  endDate: string;
};
