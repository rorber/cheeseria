import { Uuid } from '@cheeseria/api/src/util/util.types';
import { FC } from 'react';

interface ProductProperties {
  id: string;
  imageName: string;
  name: string;
  pricePerKg: number;
  addProductToOrder: (productId: Uuid) => void;
}

export const ProductTile: FC<ProductProperties> = (product) => {
  return (
    <li
      className="m-4 cursor-pointer rounded-md border border-brown"
      onClick={(): void => product.addProductToOrder(product.id)}
    >
      <img
        className="rounded-t-md"
        src={product.imageName}
        alt={product.name}
        height="206"
        width="206"
        loading="lazy"
      />
      <div className="mx-2 my-4 flex">
        <span>{product.name}</span>
        <span className="ml-auto">
          <b>${product.pricePerKg}/kg</b>
        </span>
      </div>
    </li>
  );
};
