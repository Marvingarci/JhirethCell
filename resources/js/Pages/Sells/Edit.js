import React, { useEffect, useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import SearchFilter from '@/Shared/SearchFilterForCode';
import { PDFExport } from '@progress/kendo-react-pdf';
import WarrantyToPrint from './WarrantyToPrint';
import moment from 'moment';

const Edit = () => {
  const { categorias, usuarios, producto, venta, vendedores } = usePage().props;
  const { data, setData, errors, post, processing, reset } = useForm({
    vendedor_id: '',
    ventas_id: venta[0].id,
    cantidad: '',
    cliente: venta[0].cliente,
    total: venta[0].total,
    restante: venta[0].restante,
    tipoPago: venta[0].tipoPago
  });

  const pdfExportComponent = React.useRef(null);

  console.log(venta);
  const [carrito, setCarrito] = useState(venta[0].venta_detalles);
  const [WarrantyProduct, setWarrantyProduct] = useState(null);
  const [readyToPrit, setReadyToPrint] = useState(false);

  const date = new Date();
  const ahora =
    date.getDate() +
    '-' +
    (date.getMonth() + 1 > 9
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)) +
    '-' +
    date.getFullYear();
  
  

  function becomeSold() {
    if (confirm('Esta venta se pondrá como efectiva, ¿Está seguro?')) {
      console.log(venta[0].id, venta[0].venta_detalles)
      Inertia.put(
        route('ventas.actualizar', {
          id: venta[0].id,
          venta_detalles: venta[0].venta_detalles
        }),
        { id: venta[0].id, venta_detalles: venta[0].venta_detalles },
        {
          onSuccess: page => {},
          onError: error => {
            console.log(error);
          }
        }
      );
    }
  }

  // const myref = useRef();
  // const reset = () => {
  //   myref.current.reset();
  // };


  const printWarranty=(product)=>{
    setWarrantyProduct(product);
    setReadyToPrint(true)
    setTimeout(()=>{
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
      }
    },3000) 
  }

  const addPayment =()=>{
    if(data.cantidad > venta[0].restante){
      alert('Esta cantidad es mayor a la restante, cambiarla')
      return false;
    }
    if (confirm('Se realizara el siguiente pago, ¿Está seguro?')) {

    const values = {
      cantidad: data.cantidad,
      vendedor_id : data.vendedor_id,
      ventas_id : data.ventas_id
    }

      console.log(values)
      Inertia.post(
        route('pagos', values),
         values ,
        {
          onSuccess: page => {
            console.log(page)
            reset('cantidad','vendedor_id','restante')
          },
          onError: error => {
            console.log(error);
          }
        }
      );
    }
  }

  const deleteSell = () => {
    if (confirm('¿Está seguro de desea proceder con la accion esta venta?')) {
      Inertia.put(
        route('ventas.destroy', {
          id: data.ventas_id,
          venta_detalles: venta[0].venta_detalles,
          razonDev: 'eliminacion'
        }),
        {  id: data.ventas_id,
          venta_detalles: venta[0].venta_detalles,
          razonDev: 'eliminacion' },
        {
          onSuccess: page => {
          },
          onError: error => {

          }
        }
      );
    }
  };


  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('ventas')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Ventas
        </InertiaLink>
        <span className="font-medium text-indigo-600"> /</span> Detalle Venta
      </h1>
      <div className=" overflow-hidden bg-white rounded shadow">
        <div className="flex items-center justify-center py-5">
          <p className="text-2xl text-gray-500 text-center font-bold">
            Detalle de Venta
          </p>
        </div>
        <div className="flex flex-wrap p-8 -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/4"
            label="Cliente"
            name="first_name"
            disabled
            value={data.cliente}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/4"
            label="Vendedor"
            name="first_name"
            disabled
            value={vendedores
              .filter(u => venta[0].vendedor_id == u.id)
              .map(filter => filter.first_name + ' ' + filter.last_name)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/4"
            label="Fecha"
            name="first_name"
            disabled
            value={ahora}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/4"
            label="Tipo de Pago"
            name="first_name"
            disabled
            value={data.tipoPago}
          />

          {/* Comienzo tabla */}
          <div className="overflow-x-auto   bg-white rounded shadow">
            <table className=" whitespace-nowrap">
              <thead>
                <tr className="font-bold text-left">
                  <th className="px-6 pt-5 pb-4">Producto</th>
                  <th className="px-3 pt-5 pb-4">Cantidad</th>
                  <th className="px-6 pt-5 pb-4">Precio</th>
                  <th className="px-6 pt-5 pb-4">Descuento</th>
                  <th className="px-6 pt-5 pb-4 " colSpan="2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {carrito.map(
                  (
                    p,
                    index
                  ) => (
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                      <td className="border-t px-6 pt-5 pb-4">{p.producto}</td>
                      <td className="border-t px-6 pt-5 pb-4">{p.cantidad}</td>
                      <td className="border-t px-6 pt-5 pb-4">{p.precio}</td>
                      <td className="border-t px-6 pt-5 pb-4">{p.descuento}</td>
                      <td className="border-t px-6 pt-5 pb-4">
                        {p.total_producto}
                      </td>
                      <td>
                      <LoadingButton onClick={e => printWarranty(p)} className="btn-indigo">
              Garantia
            </LoadingButton>
                      </td>
                    </tr>
                  )
                )}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                  <td className="px-6 py-4 border-t" colSpan="3"></td>
                  <td className="px-6 py-4 border-t font-bold">Total</td>
                  <td className="px-6 py-4 border-t font-bold">{data.total}</td>
                </tr>
                {carrito.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 border-t" colSpan="4">
                      No hay productos aun
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* fin tabla */}
        </div>
        <div className="flex items-center justify-end px-8 py-4 space-x-1 bg-gray-100 border-t border-gray-200">
          {data.tipoPago == 'credito' && (
            <LoadingButton onClick={e => becomeSold()} className="btn-indigo">
              Pagado
            </LoadingButton>
          )}

          <LoadingButton
            loading={processing}
            onClick={e => deleteSell()}
            className="btn-indigo"
          >
            Eliminar Venta
          </LoadingButton>

          <LoadingButton
            loading={processing}
            onClick={e => Inertia.get(route('ventas'))}
            className="btn-indigo"
          >
            Atras
          </LoadingButton>
        </div>
      </div>
      {
        data.tipoPago == 'credito' &&
        <div className="overflow-x-auto   bg-white rounded shadow">
        <h1 className="text-xl font-bold py-2">Pagos  restante: {data.restante}</h1>
  
          <div className="flex flex-row gap-4 items-center justify-between">
          <TextInput
                  className="w-full p-4 pr-6 lg:w-1/3"
                  label="Efectuar pago parcial"
                  name="first_name"
                  errors={errors.cantidad}
                  value={data.cantidad}
                  onChange={e => setData('cantidad', e.target.value)}
                />
         <SelectInput
                className="w-full p-4 pr-6 lg:w-1/3"
                label="Vendedor"
                name="organization_id"
                errors={errors.vendedor_id}
                value={data.vendedor_id}
                onChange={e => setData('vendedor_id', e.target.value)}
              >
                <option value=""></option>
                {vendedores.map(({ id, first_name, last_name }) => (
                  <option value={id}>{first_name + ' ' + last_name}</option>
                ))}
              </SelectInput>
              <LoadingButton onClick={e => addPayment()} className="btn-indigo">
                Agregar pago
              </LoadingButton>
          </div>
  
  
              <table className=" whitespace-nowrap">
                <thead>
                  <tr className="font-bold text-left">
                    <th className="px-3 pt-5 pb-4">Cantidad</th>
                    <th className="px-6 pt-5 pb-4">fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {venta[0].pagos.map(
                    (
                      p,
                      index
                    ) => (
                      <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t px-6 pt-5 pb-4">{moment(p.created_at).locale("es").format("Do MMM YYYY")}</td>
                        <td className="border-t px-6 pt-5 pb-4">{p.cantidad}</td>
                      </tr>
                    )
                  )}
                 
                  {carrito.length === 0 && (
                    <tr>
                      <td className="px-6 py-4 border-t" colSpan="4">
                        No hay productos aun
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
      }

      {/* Pagos */}

     

      {/* Garantia Impresion */}
      {
        readyToPrit &&
        <div
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 0
        }}
      >
        <PDFExport
          keepTogether="p"
          scale={0.45}
          paperSize="letter"
          margin="0.5cm"
          ref={pdfExportComponent}
          fileName={`tickets-${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()} ${new Date().getHours()}hr ${new Date().getMinutes()}min`}
        >
          <WarrantyToPrint product={WarrantyProduct} cliente={data.cliente}/>
        </PDFExport>
      </div>
      }
      
    </div>
  );
};

Edit.layout = page => <Layout title="Create Contact" children={page} />;

export default Edit;
