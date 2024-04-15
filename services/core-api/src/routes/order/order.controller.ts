import { z } from 'zod';
import { publicProcedure, router } from '../../trpc';
import { OrderService } from './order.service';
import { addCheeseToOrderRequestZod } from './order.types';

const orderService = new OrderService();

export const orderRouter = router({
  addCheeseToOrder: publicProcedure.input(addCheeseToOrderRequestZod).mutation((req) => {
    return orderService.addCheeseToOrder(req.input);
  }),
  create: publicProcedure.mutation(orderService.createOrder),
  deleteCheeseFromOrder: publicProcedure
    .input(z.object({ orderId: z.string().uuid(), cheeseId: z.string().uuid() }))
    .mutation(({ input }) => orderService.deleteCheeseFromOrder(input.orderId, input.cheeseId)),
  get: publicProcedure.input(z.object({ id: z.string().uuid() })).query((req) => orderService.get(req.input.id)),
});
