import { AppRouter } from '@cheeseria/api';
import { createTRPCReact } from '@trpc/react-query';

// Notice the <AppRouter> generic here.
export const trpc = createTRPCReact<AppRouter>({});
