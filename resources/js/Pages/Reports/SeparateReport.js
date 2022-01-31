import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage } from '@inertiajs/inertia-react';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Inertia } from '@inertiajs/inertia';
import moment from 'moment';

const SeparateReport = () => {
  const { ventas_pantallas, ventas_celulares, ventas_accesorios, day, productos, auth } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);
  const [fecha, setFecha] = useState(0);
  const [readyToPrit, setReadyToPrint] = useState(true);

  var total_pantallas_c=0;
  var total_pantallas_c_u=0;
  var total_pantallas_e=0;
  var total_pantallas_e_u=0;
  var total_pantallas_p=0;
  var total_pantallas_p_u=0;


  var total_celulares_c=0;
  var total_celulares_c_u=0;
  var total_celulares_e=0;
  var total_celulares_e_u=0;
  var total_celulares_p=0;
  var total_celulares_p_u=0;

  var total_accesorios_c=0;
  var total_accesorios_c_u=0;
  var total_accesorios_e=0;
  var total_accesorios_e_u=0;
  var total_accesorios_p=0;
  var total_accesorios_p_u=0

  console.log(productos)
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
      if (pdfExportComponentP.current) {
        pdfExportComponentP.current.save();
      }
  }

  const printCellphone=()=>{
    setReadyToPrint(true)
      if (pdfExportComponentC.current) {
        pdfExportComponentC.current.save();
      }
  }

  const printAccesories=()=>{
    setReadyToPrint(true)
      if (pdfExportComponentA.current) {
        pdfExportComponentA.current.save();
      }
  }

  const buscarPorFecha =()=>{
    Inertia.post(route('reports.divididosPorDia'), {day: fecha} ,{
        onSuccess: page => {
          console.log(page)
        },
        onError: error => {
          console.log(error);
        }
      }
    );
  }

  return (
    <div>

      <h1 className="mb-8 text-3xl font-bold">Reporte Ventas por Categoria</h1>
      <input type="date" className="border-2 mx-2 rounded-lg" onChange={e => setFecha(e.target.value)}  placeholder="Seleciones fecha" />
      <button onClick={e =>buscarPorFecha()} class="px-4 py-2 mx-2 border-2 text-white rounded-lg bg-newGreen-100" >Buscar</button>
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
          fileName={`Venta de Pantallas-${day ? moment(day).locale("es").format("Do MM YYYY") : ahora}`}
        >
       <div className="flex justify-between border-t">
        <div className="font-bold text-2xl text-newGreen-100 m-2">Reporte de Venta de Pantallas</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {day ? moment(day).locale("es").format("Do MM YYYY") : ahora }</div>
       </div>

       <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Efectivas</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {/* <th className="px-6 pt-5 pb-4 text-center">Vendedor</th> */}
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_pantallas.filter(v=> v.tipoPago == 'efectivo').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_pantallas_e += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }
                        

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_e_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_e_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_e}</td>
                  </tr>
                </tbody>
              </table>
      </div>

      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas a Credito</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_pantallas.filter(v=> v.tipoPago == 'credito').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_pantallas_c += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_c_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_c}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Pendientes</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_pantallas.filter(v=> v.tipoPago == 'pendiente').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_pantallas_p += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_p_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_p_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_p}</td>
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
          fileName={`Venta de Celulares-${day ? moment(day).locale("es").format("Do MM YYYY") : ahora}`}
        >
      <div className="flex justify-between border-t">
        <div className="font-bold text-newGreen-100 text-2xl m-2">Reporte de Venta de Celulares</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {day ? moment(day).locale("es").format("Do MM YYYY") : ahora }</div>
       </div>
        {/* Venta Celulares efectiva */}
       <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Efectivas</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_celulares.filter(v => v.tipoPago == 'efectivo').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares_e += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_e_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_e_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_e}</td>
                  </tr>
                </tbody>
              </table>
      </div>
      {/*  */}

      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas a Credito</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_celulares.filter(v => v.tipoPago == 'credito').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares_c += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_c_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_c}</td>
                  </tr>
                </tbody>
              </table>
      </div>

      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Pendientes</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_celulares.filter(v => v.tipoPago == 'pendiente').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares_p += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>


                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>


                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_p_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_p_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_p}</td>
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
          fileName={`Venta de Accesorios-${day ? moment(day).locale("es").format("Do MM YYYY") : ahora}`}
        >
      

        <div className="flex justify-between border-t">
        <div className="font-bold text-newGreen-100 text-2xl m-2">Reporte de Venta de Accesorios</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {day ? moment(day).locale("es").format("Do MM YYYY") : ahora }</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_accesorios.map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios_c += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          auth.user.owner == true && 
                            <td className="border-t justify-center text-center items-center">
                              { 
                              productos.filter(p => p.id == detalle.product_id).map(ps =>{
                                return ps.cost_price
                              })  
                              }
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_accesorios_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>

                        {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
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
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_c_u}</td>
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_c}</td>
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
