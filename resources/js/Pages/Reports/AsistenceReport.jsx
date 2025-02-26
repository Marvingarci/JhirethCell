import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import { PDFExport } from '@progress/kendo-react-pdf';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage, InertiaLink } from '@inertiajs/inertia-react';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';
import moment from 'moment';
const AsistenceReport = () => {
  const { asistencia } = usePage().props;
  const {data, meta: {
    links
  }} = asistencia;
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
          fileName={`Asistencia Reporte`}
        >
      <h1 className="mb-8 text-3xl font-bold">Reporte De Asistencia</h1>
      <SearchFilter show_week={true}/>
      <div className="bg-white rounded shadow overflow-y-auto">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Vendedor</th>
                    <th className="px-6 pt-5 pb-4 text-center">Fecha</th>
                    <th className="px-6 pt-5 pb-4 text-center">Hora</th>
                    <th className="px-6 pt-5 pb-4 text-center">Horas Trabajadas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(({vendedor_name, user_id, created_at, created_at_day, created_at_day_diff}) => (
                      
                    <tr  className="hover:bg-gray-100 focus-within:bg-gray-100">
                      
                        <td className="border-t justify-center text-center items-center">
                            {vendedor_name}
                        </td> 
                        <td className="border-t justify-center text-center items-center">
                          {/* cast with moment to show only date in spanish*/}
                            {moment(created_at).format('L')}
                          
                        </td>
                        {/* <td className="border-t justify-center text-center items-center">
                            {moment(created_at).format('LT')}
                        </td> */}
                        <td className="border-t justify-center text-center items-center">
                            {moment(created_at_day.first).format('LT') + ' - ' + moment(created_at_day.last).format('LT')}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {created_at_day_diff}
                        </td>
                        </tr>
                       
                    )
                  )}
                </tbody>
              </table>
              <Pagination links={links}/>

      </div>
      </PDFExport>
    </div>
  );
};

AsistenceReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default AsistenceReport;
