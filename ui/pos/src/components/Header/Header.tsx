import { FC } from 'react';
import CheeseLogo from '../../assets/cheese-wedge.svg';

export const Header: FC = () => {
  return (
    <header className="bg-brown py-2">
      <div className="max-w-content m-auto flex px-4">
        <a href="https://google.com" rel="noreferrer" target="_blank">
          <img alt="Cheeseria logo" height="40px" src={CheeseLogo} width="40px"></img>
        </a>
        <span className="my-auto px-4 text-white">Cheeseria</span>
      </div>
    </header>
  );
};
