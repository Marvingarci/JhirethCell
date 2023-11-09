import React , {useEffect}from 'react';
import Layout from '@/Shared/Layout';
import SearchFilter from '@/Shared/SearchFilter';
import SelectInput from '@/Shared/SelectInput';
import { usePage, useForm } from '@inertiajs/inertia-react';
import LoadingButton from '@/Shared/LoadingButton';
import * as moment from 'moment';

const Index = () => {
  const { categorias, usuarios, producto } = usePage().props;

  const { data, setData, errors, put, processing } = useForm({
    id: producto?.id ||'',
    codebar: producto?.codebar || '',
  });


  

  useEffect(() => {
    console.log(producto)
    if (producto != null) {
       cargardata()
    }else{
        data.codebar = '';
        data.id ='';
    }
    if(data.status = ''){
      cargarStatus()
    }


 
  }, [producto]);

  const cargardata =()=>{
    data.codebar = producto?.codebar;
    data.id = producto?.id;
    console.log(data)
  }

  const cargarStatus=()=>{
  }

  const updateStatus=()=>{
    if (confirm('Se realizara el siguiente pago, ¿Está seguro?')) {
     
        put(
          route('inventario.update', data.id),
          {
            onSuccess: page => {
              console.log(page)
            },
            onError: error => {
              console.log(error);
            }
          }
        );
      }
  }
  
  return (
    <div>
      <h1 className="flex flex-row mb-8 text-3xl font-bold">Buscar producto por codigo</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
      </div>
      {
          producto != null  &&
          <div className="bg-white rounded shadow text-center">
          <div className="grid grid-cols-2 gap-4 p-10 text-center justify-between">
              <p className="font-bold text-lg" >Nombre del producto</p>
              <div className="text-lg"> {producto.product.name}</div>
              <p className="font-bold text-lg" >Precio de venta</p>
              <div className="text-lg"> {producto.product.sell_price}</div>
              <p className="font-bold text-lg" >Precio de Mayorista</p>
              <div className="text-lg"> {producto.product.whole_sell_price}</div>
              <p className="font-bold text-lg" >Color</p>
              <div className="text-lg"> {producto.product.color}</div>
              <p className="font-bold text-lg" >Fecha creacion</p>
              <div className="text-lg"> { producto.created_at.substring(0,10) }</div>
              <p className="font-bold text-lg " >Imei</p>
              <div className="text-lg"> { producto.imei}</div>
              { producto.product.dbType == 'colectivo' && ( 
                <>
                <p className="font-bold text-lg " >Existencia</p>
                <div className="text-lg"> { producto.existencia}</div>
                </>
                )
              }
              <p className="font-bold text-lg " >Actual estado</p>
              <div className="text-lg"> { producto.status}</div>
              {
                (producto.status == 'vendido' || producto.status == 'pendiente' )&&
                <>
                  <p className="font-bold text-lg " >Fecha de venta</p>
                  <div className="text-lg"> {moment(producto.saleDate).locale("es").calendar()}</div>
                </>
              }
              {
                producto.product.dbType == 'individual' &&
                 <p className="font-bold text-lg " >Cambiar Estado</p>
              }
               {
                producto.product.dbType == 'individual' &&
              <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              value={data.status}
              onChange={e => setData('status', e.target.value)}
            >
              <option value=""></option>
              <option value="pendiente">Pendiente</option>
              <option value="stock">Stock</option>
              <option value="vendido">Vendido</option>
              <option value="observacion">Observacion</option>
              <option value="mala">Mala</option>
            </SelectInput>
              }
               {
                producto.product.dbType == 'individual' &&
            <LoadingButton onClick={e => updateStatus()} className="btn-indigo">
                Actualizar estado
              </LoadingButton>
              }
          </div>
        </div>
      }
     
    </div>
  );
};

Index.layout = page => <Layout title="Organizations" children={page} />;

export default Index;
