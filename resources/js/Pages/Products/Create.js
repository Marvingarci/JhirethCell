import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, useForm, usePage } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';

const colores = [
  'verde','azul','naranja','negro','blanco','morado','amarillo','rojo','gris'
]
const Create = () => {
  const { categorias, auth } = usePage().props;

  const { data, setData, errors, post, processing } = useForm({
    name: '',
    //product_code: '',
    category_id: '',
    color: 'indefinido',
    //existencia: '',
    cost_price: 0,
    sell_price: 0,
    whole_sell_price:0
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('products.store'));
  }
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('products')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Productos
        </InertiaLink>
        <span className="font-medium text-indigo-600"> /</span> Crear
      </h1>
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Nombre"
              name="name"
              errors={errors.name}
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Codigo del producto"
              name="email"
              type="text"
              placeholder="Escanear el codigo de barra"
              errors={errors.product_code}
              value={data.product_code}
              onChange={e => setData('product_code', e.target.value)}
            /> */}
           <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Color"
              name="Categoria"
              errors={errors.color}
              value={data.color}
              onChange={e => setData('color', e.target.value)}
            >
              <option value="Indefinido">Indefinido</option>
              {
                colores.map(color=>{
                  return(<option value={color}>{color}</option>)
                })
              }              
            </SelectInput>
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Existencia"
              name="address"
              type="number"
              errors={errors.existencia}
              value={data.existencia}
              onChange={e => setData('existencia', e.target.value)}
            /> */}
              {
        auth.user.owner == true && 
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Precio de compra"
              name="city"
              type="number"
              errors={errors.cost_price}
              value={data.cost_price}
              onChange={e => setData('cost_price', e.target.value)}
            />      }
            
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Precio de Venta"
              name="region"
              type="number"
              errors={errors.sell_price}
              value={data.sell_price}
              onChange={e => setData('sell_price', e.target.value)}
            />
             <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Precio de Mayorista"
              name="region"
              type="number"
              errors={errors.whole_sell_price}
              value={data.whole_sell_price}
              onChange={e => setData('whole_sell_price', e.target.value)}
            />
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Categoría"
              name="Categoria"
              errors={errors.category_id}
              value={data.category_id}
              onChange={e => setData('category_id', e.target.value)}
            >
              <option value=""></option>
              {
                categorias.map(categoria=>{
                  return(<option value={categoria.id}>{categoria.name}</option>)
                })
              }              
            </SelectInput>
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Postal Code"
              name="postal_code"
              type="text"
              errors={errors.postal_code}
              value={data.postal_code}
              onChange={e => setData('postal_code', e.target.value)}
            /> */}
          </div>
          <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton
              loading={processing}
              type="submit"
              className="btn-indigo"
            >
              Crear Producto
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Create Organization" children={page} />;

export default Create;
