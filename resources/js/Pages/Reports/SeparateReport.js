import React, { useState } from 'react';
import Layout from '@/Shared/Layout';
import Index from '@/Pages/Reports/Index';
import LoadingButton from '@/Shared/LoadingButton';
import { usePage } from '@inertiajs/inertia-react';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Inertia } from '@inertiajs/inertia';
import moment from 'moment';
import SelectInput from '@/Shared/SelectInput';
import TextInput from '@/Shared/TextInput';

const SeparateReport = () => {
  const { ventas_pantallas, ventas_celulares, ventas_accesorios, servicios, day, productos, auth, organizations } = usePage().props;
  const [total_ventas_diarias, setTotalVentas] = useState(0);
  const [fecha, setFecha] = useState(0);
  const [organization, setOrganization] = useState(1);
  const [readyToPrit, setReadyToPrint] = useState(true);

  var total_pantallas_c=0;
  var total_pantallas_c_u=0;
  var total_pantallas_e=0;
  var total_pantallas_e_u=0;
  var total_pantallas_p=0;
  var total_pantallas_p_u=0;
  var total_pantallas_t=0;
  var total_pantallas_t_u=0;
  var total_pantallas_pos=0;
  var total_pantallas_pos_u=0;


  var total_celulares_c=0;
  var total_celulares_c_u=0;
  var total_celulares_e=0;
  var total_celulares_e_u=0;
  var total_celulares_p=0;
  var total_celulares_p_u=0;
  var total_celulares_t=0;
  var total_celulares_t_u=0;
  var total_celulares_pos=0;
  var total_celulares_pos_u=0;

  var total_accesorios_c=0;
  var total_accesorios_c_u=0;
  var total_accesorios_e=0;
  var total_accesorios_e_u=0;
  var total_accesorios_p=0;
  var total_accesorios_p_u=0
  var total_accesorios_t=0;
  var total_accesorios_t_u=0
  var total_accesorios_pos=0;
  var total_accesorios_pos_u=0

  var total_servivios_c=0;
  var total_servivios_c_u=0;
  var total_servivios_e=0;
  var total_servivios_e_u=0;
  var total_servivios_p=0;
  var total_servivios_p_u=0
  var total_servivios_pos=0;
  var total_servivios_pos_u=0
  var total_servivios_t=0;
  var total_servivios_t_u=0

  
  console.log(ventas_celulares)
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
    Inertia.post(route('reports.divididosPorDia'), {day: fecha, organization : organization} ,{
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
      <div  className='flex'>
        <TextInput type="date"  label="Fecha" className="border-2 mx-2 rounded-lg w-2/5" onChange={e => setFecha(e.target.value)}  placeholder="Seleciones fecha" />
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
        <button onClick={e =>buscarPorFecha()} class=" w-1/5 px-4 py-2 mx-2 border-2 text-white rounded-lg bg-newGreen-100" >Buscar</button>
      </div>
     
      
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
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {/* <th className="px-6 pt-5 pb-4 text-center">Vendedor</th> */}
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
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
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_e_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_e_u}</td>
                    }
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
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
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
                        {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_c_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_c}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas con Transferencia</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    }
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_pantallas.filter(v=> v.tipoPago == 'transferencia').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_pantallas_t += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t justify-center text-center items-center">
                        {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_t_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_t_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_t}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas con POS</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center" >Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    }
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas_pantallas.filter(v=> v.tipoPago == 'pos').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_pantallas_pos += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t justify-center text-center items-center">
                        {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>
                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_pos_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_pos_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_pos}</td>
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
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                        {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                        }
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
                          {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_pantallas_p_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_pantallas_p_u}</td>
                    }
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
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                      <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                    }   
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_celulares.filter(v => v.tipoPago == 'efectivo').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares_e += parseInt(detalle.total_producto) 
                        return (
                          <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td className="border-t justify-center text-center items-center">
                              {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                            </td>
                            <td className="border-t justify-center text-center items-center">
                              {detalle.producto}
                            </td>

                            <td className="border-t justify-center text-center items-center">
                              {detalle.product_code}
                            </td>

                            <td className="border-t justify-center text-center items-center">
                              {venta.cliente}
                            </td>

                            {auth.user.owner == true && (
                              <td className="border-t justify-center text-center items-center">
                                {productos
                                  .filter(p => p.id == detalle.product_id)
                                  .map(ps => {
                                    return ps.cost_price;
                                  })}
                              </td>
                            )}

                            <td className="border-t justify-center text-center items-center">
                              {detalle.total_producto}
                            </td>

                            {
                      auth.user.owner == true && 
                      <td className="border-t justify-center text-center items-center">
                      {productos
                        .filter(p => p.id == detalle.product_id)
                        .map(ps => {
                          total_celulares_e_u +=
                            detalle.total_producto - ps.cost_price;
                          return detalle.total_producto - ps.cost_price;
                        })}
                    </td>
                    }  

                            

                            {/* <td className="border-t justify-center text-center items-center">
                            {detalle.cantidad}
                        </td> */}
                            <td className="border-t justify-center text-center items-center">
                              {detalle.total_producto}
                            </td>
                          </tr>
                        );

                      })
                       
                    )
                  )}
                  <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    <td className="border-t justify-center text-center items-center"></td>
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_e_u}</td>
                    }
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
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
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
                          {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id != 4  )&& 
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_c_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_c}</td>
                  </tr>
                </tbody>
              </table>
      </div>

      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas por Transferencia</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_celulares.filter(v => v.tipoPago == 'transferencia').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares_t += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                          {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id != 4  )&& 
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_t_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_t_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_t}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas POS</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_celulares.filter(v => v.tipoPago == 'pos').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_celulares_pos += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                          {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
                        </td>
                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id != 4  )&& 
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_pos_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_pos_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_pos}</td>
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
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
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
                           {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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

                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_celulares_p_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }
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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_celulares_p_u}</td>
                    }
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

       <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Efectivas</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
                }
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_accesorios.filter(v => v.tipoPago == 'efectivo').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios_e += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_accesorios_e_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_e_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_e}</td>
                  </tr>
                </tbody>
              </table>
      </div>

      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Credito</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_accesorios.filter(v => v.tipoPago == 'credito').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios_c += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_accesorios_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_c_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_c}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas por Transferencia</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_accesorios.filter(v => v.tipoPago == 'transferencia').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios_t += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_accesorios_t_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_t_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_t}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas POS</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_accesorios.filter(v => v.tipoPago == 'pos').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios_pos += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_accesorios_pos_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_pos_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_pos}</td>
                  </tr>
                </tbody>
              </table>
      </div>



      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Pendiente</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Producto</th>
                    <th className="px-6 pt-5 pb-4 text-center">Codigo</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    {/* <th className="px-auto pt-5 pb-4 text-center">Cantidad</th> */}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {ventas_accesorios.filter(v => v.tipoPago == 'pendiente').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_accesorios_p += parseInt(detalle.total_producto) 
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.product_code}
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
                        {
                      auth.user.owner == true && 
                        <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_accesorios_p_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td>
                      }

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_p_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_accesorios_p}</td>
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
        <div className="font-bold text-newGreen-100 text-2xl m-2">Reporte de Servicios</div>
        <div className="font-bold m-2">Jhireth Cell</div>
        <div className="font-bold m-2">Dia: {day ? moment(day).locale("es").format("Do MM YYYY") : ahora }</div>
       </div>
       {/*  */}
       <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Efectivas</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Servicio</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {servicios.filter(v => v.tipoPago == 'efectivo').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_servivios_e += parseInt(detalle.total_producto) 
                        total_servivios_e_u += (detalle.total_producto - detalle.costo_servicio)
                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&& 
                            <td className="border-t justify-center text-center items-center">
                             {detalle.costo_servicio}
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                      {
                          (auth.user.owner == true && detalle.category_id == 4  )&&
                          <>
                            <td className="border-t justify-center text-center items-center">

                             { detalle.total_producto - detalle.costo_servicio}
                            </td>                    
                            </>
                        }
                        {/* <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_servivios_e_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td> */}

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_e_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_e}</td>
                  </tr>
                </tbody>
              </table>
      </div>

      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Credito</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Servicio</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {servicios.filter(v => v.tipoPago == 'credito').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_servivios_c += parseInt(detalle.total_producto) 
                        total_servivios_c_u += (parseInt(detalle.total_producto) - parseInt(detalle.costo_servicio))

                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&& 
                            <td className="border-t justify-center text-center items-center">
                             {detalle.costo_servicio}
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&&
                           
                            <td className="border-t justify-center text-center items-center">

                             { detalle.total_producto - detalle.costo_servicio}
                            </td>                    
                        }
                        {/* <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_servivios_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td> */}

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_c_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_c}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas con Transferencia</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Servicio</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {servicios.filter(v => v.tipoPago == 'transferencia').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_servivios_t += parseInt(detalle.total_producto) 
                        total_servivios_t_u += (parseInt(detalle.total_producto) - parseInt(detalle.costo_servicio))

                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&& 
                            <td className="border-t justify-center text-center items-center">
                             {detalle.costo_servicio}
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&&
                           
                            <td className="border-t justify-center text-center items-center">

                             { detalle.total_producto - detalle.costo_servicio}
                            </td>                    
                        }
                        {/* <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_servivios_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td> */}

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_t_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_t}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas POS</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Servicio</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {servicios.filter(v => v.tipoPago == 'pos').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_servivios_pos += parseInt(detalle.total_producto) 
                        total_servivios_pos_u += (parseInt(detalle.total_producto) - parseInt(detalle.costo_servicio))

                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&& 
                            <td className="border-t justify-center text-center items-center">
                             {detalle.costo_servicio}
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&&
                           
                            <td className="border-t justify-center text-center items-center">

                             { detalle.total_producto - detalle.costo_servicio}
                            </td>                    
                        }
                        {/* <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_servivios_c_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td> */}

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}
                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true && 
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_pos_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_pos}</td>
                  </tr>
                </tbody>
              </table>
      </div>


      <div className="flex justify-between border-t">
        <div className="font-bold m-2">Ventas Pendiente</div>
       </div>
      <div className="bg-white rounded shadow">
      <table className=" whitespace-nowrap w-full">
      <thead>
      <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4 text-center">Fecha creacion</th>
                    <th className="px-6 pt-5 pb-4 text-center">Servicio</th>
                    <th className="px-6 pt-5 pb-4 text-center">Cliente</th>
                    {
                      auth.user.owner == true && 
                        <th className="px-6 pt-5 pb-4 text-center" >Costo</th>
                    }                    
                    <th className="px-6 pt-5 pb-4 text-center" >Precio Venta</th>
                    {
                      auth.user.owner == true && 
                    <th className="px-6 pt-5 pb-4 text-center" >Utilidad</th>
}
                    <th className="px-6 pt-5 pb-4 text-center">Total Producto</th>
                  </tr>
                </thead>
                <tbody>
                {servicios.filter(v => v.tipoPago == 'pendiente').map((venta) => (
                      
                      venta.venta_detalles.map((detalle)=>{
                        total_servivios_p += parseInt(detalle.total_producto) 
                        total_servivios_p_u += (parseInt(detalle.total_producto) - parseInt(detalle.costo_servicio))

                        return(
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">

                        <td className="border-t justify-center text-center items-center">
                            {moment(detalle.created_at).locale("es").format("Do MM YYYY")}
                        </td>

                        <td className="border-t justify-center text-center items-center">
                            {detalle.producto}
                        </td>

                        
                        <td className="border-t justify-center text-center items-center">
                            {venta.cliente}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&& 
                            <td className="border-t justify-center text-center items-center">
                             {detalle.costo_servicio}
                            </td>                    
                        }

                        <td className="border-t justify-center text-center items-center">
                            {detalle.total_producto}
                        </td>

                        {
                          (auth.user.owner == true && detalle.category_id == 4  )&&
                           
                            <td className="border-t justify-center text-center items-center">

                             { detalle.total_producto - detalle.costo_servicio}
                            </td>                    
                        }

                        {/* <td className="border-t justify-center text-center items-center">
                            { 
                            productos.filter(p => p.id == detalle.product_id).map(ps =>{
                              total_servivios_p_u += (detalle.total_producto - ps.cost_price)
                              return detalle.total_producto - ps.cost_price
                            })  
                            }
                        </td> */}

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
                    {auth.user.owner == true &&  <td className="border-t justify-center text-center items-center"></td>}

                    <td className="border-t justify-center text-center items-center"></td>
                    <td  className="border-t justify-center text-center items-center font-bold">Total</td>
                    {auth.user.owner == true &&
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_p_u}</td>
                    }
                    <td  className="border-t justify-center text-center items-center font-bold">{total_servivios_p}</td>
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
