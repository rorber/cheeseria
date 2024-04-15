import { z } from 'zod';

export const cheeseZod = z.object({
  colour: z.string().max(255),
  id: z.string().uuid(),
  imageName: z.string().max(255),
  name: z.string().max(255),
  pricePerKg: z.number().min(0).max(1000),
});

export type Cheese = z.infer<typeof cheeseZod>;
export const cheesesZod = z.array(cheeseZod);
export type Cheeses = z.infer<typeof cheesesZod>;

export interface GetCheesesResponse {
  cheeses: Cheeses;
}
