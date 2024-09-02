import React, { useState } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Icon from '@/Shared/Icon';
import Modal from 'react-modal';
import moment from 'moment';
import LoadingButton from '@/Shared/LoadingButton';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default () => {
  const { auth , notifications} = usePage().props;
  console.log(auth, notifications)
  const [menuOpened, setMenuOpened] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setServicioIsOpen(false);
  }
  const openModal = () => {
    setIsOpen(true);
  }



  return (
    <div className="flex items-center justify-between w-full p-4 text-sm bg-newGreen-100 border-b md:py-0 md:px-12 d:text-md">
      <div className="mt-1 mr-4 font-bold text-xl text-white">
        Sistema de Administración Interna
      </div>
      <div className="flex flex-between items-center gap-3">
        {/* Notiffivationes */}
        {
          notifications.credito_manana.length > 0 && 

          <div onClick={openModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 cursor-pointer text-white animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        }
      
        {/* <img className="h-12 w-12" src="https://image.flaticon.com/icons/png/512/401/401156.png"></img> */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer select-none group"
            onClick={() => setMenuOpened(true)}
          >
            <div className="mr-1 text-white font-bold whitespace-nowrap group-hover:text-indigo-600 focus:text-indigo-600">
              <span>{auth.user.first_name}</span>
              <span className="hidden ml-1 md:inline">
                {auth.user.last_name}
              </span>
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
              {auth.user.owner == 1 && (
                <>
                <InertiaLink
                  href={route('users')}
                  className="block px-6 py-2 hover:bg-newblue-100 hover:text-white"
                  onClick={() => setMenuOpened(false)}
                >
                  Administrar Usuarios
                </InertiaLink>
                 <InertiaLink
                 href={route('registro')}
                 className="block px-6 py-2 hover:bg-newblue-100 hover:text-white"
                 onClick={() => setMenuOpened(false)}
               >
                 Registros
               </InertiaLink>
               </>
              )}

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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ingrese el pin de vendedor"
        // style={customStyles}
      >
        <div className='flex justify-between pb-5 items-center'>
          <h2 className='text-lg font-bold'>Notificaciones de Cobro</h2>
          <LoadingButton className="btn-indigo" onClick={closeModal}>close</LoadingButton>
        </div>
        <div>
              <div className="flex w-full justify-around font-semibold text-newblue-200">
                        <div className="w-1/12">id</div>
                        <div className="w-2/12">Cliente</div>
                        <div className="w-2/12">Total factura</div>
                        <div className="w-2/12">Restante factura</div>
                        <div className="w-2/12">Fecha Venta</div>
                        <div className="w-1/12">Limite de Pago</div>
                        <div className="w-2/12">Opciones</div>
                </div>
            { notifications.credito_manana &&

                notifications.credito_manana.filter(v => v.organization_id == auth.user.organization_id).map(noti => 
                  {
                    return (
                      <div className="flex w-full justify-around">
                        <div className="w-1/12">{noti.id}</div>
                        <div className="w-2/12">{noti.cliente}</div>
                        <div className="w-2/12">{noti.total}</div>
                        <div className="w-2/12">{noti.restante}</div>
                        <div className="w-2/12">
                          {moment(noti.created_at)
                            .locale('es')
                            .format('DD MMM YYYY')}
                        </div>
                        <div className="w-1/12">
                          {moment(noti.limite_pago)
                            .locale('es')
                            .format('DD MMM YYYY')}
                        </div>
                          <InertiaLink
                            href={route('ventas.edit', noti.id)}
                            onClick={closeModal}
                            className="flex w-2/12 items-center px-4 font-bold focus:outline-none text-newblue-100"
                          >
                            ver factura
                          </InertiaLink>
                      </div>
                    );

                  }
                )


            }

            <div className='flex gap-1 pt-5'>
          {/* <LoadingButton onClick={checkPin} className="btn-indigo" >Ok</LoadingButton> */}
          <LoadingButton onClick={closeModal} className="btn-indigo" >Close</LoadingButton>
            </div>
        </div>

      </Modal>


    </div>
  );
};
