import { Cheeses } from '@cheeseria/api/src/routes/cheese/cheese.types';
import { Uuid } from '@cheeseria/api/src/util/util.types';
import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import { ProductTile } from '../ProductTile/ProductTile';

interface ProductListProperties {
  orderId: Uuid;
  products: Cheeses;
}

export const ProductList: FC<ProductListProperties> = ({ orderId, products }) => {
  const trpcUtils = trpc.useUtils();

  const { mutateAsync: callAddCheeseToOrder } = trpc.order.addCheeseToOrder.useMutation();

  const addCheeseToOrder = async (productId: Uuid): Promise<void> => {
    await callAddCheeseToOrder({ id: productId, orderId, quantity: 1 });
    trpcUtils.order.get.invalidate();
  };

  return (
    <>
      <span className="ml-4">Please select from the following:</span>
      <ul className="mt-4 flex flex-wrap">
        {products.map((product) => (
          <ProductTile key={product.id} {...product} addProductToOrder={addCheeseToOrder} />
        ))}
      </ul>
    </>
  );
};
