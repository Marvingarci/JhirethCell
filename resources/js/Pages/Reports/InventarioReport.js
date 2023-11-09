import React, { useEffect, useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import { PDFExport } from '@progress/kendo-react-pdf';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage, InertiaLink } from '@inertiajs/inertia-react';
import SelectInput from '@/Shared/SelectInput';
import { Inertia } from '@inertiajs/inertia';
import moment from 'moment';

const InventarioReport = () => {
  const { payments, products, organizations } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);

  const [organization, setOrganization] = useState(1);
  const [actualProducts, setActualProducts] = useState([]);
  const [readyToPrit, setReadyToPrint] = useState(true);
  const [showTable, setShowTable] = useState(false);

  const pdfExportComponentA = React.useRef(null);
  const printReport=()=>{
    setReadyToPrint(true)
      if (pdfExportComponentA.current) {
        pdfExportComponentA.current.save();
      }
  }

  const buscarPorFecha =()=>{
    Inertia.post(route('reports.inventarioPorTienda'), {organization : organization} ,{
        onSuccess: page => {
          console.log(page)
        },
        onError: error => {
          console.log(error);
        }
      }
    );
  }

  useEffect(()=>{
    if(products!= null){
      setActualProducts(Object.values(products))
      console.log(actualProducts)
      setShowTable(true)
    }
  }, [products])

  useEffect(()=>{
    setShowTable(false)
  }, [organization])


  console.log(products, organization);
  return (
    <div>
      <div className='flex gap-3'>
      <SelectInput
                className="pr-6 w-2/5 "
                label="Tienda"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
              >
                <option value="">Seleccciona Tienda</option>
                {
                  organizations.map(orga=>{
                    return(<option value={orga.id}>{orga.name}</option>)
                  })
                }              
        </SelectInput>
        <button type='button' onClick={e =>buscarPorFecha()} class=" w-1/5 px-4 py-2 mx-2 border-2 text-white rounded-lg bg-newGreen-100" >Buscar</button>

      <LoadingButton onClick={e => printReport()} className="btn-indigo">
        Imprimir Reporte
      </LoadingButton>
      
      </div>
      {
        products != null &&
      <PDFExport
        keepTogether="p"
        scale={0.45}
        paperSize="letter"
        margin="2.5cm"
        ref={pdfExportComponentA}
        fileName={`Reporte Inventario`}
      >
        <h1 className="mb-8 text-3xl font-bold">Reporte de Inventario</h1>
        {
          showTable &&
        <div className="bg-white rounded shadow">
          <table className=" whitespace-nowrap w-full">
            <thead>
              <tr className="font-bold text-left">
                <th className="px-6 pt-5 pb-4 text-center">#</th>
                <th className="px-6 pt-5 pb-4 text-center">Nombre</th>
                <th className="px-6 pt-5 pb-4 text-center">Tipo</th>
                {/* <th className="px-auto pt-5 pb-4 text-center">Total</th> */}
                <th className="px-6 pt-5 pb-4 text-center">Existencia</th>
              </tr>
            </thead>
            <tbody>
              
              {
               actualProducts.map(product => 
                
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
                  {/* <td className="border-t justify-center text-center items-center">
                    {product.realExistencia}
                  </td> */}
                  <td className="border-t justify-center text-center items-center">
                    {(product.existenciaDividida != null && product.existenciaDividida != undefined) && 
                      <>
                      {
                        product.existenciaDividida.filter(e => e.organization_id == organization).map(e => 
                          <div className='pt-1'>{e.company_name+" : "+e.cantidad}</div>
                        )
                      }
                      </>
                    }
                  </td>
                </tr>
                 

                // })
              )}
            </tbody>
          </table>
        </div>
        }
      </PDFExport>
      }
    </div>
  );
};

InventarioReport.layout = page => <Layout >
    <Index children={page}></Index>
</Layout>;

export default InventarioReport;
