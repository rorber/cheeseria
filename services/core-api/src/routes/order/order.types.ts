/* eslint-disable @typescript-eslint/no-empty-interface */
import { z } from 'zod';

export const orderCheeseZod = z.object({ id: z.string().uuid(), quantity: z.number().min(0.001) });

export const orderZod = z.object({
  cheeses: z.array(orderCheeseZod),
  id: z.string().uuid(),
});
export interface Order extends z.infer<typeof orderZod> {}

export const ordersZod = z.array(orderZod);

export const addCheeseToOrderRequestZod = orderCheeseZod.merge(z.object({ orderId: z.string().uuid() }));
export interface AddCheeseToOrderRequest extends z.infer<typeof addCheeseToOrderRequestZod> {}
