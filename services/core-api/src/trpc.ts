import { logger } from '@cheeseria/domain/src/logger';
import { TRPCError, initTRPC } from '@trpc/server';
import type { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEvent } from 'aws-lambda';

export interface Context {
  event?: APIGatewayProxyEvent;
  requestTime: number;
  refreshToken?: string;
}

export function createContext({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>): Context {
  return {
    event,
    requestTime: Date.now(),
  };
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthorisedUserApp = t.middleware(() => {
  throw new TRPCError({ code: `UNAUTHORIZED`, message: `` });
});

const requestLogger = t.middleware(({ next, ctx }) => {
  const path = ctx.event?.path;
  if (path) {
    logger.info(`Cheeseria API Request`, {
      body: ctx.event?.body,
      params: ctx.event?.queryStringParameters,
      path: ctx.event?.path,
      userAgent: ctx.event?.requestContext?.identity?.userAgent,
    });
  }

  return next({
    ctx,
  });
});

const requestLoggerProcedure = t.procedure.use(requestLogger);

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = requestLoggerProcedure;
export const protectedUserProcedure = requestLoggerProcedure.use(isAuthorisedUserApp);
