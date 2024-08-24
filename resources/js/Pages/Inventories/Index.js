import React , {useEffect}from 'react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';
import SelectInput from '@/Shared/SelectInput';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import LoadingButton from '@/Shared/LoadingButton';
import { showOnlyCapitalLetter } from '../../utils';


const Index = () => {
  const { producto, inventario } = usePage().props;
  
  const { data, setData, errors, put, processing } = useForm({
    id: inventario?.id ||'',
    codebar: inventario?.codebar || '',
  });



  

  useEffect(() => {
    if (producto.length > 0) {
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
    data.codebar = inventario?.codebar;
    data.id = inventario?.id;
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
  
  console.log(producto[0])
  console.log(inventario)
  return (
    <div>
      <h1 className="flex flex-row mb-8 text-3xl font-bold">Buscar producto por codigo</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
      </div>
      {
          producto.length > 0 &&
          <div className="bg-white rounded shadow text-center">
          <div className="grid grid-cols-2 gap-4 p-10 text-center justify-between">
              <p className="font-bold text-lg" >Nombre del producto</p>
              <div className="text-lg"> {producto[0].name}</div>
              <p className="font-bold text-lg" >Precio de venta</p>
              <div className="text-lg"> {producto[0].sell_price}</div>
              <p className="font-bold text-lg" >Precio de Mayorista</p>
              <div className="text-lg"> {producto[0].whole_sell_price}</div>
              <p className="font-bold text-lg" >Color</p>
              <div className="text-lg"> {producto[0].color}</div>
              <p className="font-bold text-lg" >Fecha creacion</p>
              <div className="text-lg"> { producto[0].created_at.substring(0,10) }</div>
              <p className="font-bold text-lg " >Imei</p>
              <div className="text-lg"> { inventario?.imei}</div>
              { producto[0].dbType == 'colectivo' && ( 
                <>
                <p className="font-bold text-lg " >Existencia</p>
                <div className="text-lg"> 
                
                { producto[0].realExistencia}
                
                {
                        producto[0].existenciaDividida.map((el) => {
                          return (
                            <div key={el.organization_id}>
                              {showOnlyCapitalLetter(el.company_name)} : {el.cantidad}
                            </div>
                          )
                        })
                }
                </div>
                </>
                )
              }
              <p className="font-bold text-lg " >Actual estado</p>
              <div className="text-lg"> { inventario?.status}</div>
              {
                producto[0].dbType == 'individual' &&
                 <p className="font-bold text-lg " >Cambiar Estado</p>
              }
               {
                producto[0].dbType == 'individual' &&
              <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              value={inventario?.status}
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
                producto[0].dbType == 'individual' &&
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

Index.layout = page => <Layout title="Buscar Producto" children={page} />;

export default Index;
