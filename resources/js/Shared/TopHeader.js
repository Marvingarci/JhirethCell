import React, { useState } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import Logo from '@/Shared/Logo2';
import MainMenu from '@/Shared/MainMenu';

export default () => {
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white md:flex-shrink-0 md:w-56 md:justify-center">
      <svg
          onClick={() => setMenuOpened(true)}
          className="w-12 h-12 text-gray cursor-pointer fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      <InertiaLink className="mt-1" href="/">
        <Logo className="text-white fill-current" width="80" height="28" />
      </InertiaLink>
      <div className="relative md:hidden">
        <div className={`${menuOpened ? '' : 'hidden'} absolute right-0 z-20`}>
          <MainMenu className="relative z-20 px-8 py-4 pb-2 mt-2 bg-newblue-100 rounded shadow-lg" />
          <div
            onClick={() => {
              setMenuOpened(false);
            }}
            className="fixed inset-0 z-10 bg-black opacity-25"
          ></div>
        </div>
      </div>
    </div>
  );
};
