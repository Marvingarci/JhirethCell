import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

const Index = ({children}) => {
  const { ventas } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);
  var total=0;

  console.log(ventas);
  return (
    <div>

      <div className=" w-full flex flex-wrap px-10 -mt-5 my-3 space-x-2">
          <a onClick={()=> Inertia.get(route('reports.diarios'))} className= "font-bold transition ease-in-out hover:text-white hover:bg-newGreen-100 rounded-xl py-3 text-newGreen-100 bg-white px-16">Reporte Diario</a>
          <a onClick={()=> Inertia.get(route('reports.creditos'))} className="font-bold transition ease-in-out  hover:text-white hover:bg-newGreen-100 rounded-xl py-3 text-newGreen-100 bg-white px-16">Reporte Credito</a>
          <a onClick={()=> Inertia.get(route('reports.divididos'))} className="font-bold transition ease-in-out  hover:text-white hover:bg-newGreen-100 rounded-xl py-3 text-newGreen-100 bg-white px-16">Reporte Separado</a> 
          <a onClick={()=> Inertia.get(route('reports.abonos'))} className="font-bold transition ease-in-out  hover:text-white hover:bg-newGreen-100 rounded-xl py-3 text-newGreen-100 bg-white px-16">Reporte Abonos</a> 
          <a onClick={()=> Inertia.get(route('reports.inventario'))} className="font-bold transition ease-in-out  hover:text-white hover:bg-newGreen-100 rounded-xl py-3 text-newGreen-100 bg-white px-16">Reporte Inventario</a> 
      </div>

      <div>
        {children}
      </div>
      {/* <h1 className="mb-8 text-3xl font-bold">Reporte Ventas diarias</h1>
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
                  {ventas.map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total += parseInt(detalle.total_producto) 
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
                      {total}
                    </td>
                  </tr>
                </tbody>
              </table>
      </div> */}
    </div>
  );
};

Index.layout = page => <Layout title="Reports" children={page} />;

export default Index;
