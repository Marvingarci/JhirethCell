import React from 'react';
import Helmet from 'react-helmet';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import Icon from '@/Shared/Icon';
const colores = [
  'verde','azul','naranja','negro','blanco','morado','amarillo','rojo','gris'
]
const Edit = () => {
  const { product , categorias} = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    id: product.id || '',
    name: product.name || '',
    product_code: product.product_code || '',
    existencia: product.existencia || '',
    cost_price: product.cost_price || '',
    sell_price: product.sell_price || '',
    color : product.color || '',
    category_id : product.category.id || '',
    created_at: product.created_at || '',
     // NOTE: When working with Laravel PUT/PATCH requests and FormData
    // you SHOULD send POST request and fake the PUT request like this.
    _method: 'PUT'
  });

  console.log(product)

  function handleSubmit(e) {
    e.preventDefault();
        // NOTE: We are using POST method here, not PUT/PACH. See comment above.
    post(route('products.update', product.id));
  }

  function destroy() {
    if (confirm('¿Está seguro que desea borrar este producto?')) {
      Inertia.delete(route('products.destroy', data.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this organization?')) {
      Inertia.put(route('product.restore', product.id));
    }
  }

  return (
    <div>
      <Helmet title={data.name} />
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('products')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Productos
        </InertiaLink>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.name}
      </h1>
      {product.deleted_at && (
        <TrashedMessage onRestore={restore}>
          Este producto ha sido borrado
        </TrashedMessage>
      )}
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Nombre"
              name="name"
              errors={errors.name}
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Código del Producto"
              name="email"
              type="text"
              errors={errors.product_code}
              value={data.product_code}
              onChange={e => setData('product_code', e.target.value)}
            />
           <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Color"
              name="Categoria"
              errors={errors.color}
              value={data.color}
              onChange={e => setData('color', e.target.value)}
            >
              <option value=""></option>
              {
                colores.map(color=>{
                  return(<option value={color}>{color}</option>)
                })
              }              
            </SelectInput>
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Existecia"
              name="address"
              type="number"
              errors={errors.existencia}
              value={data.existencia}
              onChange={e => setData('existencia', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Precio de costo"
              name="city"
              type="number"
              errors={errors.cost_price}
              value={data.cost_price}
              onChange={e => setData('cost_price', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Precio de venta"
              name="region"
              type="number"
              errors={errors.sell_price}
              value={data.sell_price}
              onChange={e => setData('sell_price', e.target.value)}
            />
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Categoría"
              name="country"
              errors={errors.category_id}
              value={data.category_id}
              onChange={e => setData('category_id', e.target.value)}
            >
              <option value=""></option>
              {
                categorias.map(categoria=>{
                  return(<option value={categoria.id}>{categoria.name}</option>)
                })
              }   
            </SelectInput>
          </div>
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            {!product.deleted_at && (
              <DeleteButton onDelete={destroy}>
               Borrar Producto
              </DeleteButton>
            )}
            <LoadingButton
              loading={processing}
              type="submit"
              className="ml-auto btn-indigo"
            >
              Editar Producto
            </LoadingButton>
          </div>
        </form>
      </div>
      {/* <h2 className="mt-12 text-2xl font-bold">Contacts</h2>
      <div className="mt-6 overflow-x-auto bg-white rounded shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Name</th>
              <th className="px-6 pt-5 pb-4">City</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {product.contacts.map(
              ({ id, name, phone, city, deleted_at }) => {
                return (
                  <tr
                    key={id}
                    className="hover:bg-gray-100 focus-within:bg-gray-100"
                  >
                    <td className="border-t">
                      <InertiaLink
                        href={route('contacts.edit', id)}
                        className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
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
                        tabIndex="-1"
                        href={route('contacts.edit', id)}
                        className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                      >
                        {city}
                      </InertiaLink>
                    </td>
                    <td className="border-t">
                      <InertiaLink
                        tabIndex="-1"
                        href={route('contacts.edit', id)}
                        className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                      >
                        {phone}
                      </InertiaLink>
                    </td>
                    <td className="w-px border-t">
                      <InertiaLink
                        tabIndex="-1"
                        href={route('contacts.edit', id)}
                        className="flex items-center px-4"
                      >
                        <Icon
                          name="cheveron-right"
                          className="block w-6 h-6 text-gray-400 fill-current"
                        />
                      </InertiaLink>
                    </td>
                  </tr>
                );
              }
            )}
            {product.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  Sin productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
