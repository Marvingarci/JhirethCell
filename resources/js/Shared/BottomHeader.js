import React, { useState } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Icon from '@/Shared/Icon';

export default () => {
  const { auth } = usePage().props;
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <div className="flex items-center justify-between w-full p-4 text-sm bg-newGreen-100 border-b md:py-0 md:px-12 d:text-md">
      <div className="mt-1 mr-4 font-bold text-xl text-white">Sistema de Administración Interna</div>
      <div className="flex flex-between items-center gap-3">
      <img className="h-12 w-12" src="https://image.flaticon.com/icons/png/512/401/401156.png"></img>
      <div className="relative">
        <div
          className="flex items-center cursor-pointer select-none group"
          onClick={() => setMenuOpened(true)}
        >
          <div className="mr-1 text-white font-bold whitespace-nowrap group-hover:text-indigo-600 focus:text-indigo-600">
            <span>{auth.user.first_name}</span>
            <span className="hidden ml-1 md:inline">{auth.user.last_name}</span>
          </div>
          <Icon
            className="w-5 h-5 text-gray-800 fill-current group-hover:text-indigo-600 focus:text-indigo-600"
            name="cheveron-down"
          />
        </div>
        <div className={menuOpened ? '' : 'hidden'}>
          <div className="absolute top-0 right-0 left-auto z-20 py-2 mt-8 text-sm whitespace-nowrap bg-white rounded shadow-xl">
            <InertiaLink
              href={route('users.edit', auth.user.id)}
              className="block px-6 py-2 hover:bg-newblue-100 hover:text-white"
              onClick={() => setMenuOpened(false)}
            >
              Mi Perfil
            </InertiaLink>
            {
              auth.user.owner == 1 &&
              <InertiaLink
              href={route('users')}
              className="block px-6 py-2 hover:bg-newblue-100 hover:text-white"
              onClick={() => setMenuOpened(false)}
            >
              Administrar Usuarios
            </InertiaLink>
            }

            <InertiaLink
              as="button"
              href={route('logout')}
              className="block w-full px-6 py-2 text-left focus:outline-none hover:bg-newblue-100 hover:text-white"
              method="post"
            >
              Cerrar Sesion
            </InertiaLink>
          </div>
          <div
            onClick={() => {
              setMenuOpened(false);
            }}
            className="fixed inset-0 z-10 bg-black opacity-25"
          ></div>
        </div>
      </div>
      </div>
    </div>
  );
};
