import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import FileInput from '@/Shared/FileInput';

const Create = () => {
  const { organizations } = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    organization_id: 0,
    pin: '',
    owner: '0',
    deleteProduct: '',
    photo: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('users.store'));
  }

  return (
    <div>
      <div>
        <h1 className="mb-8 text-3xl font-bold">
          <InertiaLink
            href={route('users')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Usuarios
          </InertiaLink>
          <span className="font-medium text-indigo-600"> /</span> Crear
        </h1>
      </div>
      <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
        <form name="createForm" onSubmit={handleSubmit}>
          <div className="flex flex-wrap p-8 -mb-8 -mr-6">
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Nombre"
              name="first_name"
              errors={errors.first_name}
              value={data.first_name}
              onChange={e => setData('first_name', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Apellido"
              name="last_name"
              errors={errors.last_name}
              value={data.last_name}
              onChange={e => setData('last_name', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Correo Electronico"
              name="email"
              type="email"
              errors={errors.email}
              value={data.email}
              onChange={e => setData('email', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Contraseña"
              name="password"
              type="password"
              errors={errors.password}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
            />

            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Pin"
              name="password"
              type="text"
              errors={errors.pin}
              value={data.pin}
              onChange={e => setData('pin', e.target.value)}
            />  
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Es Administrador?"
              name="owner"
              errors={errors.owner}
              value={data.owner}
              onChange={e => setData('owner', e.target.value)}
            >
              <option value="1">Si</option>
              <option value="0">No</option>
            </SelectInput>

            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Puede actulizar o eliminar productos"
              name="deleteProduct"
              errors={errors.deleteProduct}
              value={data.deleteProduct}
              onChange={e => setData('deleteProduct', e.target.value)}
            >
              <option value="1">Si</option>
              <option value="0">No</option>
            </SelectInput>
            
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Organizacion"
              errors={errors.organization_id}
              value={data.organization_id}
              onChange={e => setData('organization_id', e.target.value)}
            >
              {
                organizations.map(orga => (
                  <option value={orga.id}>{orga.name}</option>
                ))
              }
              {/* <option value="0">No</option> */}
            </SelectInput>

            {/* <FileInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Photo"
              name="photo"
              accept="image/*"
              errors={errors.photo}
              value={data.photo}
              onChange={photo => setData('photo', photo)}
            /> */}
          </div>
          <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton
              loading={processing}
              type="submit"
              className="btn-indigo"
            >
              Crear usuario
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

Create.layout = page => <Layout title="Crear Usuario" children={page} />;

export default Create;
