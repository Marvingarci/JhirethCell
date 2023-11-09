import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { products, existencia } = usePage().props;
  const {
    data,
    meta: { links }
  } = products;
  console.log(products, existencia)
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Inventario</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
        <InertiaLink
          className="btn-indigo focus:outline-none"
          href={route('products.create')}
        >
          <span>Crear</span>
          <span className="hidden md:inline"> Producto</span>
        </InertiaLink>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Nombre</th>
              <th className="px-6 pt-5 pb-4">Color</th>
              <th className="px-6 pt-5 pb-4">Existencia</th>
              <th className="px-6 pt-5 pb-4">Precio Mayorista</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Precio Normal
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, name, color,  sell_price, whole_sell_price, realExistencia }) => {
              return (
                <tr
                  key={id}
                  className="hover:bg-gray-100 focus-within:bg-gray-100"
                >
                  <td className="border-t">
                    <InertiaLink
                      href={route('products.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo-700 focus:outline-none"
                    >
                      {name}
                      {/* {deleted_at && (
                        <Icon
                          name="trash"
                          className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                        />
                      )} */}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('products.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {color}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    {
                      
                    }
                    <InertiaLink
                      tabIndex="-1"
                      href={route('products.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {       
                      realExistencia 
                      }
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('products.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {whole_sell_price}
                    </InertiaLink>
                  </td>
                  <td className="border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('products.edit', id)}
                      className="flex items-center px-6 py-2 focus:text-indigo focus:outline-none"
                    >
                      {sell_price}
                    </InertiaLink>
                  </td>
                  <td className="w-px border-t">
                    <InertiaLink
                      tabIndex="-1"
                      href={route('products.edit', id)}
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
