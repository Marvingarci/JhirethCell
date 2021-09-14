import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage } from '@inertiajs/inertia-react';
import { PDFExport } from '@progress/kendo-react-pdf';

const SeparateReport = () => {
  const { ventas_pantallas, ventas_celulares, ventas_accesorios } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);
  const [readyToPrit, setReadyToPrint] = useState(true);
  var total_pantallas=0;
  var total_celulares=0;
  var total_accesorios=0;


  const date = new Date();
  const ahora =
    date.getDate() +
    '-' +
    (date.getMonth() + 1 > 9
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)) +
    '-' +
    date.getFullYear();

    const pdfExportComponentP = React.useRef(null);
    const pdfExportComponentC = React.useRef(null);
    const pdfExportComponentA = React.useRef(null);

 
  const printPantallas=()=>{
    setReadyToPrint(true)
    setTimeout(()=>{
      if (pdfExportComponentP.current) {
        pdfExportComponentP.current.save();
      }
    },3000) 
  }

  const printCellphone=()=>{
    setReadyToPrint(true)
    setTimeout(()=>{
      if (pdfExportComponentC.current) {
        pdfExportComponentC.current.save();
      }
    },3000) 
  }

  const printAccesories=()=>{
    setReadyToPrint(true)
    setTimeout(()=>{
      if (pdfExportComponentA.current) {
        pdfExportComponentA.current.save();
      }
    },3000) 
  }

  return (
    <div>

      <h1 className="mb-8 text-3xl font-bold">Reporte Ventas por Categoria</h1>
      <div className="flex justify-between gap-4">
      <LoadingButton onClick={e => printPantallas()} className="btn-indigo">Imprimir Reporte de Pantallas</LoadingButton>
      <LoadingButton onClick={e => printCellphone()} className="btn-indigo">Imprimir Reporte de Celulares</LoadingButton>
      <LoadingButton onClick={e => printAccesories()} className="btn-indigo">Imprimir Reporte de Accesorios</LoadingButton>
      </div>
      {
        readyToPrit &&
        <div
        style={{
          // position: 'absolute',
          // left: '-10000px',
          // top: 0
        }}
      >
        <PDFExport
          keepTogether="p"
          scale={0.45}
          paperSize="letter"
          margin="0.5cm"
          ref={pdfExportComponentP}
          fileName={`Venta de Pantallas-${ahora}`}
        >
       <div className="flex justify-between border-t">
        <div className="font-bold m-2">Reporte de Venta de Pantallas</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {ahora}</div>
       </div>
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
      </PDFExport>
      </div>
      }
      <hr/>
      {
        readyToPrit &&
        <div
        style={{
          // position: 'absolute',
          // left: '-10000px',
          // top: 0
        }}
      >
        <PDFExport
          keepTogether="p"
          scale={0.45}
          paperSize="letter"
          margin="0.5cm"
          ref={pdfExportComponentC}
          fileName={`Venta de Celulares-${ahora}`}
        >
      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Reporte de Venta de Celulares</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {ahora}</div>
       </div>
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
      
      </PDFExport>
      </div>
      }

      {
        readyToPrit &&
        <div
        style={{
          // position: 'absolute',
          // left: '-10000px',
          // top: 0
        }}
      >
        <PDFExport
          keepTogether="p"
          scale={0.45}
          paperSize="letter"
          margin="0.5cm"
          ref={pdfExportComponentA}
          fileName={`Venta de Accesorios-${ahora}`}
        >
      

        <div className="flex justify-between border-t">
        <div className="font-bold m-2">Reporte de Venta de Accesorios</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {ahora}</div>
       </div>
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
      </PDFExport>
      </div>
      }
    </div>
  );
};

SeparateReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default SeparateReport;
