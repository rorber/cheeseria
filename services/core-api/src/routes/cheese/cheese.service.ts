import { logger } from '@cheeseria/domain/src/logger';
import { TRPCError } from '@trpc/server';
import { readFileSync } from 'fs';
import { GetCheesesResponse, cheesesZod } from './cheese.types';
import { join } from 'path';

export class CheeseService {
  get(): GetCheesesResponse {
    try {
      const cheeses = readFileSync(join(__dirname, `cheeses.json`), `utf8`);
      return {
        cheeses: cheesesZod.parse(JSON.parse(cheeses)),
      };
    } catch (error) {
      logger.info(`Failed to get cheeses`, error);
      throw new TRPCError({ code: `INTERNAL_SERVER_ERROR`, message: 'Failed to get cheeses' });
    }
  }
}
