import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';
import moment from 'moment';
import LoadingButton from '@/Shared/LoadingButton';

const Index = () => {
  const { transferencias } = usePage().props;
  const {
    data,
    meta: { links }
  } = transferencias;

  const convert = (inventario) => {
    inventario.forEach(el => {
      if(el.product_id != null ){
        if(typeof el.product_id  !== 'object'){
          el.product_id = JSON.parse(el.product_id)
        }
      }
    });
    console.log(inventario)
    return inventario;
  }

  // const parseInven = () => {
  //   Inertia.get(route('transfer.show'), 
  //   {onSuccess: page =>{console.log(page)}})
  // }

  convert(data)
  console.log(data)
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Transferencias entre Tiendas</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        <InertiaLink
          className="btn-indigo focus:outline-none"
          href={route('transfer.create')}
        >
          <span>Crear</span>
          <span className="hidden md:inline"> Transferencia</span>
        </InertiaLink>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Fecha</th>
              <th className="px-6 pt-5 pb-4">Descripcion</th>
              <th className="px-6 pt-5 pb-4">Desde</th>
              <th className="px-6 pt-5 pb-4">Hacia</th>
              <th className="px-6 pt-5 pb-4">Enviado por</th>
              <th className="px-6 pt-5 pb-4" >Recibido por</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">Confirmado</th>

            </tr>
          </thead>
          <tbody>
            {data.map(({ id, description, confirmation,  received_by, product_id, new_organization, old_organization, recibido_por, enviado_por, created_at  }) => {
              return (
                <tr
                  key={id}
                  className="hover:bg-gray-100 focus-within:bg-gray-100"
                >
                   <td className="border-t">
                    <InertiaLink
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                      >
                      {moment(created_at).locale("es").calendar()}
                      
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo-700 focus:outline-none"
                    >
                      {description}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {old_organization?.name}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {new_organization?.name}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {enviado_por?.first_name}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {recibido_por?.first_name}
                    </InertiaLink>
                  </td>

                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('transfer.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      { confirmation == true &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      
                      }
                    </InertiaLink>
                  </td>

                  
                  <td className="w-px border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('transfer.edit', id)}
                      className="flex items-center px-4 focus:outline-none"
                    >
                      <Icon
                        name="cheveron-right"
                        className="block w-6 h-6 text-gray-400 fill-current"
                      />
                    </InertiaLink>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No hay productos registrados 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination links={links} />
    </div>
  );
};

Index.layout = page => <Layout title="Organizations" children={page} />;

export default Index;
