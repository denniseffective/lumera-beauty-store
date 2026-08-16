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
