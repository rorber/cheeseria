import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const App = lazy(() => import('./App'));

const Router: React.FC = () => {
  const router = createBrowserRouter([
    {
      children: [
        {
          path: `/`,
          element: (
            <Suspense>
              <App />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
