import React, { useEffect, useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import SearchFilter from '@/Shared/SearchFilterForCode';

const Create = () => {
  const { categorias, usuarios, producto, ventasRapidas } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    nombre: '',
    service_code: '',
    costo: 0,
    pago: 0,
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('servicios.store'),{
      onSuccess: page => {

      },
    });
  }

  return (
    <div>
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('servicios')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Servicios
        </InertiaLink>
        <span className="font-medium text-indigo-600"> /</span> Crear Servicio
      </h1>
    </div>
    <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
      <form name="createForm" onSubmit={handleSubmit}>
        <div className="flex flex-wrap p-8 -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Nombre"
            errors={errors.nombre}
            value={data.nombre}
            onChange={e => setData('nombre', e.target.value)}
          />
           <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Codigo"
            errors={errors.service_code}
            value={data.service_code}
            onChange={e => setData('service_code', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Costo"
            errors={errors.costo}
            value={data.costo}
            onChange={e => setData('costo', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Pago"
            errors={errors.pago}
            value={data.pago}
            onChange={e => setData('pago', e.target.value)}
          />
        </div>
        <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
          <LoadingButton
            loading={processing}
            type="submit"
            className="btn-indigo"
          >
            Crear Servicio
          </LoadingButton>
        </div>
      </form>
    </div>
  </div>
  );
};

Create.layout = page => <Layout title="Crear" children={page} />;

export default Create;
