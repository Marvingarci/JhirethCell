import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import Pagination from '@/Shared/Pagination';
import SearchFilter from '@/Shared/SearchFilter';
import { first } from 'lodash';

const Index = () => {
  const { servicios , usuarios, auth} = usePage().props;
  const {
    data,
    meta: { links }
  } = servicios;


console.log(servicios, usuarios)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      <h1 className="mb-8 text-3xl font-bold">Servicios</h1>
        <InertiaLink
          className="btn-indigo focus:outline-none"
          href={route('servicios.create')}
        >
          <span>Nuevo</span>
          <span className="hidden md:inline"> Servicio</span>
        </InertiaLink>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Id</th>
              <th className="px-6 pt-5 pb-4">Nombre</th>
              <th className="px-6 pt-5 pb-4">Codigo</th>
               {
                  auth.user.owner == true && 
                  <th className="px-6 pt-5 pb-4" >Costo</th>
              }
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Pago
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, costo, nombre, pago, service_code  }) => (
              <tr
                key={id}
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="border-t">
                  <InertiaLink
                    href={route('servicios.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {id}
                   
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    href={route('servicios.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {nombre}
                   
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    href={route('servicios.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {service_code}
                   
                  </InertiaLink>
                </td>
                {
                  auth.user.owner == true && 
                  <td className="border-t">
                  <InertiaLink
                    tabIndex="1"
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                    href={route('servicios.edit', id)}
                  >
                    {costo}
                  </InertiaLink>
                </td>
              }
               
                <td className="border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('servicios.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {pago}
                  </InertiaLink>
                </td>
                <td className="w-px border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('servicios.edit', id)}
                    className="flex items-center px-4 focus:outline-none"
                  >
                    <Icon
                      name="cheveron-right"
                      className="block w-6 h-6 text-gray-400 fill-current"
                    />
                  </InertiaLink>
                </td>
              </tr>
            ))}
            {servicios.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No hay Servicios aún
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

Index.layout = page => <Layout title="Contacts" children={page} />;

export default Index;
