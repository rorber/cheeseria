import { Uuid } from '@cheeseria/api/src/util/util.types';
import { FC } from 'react';

interface OrderItemProperties {
  id: string;
  imageName: string;
  name: string;
  quantity: number;
  pricePerKg: number;
  deleteProductFromOrder: (productId: Uuid) => void;
}

export const OrderItem: FC<OrderItemProperties> = (product) => {
  return (
    <li className="mb-4 cursor-pointer" onClick={(): void => product.deleteProductFromOrder(product.id)}>
      <div className="flex">
        <div className="mr-8 flex flex-1">
          <img
            className="mr-4 rounded-md"
            src={`${product.imageName}`}
            alt={product.name}
            height="40"
            width="40"
            loading="lazy"
          />
          <span className="my-auto">{product.name}</span>
          <span className="my-auto ml-auto">
            <b>${product.pricePerKg * product.quantity}</b>
          </span>
        </div>
        <button className="ml-auto rounded-md bg-red-darker px-2 text-white">
          <b>Remove</b>
        </button>
      </div>
    </li>
  );
};
