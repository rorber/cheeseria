import { logger } from '@cheeseria/domain/src/logger';
import { uuid } from '@cheeseria/domain/src/utils/uuid';
import { TRPCError } from '@trpc/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Uuid } from '../../util/util.types';
import { AddCheeseToOrderRequest, Order, orderZod, ordersZod } from './order.types';
import { safeGetEnvVar } from '@cheeseria/domain/src/utils/env';

export class OrderService {
  addCheeseToOrder(body: AddCheeseToOrderRequest): Order {
    try {
      const orders = ordersZod.parse(
        JSON.parse(
          readFileSync(join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`), `utf8`),
        ),
      );
      const orderIndex = orders.findIndex((o) => o.id === body.orderId);
      if (orderIndex < 0) {
        throw new TRPCError({ code: `NOT_FOUND`, message: `Order with id ${body.orderId} not found` });
      }
      const order = orders[orderIndex];

      const existingCheeseOrder = order.cheeses.find((c) => c.id === body.id);
      if (existingCheeseOrder) {
        existingCheeseOrder.quantity++;
      } else {
        order.cheeses.push({
          id: body.id,
          quantity: body.quantity,
        });
      }

      writeFileSync(
        join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`),
        JSON.stringify(orders),
      );
      return order;
    } catch (error) {
      logger.info(`Failed to add cheese to order`, error);
      throw new TRPCError({ code: `INTERNAL_SERVER_ERROR`, message: `Failed to add cheese to order` });
    }
  }

  createOrder(): Order {
    try {
      const order: Order = {
        cheeses: [],
        id: uuid(),
      };

      const orders = ordersZod.parse(
        JSON.parse(
          readFileSync(join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`), `utf8`),
        ),
      );
      orders.push(order);

      writeFileSync(
        join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`),
        JSON.stringify(orders),
      );
      return order;
    } catch (error) {
      logger.info(`Failed to create order`, error);
      throw new TRPCError({ code: `INTERNAL_SERVER_ERROR`, message: `Failed to create order` });
    }
  }

  deleteCheeseFromOrder(orderId: Uuid, cheeseId: Uuid): void {
    try {
      const orders = ordersZod.parse(
        JSON.parse(
          readFileSync(join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`), `utf8`),
        ),
      );
      const orderIndex = orders.findIndex((o) => o.id === orderId);
      if (orderIndex < 0) {
        throw new TRPCError({ code: `NOT_FOUND`, message: `Order with id ${orderId} not found` });
      }

      orders[orderIndex] = {
        id: orderId,
        cheeses: orders[orderIndex].cheeses.filter((c) => c.id !== cheeseId),
      };
      writeFileSync(
        join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`),
        JSON.stringify(orders),
      );
    } catch (error) {
      logger.info(`Failed to delete cheese from order`, error);
      throw new TRPCError({ code: `INTERNAL_SERVER_ERROR`, message: `Failed to delete cheese from order` });
    }
  }

  get(orderId: Uuid): Order {
    try {
      const orders = JSON.parse(
        readFileSync(join(safeGetEnvVar('STAGE', '') === `dev` ? `/tmp` : __dirname, `orders.json`), `utf8`),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const order = orders.find((o: any) => o.id === orderId);
      if (!order) {
        throw new TRPCError({ code: `NOT_FOUND`, message: `Order with id ${orderId} not found` });
      }
      return orderZod.parse(order);
    } catch (error) {
      logger.info(`Failed to get order`, error);
      throw new TRPCError({ code: `INTERNAL_SERVER_ERROR`, message: `Failed to get cheeses` });
    }
  }
}
