import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import { PDFExport } from '@progress/kendo-react-pdf';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage, InertiaLink } from '@inertiajs/inertia-react';

const PaymentsReport = () => {
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

  console.log(payments);
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
        fileName={`Reporte pagos Parciales`}
      >
        <h1 className="mb-8 text-3xl font-bold">Reporte de Pagos Parciales</h1>
        <div className="bg-white rounded shadow">
          <table className=" whitespace-nowrap w-full">
            <thead>
              <tr className="font-bold text-left">
                <th className="px-6 pt-5 pb-4 text-center">Factura No.</th>
                <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                <th className="px-auto pt-5 pb-4 text-center">Recibio</th>
                <th className="px-6 pt-5 pb-4 text-center">Abono</th>
                <th className="px-6 pt-5 pb-4 text-center">
                  Restante en factura
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => 
                
                // venta.venta_detalles.map((detalle)=>{
                 
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                  <td className="border-t justify-center text-center items-center">
                    <InertiaLink
                      href={route('ventas.edit', payment.venta.id)}
                      className="flex items-center px-6 py-4 text-indigo-700 focus:outline-none"
                    >
                      Ver factura {payment.venta.id}
                    </InertiaLink>
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {payment.venta.cliente}
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {payment.user.first_name + ' ' + payment.user.last_name}
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {payment.cantidad}
                  </td>
                  <td className="border-t justify-center text-center items-center">
                    {payment.venta.restante}
                  </td>
                </tr>
                 

                // })
              )}
              <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t justify-center text-center items-center"></td>
                <td className="border-t justify-center text-center items-center"></td>
                <td className="border-t justify-center text-center items-center font-bold">
                  Total
                </td>
                <td className="border-t justify-center text-center items-center font-bold">
                  {total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PDFExport>
    </div>
  );
};

PaymentsReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default PaymentsReport;
