import React, { useState } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import Pagination from '@/Shared/Pagination';
import SearchFilter from '@/Shared/SearchFilter';
import moment from 'moment';

const IndexCredit = () => {
  const { contacts , ventasNoMayo} = usePage().props;
  const [tab, setTab] = useState('clients')
  const {
    data,
    meta: { links }
  } = contacts;
  console.log(data)
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold ">Clientes con credito pendiente</h1>
      <div className='flex mb-4'>
        <div onClick={e => setTab('clients')} className={ tab == 'clients' ? 'w-1/2 border-2 border-gray-400 py-3 bg-gray-100 text-center text-xl': 'w-1/2 border-2 border-gray-400 py-3 cursor-pointer bg-gray-300 text-center text-xl'}>Clientes Registrados</div>
        <div onClick={e => setTab('noclients')} className={ tab == 'noclients' ? 'w-1/2 border-2 border-gray-400 py-3 bg-gray-100 text-center text-xl': 'w-1/2 border-2 border-gray-400 py-3 cursor-pointer bg-gray-300 text-center text-xl'}>Ventas Clientes NO Registrados</div>
      </div>

      {
        tab == 'clients' ? 
        <>
        <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        {/* <InertiaLink
          className="btn-indigo focus:outline-none"
          href={route('contacts.create')}
        >
          <span>Create</span>
          <span className="hidden md:inline"> Clientes</span>
        </InertiaLink> */}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Nombre</th>
              <th className="px-6 pt-5 pb-4">Celular</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Tienda
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, name, phone, organization, ventas,  deleted_at }) => (
              ventas.length > 0 && (
              <tr
                key={id}
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="border-t">
                  <InertiaLink
                    href={route('contacts.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {name}
                    {deleted_at && (
                      <Icon
                        name="trash"
                        className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                      />
                    )}
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="1"
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                    href={route('contacts.edit', id)}
                  >
                    {phone}
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('contacts.edit', id)}
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {organization ? organization.name : ''}
                  </InertiaLink>
                </td>
                <td className="w-px border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('contacts.edit', id)}
                    className="flex items-center px-4 focus:outline-none"
                  >
                    <Icon
                      name="cheveron-right"
                      className="block w-6 h-6 text-gray-400 fill-current"
                    />
                  </InertiaLink>
                </td>
              </tr>
              )
            ))}
            {contacts.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination links={links} />
      </>
        :
        <>
        <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Fecha</th>
              <th className="px-6 pt-5 pb-4">Nombre</th>
              <th className="px-6 pt-5 pb-4">Vendedor</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Tienda
              </th>
            </tr>
          </thead>
          <tbody>
            {ventasNoMayo.map(({id , cliente, organization, ventas, vendedor, created_at }) => (
              <tr
                key={id}
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="border-t">
                  <InertiaLink
                    href={route('ventas.edit', id)}
                    className="flex items-center px-3 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {moment(created_at).locale("es").calendar()}
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="1"
                    className="flex items-center px-3 py-4 focus:text-indigo focus:outline-none"
                    href={route('ventas.edit', id)}
                  >
                    {cliente}
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('ventas.edit', id)}
                    className="flex items-center px-3 py-4 focus:text-indigo focus:outline-none"
                  >
                    {vendedor ? vendedor?.first_name : ''}
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('ventas.edit', id)}
                    className="flex items-center px-3 py-4 focus:text-indigo focus:outline-none"
                  >
                    {organization ? organization.name : ''}
                  </InertiaLink>
                </td>
                <td className="w-px border-t">
                  <InertiaLink
                    tabIndex="-1"
                    href={route('ventas.edit', id)}
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
            {ventasNoMayo.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No hay ventas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      }
     
    </div>
    
  );
};

IndexCredit.layout = page => <Layout title="Creditos" children={page} />;

export default IndexCredit;
