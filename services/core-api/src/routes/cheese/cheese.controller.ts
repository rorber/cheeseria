import { publicProcedure, router } from '../../trpc';
import { CheeseService } from './cheese.service';

const cheeseService = new CheeseService();

export const cheeseRouter = router({
  get: publicProcedure.query(cheeseService.get),
});
