import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import { PDFExport } from '@progress/kendo-react-pdf';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage, InertiaLink } from '@inertiajs/inertia-react';

const InventarioReport = () => {
  const { payments, products, total } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);

  const [readyToPrit, setReadyToPrint] = useState(true);
  const pdfExportComponentA = React.useRef(null);
  const printReport=()=>{
    setReadyToPrint(true)
      if (pdfExportComponentA.current) {
        pdfExportComponentA.current.save();
      }
  }

  console.log(products);
  return (
    <div>
      <div className='flex gap-3'>
      <LoadingButton onClick={e => printReport()} className="btn-indigo">
        Imprimir Reporte
      </LoadingButton>
      
      </div>
      <PDFExport
        keepTogether="p"
        scale={0.45}
        paperSize="letter"
        margin="2.5cm"
        ref={pdfExportComponentA}
        fileName={`Reporte Inventario`}
      >
        <h1 className="mb-8 text-3xl font-bold">Reporte de Inventario</h1>
        <div className="bg-white rounded shadow">
          <table className=" whitespace-nowrap w-full">
            <thead>
              <tr className="font-bold text-left">
                <th className="px-6 pt-5 pb-4 text-center">#</th>
                <th className="px-6 pt-5 pb-4 text-center">Nombre</th>
                <th className="px-6 pt-5 pb-4 text-center">Tipo</th>
                <th className="px-auto pt-5 pb-4 text-center">Total</th>
                <th className="px-6 pt-5 pb-4 text-center">Dividido</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(a => a.realExistencia > 0).map(product => 
                
                // venta.venta_detalles.map((detalle)=>{
                 
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                  <td className="border-t justify-center text-center items-center">
                    <InertiaLink
                      href={route('products.edit', product.id)}
                      className="flex items-center px-6 py-4 text-indigo-700 focus:outline-none"
                    >
                      Ver Producto
                    </InertiaLink>
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {product.name}
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {product.dbType}
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {product.realExistencia}
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {'no yet'}
                  </td>
                </tr>
                 

                // })
              )}
            </tbody>
          </table>
        </div>
      </PDFExport>
    </div>
  );
};

InventarioReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default InventarioReport;
