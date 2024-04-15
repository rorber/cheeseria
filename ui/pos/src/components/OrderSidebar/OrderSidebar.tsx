import { Cheeses } from '@cheeseria/api/src/routes/cheese/cheese.types';
import { Uuid } from '@cheeseria/api/src/util/util.types';
import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import { Loading } from '../Loading/Loading';
import { OrderList } from '../OrderList/OrderList';

interface OrderSidebarProperties {
  orderId: Uuid;
  productsForSale: Cheeses;
}

export const OrderSidebar: FC<OrderSidebarProperties> = ({ orderId, productsForSale }) => {
  const { data: order, isLoading: isLoadingOrder } = trpc.order.get.useQuery({ id: orderId });

  return (
    <div className="h-[calc(100vh-3rem)] bg-red px-4 pt-8">
      {isLoadingOrder ? (
        <Loading />
      ) : order ? (
        <OrderList order={order} productsForSale={productsForSale} />
      ) : (
        <span>Order is empty</span>
      )}
    </div>
  );
};
