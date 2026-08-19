import { z } from 'zod';

export const productSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(20).max(2000),
  price: z.coerce.number().nonnegative(),
  imageUrl: z.string().url(),
  inventory: z.coerce.number().int().nonnegative(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).transform(value => value.toLowerCase()),
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  password: z.string().min(1).max(72)
});

export const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(20).default(1)
});

export const quantitySchema = z.object({ quantity: z.coerce.number().int().min(1).max(20) });

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  addressLine1: z.string().trim().min(5).max(160),
  addressLine2: z.string().trim().max(160).optional().default(''),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(40),
  postalCode: z.string().trim().min(5).max(20)
});

export const orderStatusSchema = z.object({
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled'])
});
