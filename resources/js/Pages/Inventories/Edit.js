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
  const { product , inventario} = usePage().props;
  const { data, setData, errors, post, processing , reset} = useForm({
    product_id: product.id || '',
    codebar: '',
    imei: '',
    status:'stock',
     // NOTE: When working with Laravel PUT/PATCH requests and FormData
    // you SHOULD send POST request and fake the PUT request like this.
   // _method: 'PUT'
  });


  function handleSubmit(e) {
    e.preventDefault();
        // NOTE: We are using POST method here, not PUT/PACH. See comment above.
    data.imei = data.codebar
    console.log(data)
    post(route('inventario.store'),{
      onSuccess: page => {
        reseteo()
      },
    });
  }

  const reseteo=()=>{
    reset()
  }

  function destroy(id) {
    if (confirm('¿Está seguro que desea borrar este registro?')) {
      Inertia.delete(route('inventario.destroy', id));
    }
  }

  return (
    <div>
      <Helmet title={product.name} />
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
            href={route('products.edit', product.id)}
            className="text-indigo-600 hover:text-indigo-700"
        >
         {product.name} 
        </InertiaLink>

        <span className="mx-2 font-medium text-indigo-600">/</span>
        Administrar Inventario
      </h1>
      {product.deleted_at && (
        <TrashedMessage onRestore={restore}>
          Este producto ha sido borrado
        </TrashedMessage>
      )}

      <div className=" overflow-hidden bg-white rounded shadow">
      <div className="flex items-center justify-center py-5">
          <p className="text-2xl text-gray-500 text-center font-bold">
            Existencia: 
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Escanee Código o IMEI"
              name="first_name"
              errors={errors.codebar}
              value={data.codebar}
              onChange={e => setData('codebar', e.target.value)}
            />
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="IMEI"
              name="first_name"
              errors={errors.imei}
              value={data.imei}
              onChange={e => setData('imei', e.target.value)}
            /> */}
            <div className="flex items-center">
            <LoadingButton
              loading={processing}
              type="submit"
              className="btn-indigo"
            >
              Guardar
            </LoadingButton>
            </div>
            {/* Comienzo tabla */}
            <div className="overflow-x-auto bg-white rounded shadow w-full">
              <table className=" whitespace-nowrap w-full">
                <thead>
                  <tr className="font-bold text-center">
                    <th className="px-6 pt-5 pb-4">id</th>
                    <th className="px-6 pt-5 pb-4">Código</th>
                    <th className="px-3 pt-5 pb-4">Imei</th>
                    <th className="px-3 pt-5 pb-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inventario.map(
                    (
                      {
                        id,
                        product_id,
                        codebar,
                        imei,status
                      },
                      index
                    ) => (
                      <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t justify-center text-center items-center">
                            {id}
                        </td>
                        <td className={`border-t justify-center text-center items-center`}>
                            {codebar}
                        </td>
                        
                        <td className="border-t justify-center text-center items-center">
                          {imei}
                          </td>
                          <td className="border-t justify-center text-center items-center">
                          {status}
                          </td>
                        <td className="border-t">
                          <button
                            onClick={e => destroy(id)}
                            className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  {inventario.length === 0 && (
                    <tr>
                      <td className="px-6 py-4 border-t" colSpan="4">
                        No hay productos aun
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* fin tabla */}
          </div>
          <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
            
          </div>
        </form>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
