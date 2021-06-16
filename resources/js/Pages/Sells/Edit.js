import React, { useEffect, useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import SearchFilter from '@/Shared/SearchFilterForCode';

const Edit = () => {
  const { categorias, usuarios, producto, venta } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    vendedor: '',
    cliente: venta[0].cliente,
    total: venta[0].total,
    tipoPago: venta[0].tipoPago
  });

  console.log(venta)
  const [carrito, setCarrito] = useState(venta[0].venta_detalles);
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
    post(route('ventas.store'));
  }

  useEffect(() => {
    if (producto != null) {
      const newProduct = producto;
      newProduct.cantidad = 0;
      newProduct.real_sell_price = newProduct.sell_price;
      newProduct.descuento = 0;
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
  setDescuento

  const setDescuento = (index, descuento) => {
    carrito[index].descuento = descuento;
    carrito[index].real_sell_price = carrito[index].sell_price - (carrito[index].sell_price * descuento);
    carrito[index].total_producto = carrito[index].cantidad * carrito[index].real_sell_price;
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
        <span className="font-medium text-indigo-600"> /</span> Detalle Venta
      </h1>
      <div className=" overflow-hidden bg-white rounded shadow">
        <div className="flex items-center justify-center py-5">
          <p className="text-2xl text-gray-500 text-center font-bold">
            Detalle de Venta
          </p>
        </div>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/4"
              label="Cliente"
              name="first_name"
              disabled
              value={data.cliente}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/4"
              label="Vendedor"
              name="first_name"
              disabled
              value={usuarios.filter((u)=> venta[0].vendedor_id == u.id ).map(filter => filter.first_name+' '+filter.last_name)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/4"
              label="Fecha"
              name="first_name"
              disabled
              value={ahora}
            />
             <TextInput
              className="w-full pb-8 pr-6 lg:w-1/4"
              label="Tipo de Pago"
              name="first_name"
              disabled
              value={data.tipoPago}
            />
            
            {/* Comienzo tabla */}
            <div className="overflow-x-auto   bg-white rounded shadow">
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
                  {carrito.map(
                    (
                      {
                        producto,
                        precio,
                        descuento,
                        cantidad,
                        total_producto,
                        real_sell_price
                      },
                      index
                    ) => (
                      <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t px-6 pt-5 pb-4">
                            {producto}
                        </td>
                        <td className="border-t px-6 pt-5 pb-4">
                          {cantidad}
                        </td>
                        <td className="border-t px-6 pt-5 pb-4">
                          {precio}
                          </td>
                        <td className="border-t px-6 pt-5 pb-4">
                          {descuento}
                        </td>
                        <td className="border-t px-6 pt-5 pb-4">
                         {total_producto}
                        </td>

                        
                      </tr>
                    )
                  )}
                  <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="px-6 py-4 border-t" colSpan="3"></td>
                    <td className="px-6 py-4 border-t font-bold">Total</td>
                    <td className="px-6 py-4 border-t font-bold">
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
              onClick={e=> Inertia.get(route('ventas'))}
              className="btn-indigo"
            >
              Atras
            </LoadingButton>
          </div>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout title="Create Contact" children={page} />;

export default Edit;
