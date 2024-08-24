import React from 'react';
import Helmet from 'react-helmet';
import {Inertia} from '@inertiajs/inertia';
import {InertiaLink, usePage, useForm} from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import FileInput from '@/Shared/FileInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import moment from 'moment';
import Icon from '@/Shared/Icon';

const Edit = () => {
    const {gasto, organizations} = usePage().props;
    const {
        data,
        setData,
        errors,
        post,
        processing
    } = useForm({
      vendedor_id: gasto.vendedor_id,
      organization_id : gasto.organization_id,
      title: gasto.title,
      description: gasto.description,
      total: gasto.total,
      invoice: gasto.invoice,
      evidence: gasto.evidence,
        // NOTE When working with Laravel PUT/PATCH requests and FormData
        // you SHOULD send POST request and fake the PUT request like this.
        _method: 'PUT'
    });

    function handleSubmit(e) {
        e.preventDefault();
        // NOTE: We are using POST method here, not PUT/PACH. See comment above.
        post(route('gastos.update', gasto.id));
    }

    function destroy() {
        if (confirm('Esta seguro que desea eliminar este gasto?')) {
            Inertia.delete(route('gastos.destroy', gasto.id));
        }
    }

    console.log(gasto)

    return (
      <div>
        <Helmet title={`Nuevo Gasto`} />
        <div className="flex justify-start max-w-lg mb-8">
          <h1 className="text-3xl font-bold">
            <InertiaLink
              href={route('gastos')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Gastos
            </InertiaLink>
            <span className="mx-2 font-medium text-indigo-600">/</span>
            {data.title}
          </h1>
        </div>
        <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
          <form onSubmit={handleSubmit}>
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
            {/* Create a link to see the evidence in a new blank */}
            {data.evidence && (
              <a
                href={data.evidence}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-600 underline"
              >
                Ver evidencia
              </a>
            )}

           
            </div>
            <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
              {!gasto.deleted_at && (
                <DeleteButton onDelete={destroy}>Borrar gasto</DeleteButton>
              )}

              <LoadingButton
                loading={processing}
                type="submit"
                className="ml-auto btn-indigo"
              >
                Actualizar gasto
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>

    
    );
};

Edit.layout = page => <Layout children={page}/>;

export default Edit;
