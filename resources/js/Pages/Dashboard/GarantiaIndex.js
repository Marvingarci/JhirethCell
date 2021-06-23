import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';

const Index = () => {
  const { categorias, usuarios, ventaRapida } = usePage().props;
  
  console.log(ventaRapida)
  return (
    <div>
      <h1 className="flex flex-row mb-8 text-3xl font-bold">Chequeo de Garantías</h1>
      <div className="flex items-center justify-between mb-6">
        <SearchFilter />
      </div>
      {
          ventaRapida != null &&
          <div className="bg-white rounded shadow text-center">
          <div className="grid grid-cols-2 gap-4 p-10 text-center justify-between">
              <p className="font-bold text-xl" >Nombre del producto</p>
              <div className="text-xl"> {ventaRapida.producto}</div>
              <p className="font-bold text-xl" >Precio de venta</p>
              <div className="text-xl"> {ventaRapida.precio}</div>
              <p className="font-bold text-xl" >Garantia</p>
              <div className="text-xl"> {ventaRapida.garantia}</div>
              <p className="font-bold text-xl" >Fecha compra</p>
              <div className="text-xl"> { ventaRapida.created_at.substring(0,10) }</div>
              <p className="font-bold text-xl text-red-400" >Vencimiento Garantía</p>
              <div className="text-xl text-red-400"> { ventaRapida.fin_garantia.substring(0,10) }</div>
          </div>
        </div>
      }
     
    </div>
  );
};

Index.layout = page => <Layout title="Organizations" children={page} />;

export default Index;
