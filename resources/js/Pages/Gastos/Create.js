import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import FileInput from '@/Shared/FileInput';

const Create = () => {
  const { organizations, auth } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    vendedor_id: auth.user.id,
    organization_id : auth.user.organization_id,
    title: '',
    description: '',
    total: 0,
    invoice: '',
    evidence: '',
  },
  
);

  function handleSubmit(e) {
    console.log(data)
    e.preventDefault();
    post(route('gastos.store'));
  }

  return (
    <div>
      <div>
        <h1 className="mb-8 text-3xl font-bold">
          <InertiaLink
            href={route('gastos')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Gastos
          </InertiaLink>
          <span className="font-medium text-indigo-600"> /</span> Crear
        </h1>
      </div>
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form name="createForm" onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Titulo"
              name="title"
              errors={errors.title}
              value={data.title}
              onChange={e => setData('title', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Descripcion"
              name="description"
              errors={errors.description}
              value={data.description}
              onChange={e => setData('description', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Total"
              name="total"
              errors={errors.total}
              value={data.total}
              onChange={e => setData('total', e.target.value)}
              
            />

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Evidencia"
              placeholder="Poner link de google drive"
              name="Evidence"
              errors={errors.evidence}
              value={data.evidence}
              onChange={e => setData('evidence', e.target.value)}
              
            />

            {/* <input type='file' onChange={e => setData('invoice', e.target.files[0])} /> */}
            {/* <FileInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Factura"
              name="invoice"
              accept="image/*"
              errors={errors.invoice}
              value={data.invoice}
              onChange={e => setData('invoice', e)}
            /> */}
             {/* <FileInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Evidencia"
              name="evidence"
              accept="image/*"
              errors={errors.evidence}
              value={data.evidence}
              onChange={photo => setData('evidence', photo)}
            /> */}
          </div>
          <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton
              loading={processing}
              type="submit"
              className="btn-indigo"
            >
              Crear Gasto
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Crear Gasto" children={page} />;

export default Create;
