import React, { useEffect, useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import SearchFilter from '@/Shared/SearchFilterForCode';

const IndexFast = () => {
  const { categorias, usuarios, producto, ventasRapidas } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    vendedor_id: '',
    cliente: '',
    total: 0,
    tipoPago: 'pendiente',
    ventas: []
  });

  console.log(ventasRapidas)

  const [carrito, setCarrito] = useState([]);
  const [cuenta, setCuenta] = useState(0);

  const date = new Date();
  const ahora =
    date.getDate() +
    '-' +
    (date.getMonth() + 1 > 9
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)) +
    '-' +
    date.getFullYear();

  function handleSubmit(e) {
    e.preventDefault();
    data.ventas = carrito;
    console.log(data);
    post(route('ventas.store'),{
      onSuccess: page => {
        setCarrito([])
      },
    });
  }

  useEffect(() => {
    if (producto != null) {
      const newProduct = producto;
      newProduct.cantidad = 0;
      newProduct.real_sell_price = newProduct.sell_price;
      newProduct.descuento = 0;
      newProduct.estado = 'pendiente'
      newProduct.total_producto = newProduct.cantidad * newProduct.sell_price;
      if (carrito.length == 0) {
        setCarrito([...carrito, newProduct]);
      } else {
        if (carrito.find(item => item.id === newProduct.id)) {
        } else {
          setCarrito([...carrito, newProduct]);
        }
      }
      reset();
      SumaTotal();
    }
  }, [producto]);
  setDescuento;

  const setDescuento = (index, descuento) => {
    carrito[index].descuento = descuento;
    carrito[index].real_sell_price =
      carrito[index].sell_price - carrito[index].sell_price * descuento;
    carrito[index].total_producto =
      carrito[index].cantidad * carrito[index].real_sell_price;
    setCarrito([...carrito]);
    SumaTotal();
  };

  const setCantidad = (index, cantidad) => {
    carrito[index].cantidad = parseFloat(cantidad);
    carrito[index].total_producto =
      carrito[index].cantidad * carrito[index].real_sell_price;
    setCarrito([...carrito]);
    SumaTotal();
  };

  const SumaTotal = () => {
    let contar = 0;
    carrito.map(item => {
      contar = contar + item.total_producto;
    });
    setData('total', contar);
  };

  const eliminar = codigo => {
    const newP = carrito.filter(item => item.product_code !== codigo);
    setCarrito([...newP]);
    let contar = 0;
    newP.map(item => {
      contar = contar + item.total_producto;
    });
    setData('total', contar);
  };

  const handleConfirm = venta =>{
    Inertia.put(route('ventas.actualizar', {id: venta.id, venta_detalles : venta.venta_detalles[0]}),{id: venta.id, venta_detalles : venta.venta_detalles[0]}, {
      onSuccess: page =>{

      },
      onError: error =>{
        console.log(error);
      }
    })
  }

  const handleCancel= venta =>{
    console.log(venta)
    Inertia.put(route('ventas.destroy', {id: venta.id, venta_detalles : venta.venta_detalles}), {id: venta.id, venta_detalles : venta.venta_detalles[0]}, {
      onSuccess: page =>{

      },
      onError: error =>{
        console.log(error);
      }
    })
  }

  const myref = useRef();
  const reset = () => {
    myref.current.reset();
  };
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Caja Rápida</h1>
      <div className=" overflow-hidden bg-white rounded shadow">
        <div className="flex items-center justify-center py-5">
          <p className="text-2xl text-gray-500 text-center font-bold">
            Registro de Venta Rápida
          </p>
        </div>
        <div className="flex flex-wrap p-8 -mb-8 -mr-6">
          <SearchFilter className="w-full" ref={myref} />
          {/* Comienzo tabla */}
          <div className="overflow-x-auto bg-white rounded shadow w-full">
            <table className=" whitespace-nowrap w-full">
              <thead>
                <tr className="font-bold text-left">
                  <th className="px-6 pt-5 pb-4">Nombre</th>
                  <th className="px-6 pt-5 pb-4">Cliente</th>
                  <th className="px-6 pt-5 pb-4">Vendedor</th>
                  <th className="px-3 pt-5 pb-4">Cantidad</th>
                  <th className="px-6 pt-5 pb-4">Precio</th>
                  <th className="px-6 pt-5 pb-4">Descuento</th>
                  <th className="px-6 pt-5 pb-4 " colSpan="2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {carrito.map(
                  (
                    {
                      product_code,
                      name,
                      existencia,
                      cantidad,
                      sell_price,
                      total_producto,
                      real_sell_price
                    },
                    index
                  ) => (
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                      <td className="border-t justify-center text-center items-center">
                        {name}
                      </td>
                      <td
                        className={`border-t justify-center text-center items-center`}
                      >
                        <TextInput
                          className="w-full"
                          name="first_name"
                          errors={errors.cliente}
                          value={data.cliente}
                          onChange={e => setData('cliente', e.target.value)}
                        />
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        <SelectInput
                          className="w-full"
                          name="organization_id"
                          errors={errors.vendedor}
                          value={data.vendedor}
                          onChange={e => setData('vendedor_id', e.target.value)}
                        >
                          <option value=""></option>
                          {usuarios.map(({ id, first_name, last_name }) => (
                            <option value={id}>
                              {first_name + ' ' + last_name}
                            </option>
                          ))}
                        </SelectInput>
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        <TextInput
                          className="w-20"
                          type="number"
                          value={cantidad}
                          inputProps={{
                            min: 1
                          }}
                          onChange={e => setCantidad(index, e.target.value)}
                        />
                      </td>
                     

                      <td className="border-t justify-center text-center items-center">
                        {real_sell_price}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        <SelectInput
                          className="w-20"
                          name="organization_id"
                          // errors={errors.tipoPago}
                          // value={data.tipoPago}
                          onChange={e => setDescuento(index, e.target.value)}
                        >
                          <option value="0">N/A</option>
                          <option value="0.01">1%</option>
                          <option value="0.02">2%</option>
                          <option value="0.03">3%</option>
                          <option value="0.04">4%</option>
                          <option value="0.05">5%</option>
                          <option value="0.10">10%</option>
                          <option value="0.15">15%</option>
                        </SelectInput>
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {total_producto}
                      </td>

                      <td className="border-t">
                        <button
                          onClick={handleSubmit}

                          className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Agregar
                        </button>
                      </td>
                    </tr>
                  )
                )}
               
                {carrito.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 border-t" colSpan="4">
                      Escanea un producto
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* fin tabla */}
        </div>
        <div className="flex items-center justify-center py-5">
          <p className="text-lg text-gray-500 text-center font-bold">
            Cola de Ventas
          </p>
        </div>

       {/* Comienzo tabla pendiente */}
       <div className="overflow-x-auto bg-white rounded shadow w-full">
            <table className=" whitespace-nowrap w-full">
              <thead>
                <tr className="font-bold text-left">
                  <th className="px-6 pt-5 pb-4">Nombre</th>
                  <th className="px-6 pt-5 pb-4">Cliente</th>
                  <th className="px-6 pt-5 pb-4">Vendedor</th>
                  <th className="px-3 pt-5 pb-4">Cantidad</th>
                  <th className="px-6 pt-5 pb-4">Precio</th>
                  <th className="px-6 pt-5 pb-4">Descuento</th>
                  <th className="px-6 pt-5 pb-4 " colSpan="2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ventasRapidas.map(
                  (
                    venta,
                    index
                  ) => (
                    venta.venta_detalles.map(({producto, cantidad, precio, descuento, total_producto})=>(
                      <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                      <td className="border-t justify-center text-center items-center">
                        {producto}
                      </td>
                      <td
                        className={`border-t justify-center text-center items-center`}
                      >
                        {venta.cliente}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                          {usuarios.filter((user)=> user.id == venta.vendedor_id).map(({ id, first_name, last_name }) => (
                              first_name + ' ' + last_name
                          ))}
                        
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {cantidad}
                      </td>
                     

                      <td className="border-t justify-center text-center items-center">
                        {precio}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {
                          descuento
                        }
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {total_producto}
                      </td>

                      <td className="border-t">
                        <button
                          onClick={e=>handleConfirm(venta)}

                          className="bg-green-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Vendido
                        </button>
                        <button
                          onClick={e=>handleCancel(venta)}

                          className="bg-red-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Devuelto
                        </button>
                      </td>
                    </tr>
                    ))
                    
                  )
                )}
               
                
              </tbody>
            </table>
          </div>
          {/* fin tabla pendiente */}
      </div>

    </div>
  );
};

IndexFast.layout = page => <Layout title="Create Contact" children={page} />;

export default IndexFast;
