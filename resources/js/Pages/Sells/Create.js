import React, { useEffect , useState, useRef} from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import SearchFilter from '@/Shared/SearchFilterForCode';

const Create = () => {
  const { categorias , usuarios, producto} = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    vendedor_id: '',
    cliente: '',
    total: 0,
    tipoPago: '',
    ventas: [],
  });

  const [carrito, setCarrito]=useState([])
  const [cuenta, setCuenta]=useState(0)


  const date = new Date();
    const ahora =
        date.getDate() +
        "-" +
        (date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1)) +
        "-" +
        date.getFullYear();

  function handleSubmit(e) {
    e.preventDefault();
    data.ventas= carrito
    console.log(data)    
    post(route('ventas.store'));
  }

  useEffect(()=>{
    if(producto != null){
      const newProduct = producto
      newProduct.cantidad = 0;
      newProduct.total_producto = newProduct.cantidad * newProduct.sell_price;
      if(carrito.length == 0){
        setCarrito([...carrito, newProduct]);
      }else{
        
          if(carrito.find((item) => item.id === newProduct.id)){
            
          }else{
            setCarrito([...carrito, newProduct]);
          }
        
      }
       reset()
       SumaTotal()
    }
  },[producto])

  const setCantidad=(index, cantidad)=>{
    carrito[index].cantidad = cantidad;
    carrito[index].total_producto = carrito[index].cantidad * carrito[index].sell_price;
    setCarrito([...carrito])
    SumaTotal()
  }
  const setPrecio=(index, nuevoPrecio)=>{
    carrito[index].sell_price = nuevoPrecio;
    carrito[index].total_producto = carrito[index].cantidad * carrito[index].sell_price;
    setCarrito([...carrito])
    SumaTotal()
  }

  const SumaTotal=()=>{
    let contar = 0
    carrito.map(item=>{
      contar = contar + item.total_producto
    })
    setData('total', contar)
  }

  const eliminar=(codigo)=>{
    const newP = carrito.filter(
      (item) => item.product_code !== codigo
    );
    setCarrito([...newP])
    let contar = 0
    newP.map(item=>{
      contar = contar + item.total_producto
    })
    setData('total', contar)
  }

  const myref = useRef();
  const reset = () => {
    myref.current.reset();
  };
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('ventas')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Ventas
        </InertiaLink>
        <span className="font-medium text-indigo-600"> /</span> Nueva Venta
      </h1>
      <div className=" overflow-hidden bg-white rounded shadow">
      <div className="flex items-center justify-center py-5">
                    <p className="text-2xl text-gray-500 text-center font-bold">
                        Registro de Venta
                    </p>
            </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Cliente"
              name="first_name"
              errors={errors.cliente}
              value={data.cliente}
              onChange={e => setData('cliente', e.target.value)}
            />
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Vendedor"
              name="organization_id"
              errors={errors.vendedor}
              value={data.vendedor}
              onChange={e => setData('vendedor_id', e.target.value)}
            >
              <option value=""></option>
              {usuarios.map(({ id, first_name, last_name }) => (
                <option value={id}>
                  {first_name+" "+last_name}
                </option>
              ))}
            </SelectInput>
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Fecha"
              name="first_name"
              disabled
              value={ahora}
            />
            <SearchFilter className="w-full" ref={myref}/>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Pago"
              name="organization_id"
              errors={errors.tipoPago}
              value={data.tipoPago}
              onChange={e => setData('tipoPago', e.target.value)}
            >
              <option value=""></option>
              <option value="efectivo">Efectivo</option>
              <option value="credito">Credito</option>
              
            </SelectInput>
            {/* Comienzo tabla */}
          <div className="overflow-x-auto bg-white rounded shadow">
        <table className=" whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Producto</th>
              <th className="px-3 pt-5 pb-4">Cantidad</th>
              <th className="px-6 pt-5 pb-4">Precio</th>
              <th className="px-6 pt-5 pb-4">Descuento</th>
              <th className="px-6 pt-5 pb-4 " colSpan="2">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            
            {carrito.map(({ product_code, name, existencia, cantidad, sell_price, total_producto}, index) => (
              <tr
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="border-t">
                  <InertiaLink
                    
                    className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                  >
                    {name}
                  </InertiaLink>
                </td>
                <td className="border-t">
                <TextInput
                type='number'
                value={cantidad}
                inputProps={{
                  min: 1
                }}
                onChange={e => setCantidad(index, e.target.value) }
            />
                </td>
                <td className="border-t">
                <TextInput
                type='number'
                value={sell_price}
                inputProps={{
                  min: 1
                }}
                onChange={e => setPrecio(index, e.target.value) }
                />
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="-1"
                    
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {}
                  </InertiaLink>
                </td>
                <td className="border-t">
                  <InertiaLink
                    tabIndex="-1"
                    
                    className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                  >
                    {total_producto}
                  </InertiaLink>
                </td>

                <td className="border-t">
                  <button onClick={e=>eliminar(product_code)} className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1">Eliminar</button>
                </td>
              </tr>
            ))}
            <tr
                className="hover:bg-gray-100 focus-within:bg-gray-100"
              >
                <td className="px-6 py-4 border-t" colSpan="3">
                  
                </td>
                <td className="px-6 py-4 border-t font-bold" >
                  Total
                </td>
                <td className="px-6 py-4 border-t font-bold" >
                  {data.total}
                </td>
                
               

              </tr>
            {carrito.length === 0 && (
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
            <LoadingButton
              loading={processing}
              type="submit"
              className="btn-indigo"
            >
              Cerrar venta
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Contact" children={page} />;

export default Create;
