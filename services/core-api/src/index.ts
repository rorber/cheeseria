import { logger } from '@cheeseria/domain/src/logger';
import { safeGetEnvVar } from '@cheeseria/domain/src/utils/env';
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { renderTrpcPanel } from 'trpc-panel';
import { cheeseRouter } from './routes/cheese/cheese.controller';
import { orderRouter } from './routes/order/order.controller';
import { createContext, publicProcedure, router } from './trpc';

export type AppRouter = typeof appRouter;

export const appRouter = router({
  cheese: cheeseRouter,
  health: publicProcedure.query(() => ({ statusCode: 200, body: { message: 'OK' } })),
  order: orderRouter,
});

const apiDocEnv = new Map()
  .set('local', 'http://localhost:4321/offline')
  .set('dev', 'https://0pvs4emdil.execute-api.ap-southeast-2.amazonaws.com/dev');

export const handler = async (
  event: APIGatewayProxyEvent,
  context: AWSLambda.Context,
): Promise<APIGatewayProxyResult> => {
  if (apiDocEnv.has(safeGetEnvVar('STAGE', '')) && event.path === '/api') {
    return {
      body: renderTrpcPanel(appRouter, { url: apiDocEnv.get(safeGetEnvVar('STAGE', '')) }),
      statusCode: 200,
      headers: {
        ...event.headers,
        ['Content-Type']: 'text/html',
      },
    };
  }

  return awsLambdaRequestHandler({
    router: appRouter,
    createContext,
    onError: ({ error }) => logger.error('Error:', error),
    responseMeta: ({ ctx }) => {
      const origin = ctx?.event?.headers?.[`Origin`] || ctx?.event?.headers?.[`origin`] || ``;

      const headers: Record<string, string> = {
        ['Access-Control-Allow-Origin']: getAccessControlAllowOrigin(process.env.STAGE, origin),
        ['Access-Control-Allow-Methods']: 'GET,POST',
        ['Access-Control-Allow-Headers']: 'Sentry-Trace,Baggage,Content-Type',
        ['Access-Control-Allow-Credentials']: 'true',
      };

      if (typeof ctx?.event?.headers['Set-Cookie'] === 'string') {
        headers['Set-Cookie'] = ctx.event.headers['Set-Cookie'];
      }

      return {
        headers,
      };
    },
  })(event, context);
};

const getAccessControlAllowOrigin = (stage: string | undefined, origin: string): string => {
  const productionAllowedOrigins = [``];

  if (stage === 'local') {
    return 'http://localhost:5173';
  } else if (stage === 'dev') {
    return origin;
  } else if (stage === 'prod' && productionAllowedOrigins.includes(origin)) {
    return origin;
  }
  logger.info('Could not determine Access-Control-Allow-Origin from stage env var', { origin, stage });
  return '';
};
