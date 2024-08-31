import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import { PDFExport } from '@progress/kendo-react-pdf';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage, InertiaLink } from '@inertiajs/inertia-react';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const CreditReport = () => {
  const { ventas } = usePage().props;
  const {data, meta: {
    links
  }} = ventas;
  var total=0;

  const [readyToPrit, setReadyToPrint] = useState(true);
  const pdfExportComponentA = React.useRef(null);
  const printReport=()=>{
    setReadyToPrint(true)
      if (pdfExportComponentA.current) {
        pdfExportComponentA.current.save();
      }
  }

  console.log(data);
  return (
    <div>

<LoadingButton onClick={e => printReport()} className="btn-indigo">Imprimir Reporte</LoadingButton>
      <PDFExport
          keepTogether="p"
          scale={0.45}
          paperSize="letter"
          margin="2.5cm"
          ref={pdfExportComponentA} 
          fileName={`Ventas Diarias a credito`}
        >
      <h1 className="mb-8 text-3xl font-bold">Reporte Ventas al Crédito</h1>
      <SearchFilter show_date={true} show_orga={true} />
      <div className="bg-white rounded shadow overflow-y-auto">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Factura</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    <th className="px-6 pt-5 pb-4 text-center">Productos</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Tipo Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                    <th className="px-auto pt-5 pb-4 text-center">Restante de pago</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((venta) => (
                      
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                         <td className="border-t justify-center text-center items-center">
                    <InertiaLink
                      href={route('ventas.edit', venta.id)}
                      className="flex items-center px-6 py-4 text-indigo-700 focus:outline-none"
                      >
                      Ver factura {venta.id}
                    </InertiaLink>
                  </td>
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td> 
                              <td className="border-t justify-center text-center items-center flex flex-col">
                          {
                            venta.venta_detalles.map((detalle) => {
                              total += parseInt(detalle.total_producto)
                              return (
                                  <span>{detalle.fullName}</span>
                                )
                              })
                            }
                          </td>
                          <td className="border-t justify-center text-center items-center">
                            {venta.tipoPago}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {venta.total}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {venta.restante}
                        </td>
                        </tr>
                       
                    )
                  )}
                  {/* <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">
                      {total}
                    </td>
                  </tr> */}
                </tbody>
              </table>
              <Pagination links={links}/>

      </div>
      </PDFExport>
    </div>
  );
};

CreditReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default CreditReport;
