import { Cheeses } from '@cheeseria/api/src/routes/cheese/cheese.types';
import { Order } from '@cheeseria/api/src/routes/order/order.types';
import { Uuid } from '@cheeseria/api/src/util/util.types';
import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import { OrderItem } from '../OrderItem/OrderItem';

interface OrderListProperties {
  order: Order;
  productsForSale: Cheeses;
}

export const OrderList: FC<OrderListProperties> = ({ order, productsForSale }) => {
  const trpcUtils = trpc.useUtils();

  const { mutateAsync: callDeleteCheeseFromOrder } = trpc.order.deleteCheeseFromOrder.useMutation();

  const deleteProductFromOrder = async (productId: Uuid): Promise<void> => {
    await callDeleteCheeseFromOrder({ orderId: order.id, cheeseId: productId });
    trpcUtils.order.get.invalidate();
  };

  return (
    <>
      <span>Order:</span>
      <ul className="mt-8 flex flex-col flex-wrap">
        {order.cheeses.map((orderProduct) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const productDetails = productsForSale.find(({ id }) => id === orderProduct.id)!;
          return (
            <OrderItem
              key={orderProduct.id}
              {...productDetails}
              quantity={orderProduct.quantity}
              deleteProductFromOrder={deleteProductFromOrder}
            />
          );
        })}
      </ul>
    </>
  );
};
