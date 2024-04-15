import { FC } from 'react';

export const Loading: FC = () => {
  return (
    <div
      className="m-auto h-20 w-20 animate-spin rounded-[50%] border-8 border-solid border-transparent border-t-brown"
      data-testid="loading"
    ></div>
  );
};
