import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';

import { usePage } from '@inertiajs/inertia-react';

const SeparateReport = () => {
  const { ventas_pantallas, ventas_celulares, ventas_accesorios } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);
  var total_pantallas=0;
  var total_celulares=0;
  var total_accesorios=0;

  return (
    <div>

      <h1 className="mb-8 text-3xl font-bold">Reporte Ventas por Categoria</h1>
      <p className="font-bold m-2">Pantallas</p>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Precio</th>
                    <th className="px-auto pt-5 pb-4 text-center">Cantidad</th>
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_pantallas.map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_pantallas += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.precio}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>
                        </tr>)

                      })
                       
                    )
                  )}
                  <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">
                      {total_pantallas}
                    </td>
                  </tr>
                </tbody>
              </table>
      </div>
      <hr/>

      <p className="font-bold m-2">Celulares</p>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Precio</th>
                    <th className="px-auto pt-5 pb-4 text-center">Cantidad</th>
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_celulares.map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.precio}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>
                        </tr>)

                      })
                       
                    )
                  )}
                  <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">
                      {total_celulares}
                    </td>
                  </tr>
                </tbody>
              </table>
      </div>

      <p className="font-bold m-2">Accesorios</p>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Precio</th>
                    <th className="px-auto pt-5 pb-4 text-center">Cantidad</th>
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_accesorios.map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.precio}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>
                        </tr>)

                      })
                       
                    )
                  )}
                  <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">
                      {total_accesorios}
                    </td>
                  </tr>
                </tbody>
              </table>
      </div>
    </div>
  );
};

SeparateReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default SeparateReport;
