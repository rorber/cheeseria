import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Loading } from './components/Loading/Loading';
import { OrderSidebar } from './components/OrderSidebar/OrderSidebar';
import { ProductList } from './components/ProductList/ProductList';
import { trpc } from './utils/trpc';

const App: React.FC = () => {
  const { mutateAsync: createOrder, isLoading: isCreateOrderLoading } = trpc.order.create.useMutation();
  const { data: { cheeses } = {}, isLoading: isCheesesLoading } = trpc.cheese.get.useQuery();

  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  useEffect(() => {
    if (!orderId) {
      createOrder().then((order) => setSearchParams({ order: order.id }));
    }
  }, []);

  return (
    <>
      <div className="min-h-full bg-yellow">
        <Header />
        <main className="max-w-content mx-auto h-[calc(100vh-3rem)]">
          {!orderId || isCreateOrderLoading || isCheesesLoading ? (
            <Loading />
          ) : (
            <div className="flex">
              <div className="mr-8 mt-8 basis-8/12">
                {cheeses ? <ProductList orderId={orderId} products={cheeses} /> : <div>No cheese for you</div>}
              </div>
              <div className="basis-4/12">
                <OrderSidebar orderId={orderId} productsForSale={cheeses || []} />
              </div>
            </div>
          )}
        </main>
        <footer></footer>
      </div>
    </>
  );
};

export default App;
