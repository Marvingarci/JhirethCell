import React , {useEffect}from 'react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';
import SelectInput from '@/Shared/SelectInput';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';

const status = [
  {
    id: 'stock',
    value: 'stock'
  },
  {
    id: 'vendido',
    value: 'vendido'
  },
  {
    id: 'pendiente',
    value: 'pendiente'
  },
  {
    id: 'mala',
    value: 'mala'
  },
  {
    id: 'observacion',
    value: 'observacion'
  },
]

const Index = () => {
  const { categorias, usuarios, producto } = usePage().props;

  const { data, setData, errors, post, processing } = useForm({
    codebar: '',
    status: producto?.status || '',
  });


  
  console.log(producto)

  useEffect(() => {
    if (producto != null) {
        data.codebar = producto.codebar;
        data.status = producto.status;
        console.log(data)
    }

 
  }, [producto]);
  
  return (
    <div>
      <h1 className="flex flex-row mb-8 text-3xl font-bold">Buscar producto por codigo</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
      </div>
      {
          producto != null &&
          <div className="bg-white rounded shadow text-center">
          <div className="grid grid-cols-2 gap-4 p-10 text-center justify-between">
              <p className="font-bold text-lg" >Nombre del producto</p>
              <div className="text-lg"> {producto.product.name}</div>
              <p className="font-bold text-lg" >Precio de venta</p>
              <div className="text-lg"> {producto.product.sell_price}</div>
              <p className="font-bold text-lg" >Color</p>
              <div className="text-lg"> {producto.product.color}</div>
              <p className="font-bold text-lg" >Fecha creacion</p>
              <div className="text-lg"> { producto.created_at.substring(0,10) }</div>
              <p className="font-bold text-lg " >Imei</p>
              <div className="text-lg"> { producto.imei}</div>
              <p className="font-bold text-lg " >Cambiar Estado</p>
              <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              name="organization_id"
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
          </div>
        </div>
      }
     
    </div>
  );
};

Index.layout = page => <Layout title="Organizations" children={page} />;

export default Index;
