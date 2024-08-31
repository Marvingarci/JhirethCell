import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';

const colores = [
  'verde','azul','naranja','negro','blanco','morado','amarillo','rojo','gris', 'indefinido'
]
const Edit = () => {
  const { product , inventario, organizations, auth} = usePage().props;
  const convert = (inventario) => {
    inventario.forEach(el => {
      if(el.existenciaDividida != null ){
        if(typeof el.existenciaDividida  !== 'object'){
          el.existenciaDividida = JSON.parse(el.existenciaDividida)
        }
      }
    });
    console.log(inventario)
    return inventario;
  }
  const [inventories, setInventories] = useState(convert(inventario))
  const { data, setData, errors, post, processing , reset} = useForm({
    product_id: product.id || '',
    codebar: '',
    existencia: 1,
    imei: '',
    color: 'indefinido',
    organization_id: auth.user.organization_id,
    status:'stock',
    existenciaDividida: ""
     // NOTE: When working with Laravel PUT/PATCH requests and FormData
    // you SHOULD send POST request and fake the PUT request like this.
   // _method: 'PUT'
  });


  function handleSubmit(e) {
    e.preventDefault();
        // NOTE: We are using POST method here, not PUT/PACH. See comment above.
    data.imei = data.codebar
    if(product.dbType == 'colectivo'){
      let organizationame = organizations.filter((orga) => orga.id == data.organization_id);
      let existenciaJson = [
        {
          organization_id : data.organization_id,
          company_name : organizationame[0]?.name,
          cantidad: data.existencia
        }
      ]
      data.existenciaDividida = JSON.stringify(existenciaJson)
    }
    console.log(data)
    post(route('inventario.store'),{
      onSuccess: page => {
        reseteo()
        Inertia.get(route('inventario.edit', product.id))
      },
      onError: errors =>{
        console.log(errors)
      }
    });
  }

  const reseteo=()=>{
    reset()
  }

  const actualizarInventario = (id, newExitencia, existenciaDividida) =>{
    // e.preventDefault();
    console.log(id, newExitencia)
    let data1 = {
      productId : id ,
      existencia : newExitencia,
      existenciaDividida : existenciaDividida == null ? null : (typeof existenciaDividida === 'object' ? JSON.stringify(existenciaDividida) : existenciaDividida) 
    }
    if (confirm('¿Está seguro que desea actualizar la cantidad de este producto?')) {
      Inertia.post(route('inventario.actualizarInventario', data1));
    }  
  }

  const setInventario = (index,  cantidad) => {
    inventories[index].existencia = parseInt(cantidad);
    setInventories([... inventories])
  };

  const setInventarioDividido = (index,  ind, cantidad) => {
    inventories[index].existenciaDividida[ind].cantidad = parseInt(cantidad);
    inventories[index].existencia = parseInt(inventories[index].existenciaDividida.reduce((total, item) => total + item.cantidad, 0));
    console.log(inventories)
    setInventories([... inventories])
  };


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
        {product.dbType == 'individual' ? (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap p-8 -mb-8 -mr-6">
             {
                auth.user.owner && (
                  <>
                  
              <TextInput
                className="w-full pr-6 lg:w-1/4"
                label="Escanee Código o IMEI"
                name="first_name"
                errors={errors.codebar}
                value={data.codebar}
                onChange={e => setData('codebar', e.target.value)}
              />
              <SelectInput
              className="w-full pr-6 lg:w-1/4"
              label="Color"
              name="country"
              value={data.color}
              errors={errors.color}
              onChange={e => setData('color', e.target.value)}
            >
              <option value="">Selecciona color</option>
              {colores.map(color => {
                return <option value={color}>{color}</option>
              })}
            </SelectInput>
            <TextInput
                className="w-full pr-6 lg:w-1/4 text-gray-600"
                label="Tienda de registro"
                name="first_name"
                disabled
                value={organizations.map(({id, name })=>{
                  if(id == data.organization_id){
                    return(name)
                  }
                  }) 
                }
              />
              <div className="flex items-center">
                <LoadingButton
                  loading={processing}
                  type="submit"
                  className="btn-indigo"
                >
                  Guardar
                </LoadingButton>
              </div>
                  </>
                )
              }
              
              {/* Comienzo tabla */}
              <div className="overflow-x-auto bg-white rounded shadow w-full">
                <table className=" whitespace-nowrap w-full">
                  <thead>
                    <tr className="font-bold text-center">
                      <th className="px-6 pt-5 pb-4">Codigo</th>
                      <th className="px-3 pt-5 pb-4">Imei</th>
                      <th className="px-6 pt-5 pb-4">Color</th>
                      <th className="px-6 pt-5 pb-4">Tienda</th>
                      <th className="px-3 pt-5 pb-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.map(
                      (
                        { id, color, codebar, existencia, imei, organization_id, status },
                        index
                      ) => (
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                         
                          <td
                            className={`border-t justify-center text-center items-center`}
                          >
                            {codebar}
                          </td>

                          <td className="border-t justify-center text-center items-center">
                            {imei}
                          </td>
                          <td className="border-t justify-center text-center items-center">
                            {color}
                          </td>
                          <td className="border-t justify-center text-center items-center">
                          {organizations.map(({id, name })=>{
                            if(id == organization_id){
                              return(name)
                            }
                            }) 
                          }
                          </td>
                          <td className="border-t justify-center text-center items-center">
                            {status}
                          </td>
                          {
                            auth.user.owner && (
                          <td className="border-t">
                            <button
                              type='button'
                              onClick={e => destroy(id)}
                              className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1"
                            >
                              Eliminar
                            </button>
                          </td>
                            )
                          }
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
            <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200"></div>
          </form>
        ) : (
          <div>
              <div >
                {
                  auth.user.owner && (

                <form className="flex flex-wrap p-8 -mb-8 -mr-6" onSubmit={handleSubmit}>
                <TextInput
                  className="w-full pb-8 pr-6 lg:w-1/4"
                  label="Codigo general del producto"
                  name="first_name"
                  errors={errors.codebar}
                  value={data.codebar}
                  onChange={e => setData('codebar', e.target.value)}
                />
                  <SelectInput
              className="w-full pr-6 lg:w-1/4"
              label="Color"
              name="country"
              value={data.color}
              errors={errors.color}
              onChange={e => setData('color', e.target.value)}
            >
              <option value="">Selecciona color</option>
              {colores.map(color => {
                return <option value={color}>{color}</option>
              })}
            </SelectInput>
                <TextInput
                  className="w-full pb-8 pr-6 lg:w-1/4"
                  label="Ingresar exitencia"
                  name="first_name"
                  errors={errors.existencia}
                  value={data.existencia}
                  onChange={e => setData('existencia', e.target.value)}
                />
                <div className="flex items-center">
                  <LoadingButton
                    loading={processing}
                    type="submit"
                    className="btn-indigo"
                  >
                    Guardar
                  </LoadingButton>
                </div>
                </form>
                  )
                }

                {/* Comienzo tabla */}
                <div className="overflow-x-auto bg-white rounded shadow w-full">
                  <table className=" whitespace-nowrap w-full">
                    <thead>
                      <tr className="font-bold text-center">
                        <th className="px-6 pt-5 pb-4">Id</th>
                        <th className="px-6 pt-5 pb-4">Codigo</th>
                        <th className="px-6 pt-5 pb-4">Color</th>
                        <th className="px-6 pt-5 pb-4">Tienda</th>
                        <th className="px-3 pt-5 pb-4">Existencia</th>
                        <th className="px-3 pt-5 pb-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventories.map(
                        ({ id, product_id, color, codebar, existencia, status, organization_id, existenciaDividida }, index) => (
                          <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td className="border-t justify-center text-center items-center">
                              {id}
                            </td>
                            <td className={`border-t justify-center text-center items-center`}>
                            {codebar}
                            </td>
                            <td className="border-t justify-center text-center items-center">
                            {color}
                          </td>
                            <td className="border-t justify-center text-center items-center">
                          {organizations.map(({id, name })=>{
                            if(id == organization_id){
                              return(name)
                            }
                            }) 
                          }
                          </td>
                            { existenciaDividida == null ?(
                              <td className="border-t justify-center text-center items-center">
                              <TextInput
                                className="w-1/2"
                                type="number"
                                value={existencia}
                                onChange={e =>
                                  setInventario(index ,e.target.value)
                                }
                              />
                              </td>
                            ):(
                              <td className="border-t justify-center text-center items-center">
                                {
                                  existenciaDividida.map(({ company_name, cantidad }, ind) => {
                                    return ( 
                                      <div>
                                        <div>

                                        </div>
                                        <TextInput
                                          className="w-1/2"
                                          type="number"
                                          disabled={!auth.user.owner}
                                          label={company_name}
                                          value={cantidad}
                                          onChange={e =>
                                            setInventarioDividido(index, ind ,e.target.value)
                                          }
                                        />
                                      </div>
                                    )
                                  })
                                }
                             
                              </td>
                            )

                            }
                           
                            <td className="border-t justify-center text-center items-center">
                              {status}
                            </td>
                            {
                              auth.user.owner && (
                            <td className="border-t">
                              <button
                                type='button'
                                onClick={e => destroy(id)}
                                className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={e => actualizarInventario(id, existencia, existenciaDividida)}
                                className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1"
                              >
                                Actualizar
                              </button>
                            </td>
                              )
                            }
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
              <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
