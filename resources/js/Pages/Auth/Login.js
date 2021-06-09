import React from 'react';
import Helmet from 'react-helmet';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import Logo from '@/Shared/Logo';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';

export default () => {
  const { data, setData, errors, post, processing } = useForm({
    email: '',
    password: '',
    remember: true
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('login.attempt'));
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-scroll bg-opacity-50" style={{ background : "url(https://i.ibb.co/kqtWn1R/72427551-475479973059127-1491202135386226688-n.jpg)"  }}>
      <Helmet title="Login" />
      <div className="w-full max-w-md">
      
        <form
          onSubmit={handleSubmit}
          className="mt-8 overflow-hidden bg-white bg-opacity-90 rounded-lg shadow-xl"
        >
          <div className="flex items_center justify-center pt-5">
          <Logo
          className="block w-22 h-22 max-w-xs mx-auto text-white fill-current rounded-full"
          height={50}
        />
        </div>
          <div className="px-10 pt-5">
            <h1 className="text-3xl font-bold text-center">Jhiret Cell Administración</h1>
            <div className="w-24 mx-auto mt-6 border-b-2" />
            <TextInput
              className="mt-5"
              label="Correo Electrónico"
              name="email"
              type="email"
              errors={errors.email}
              value={data.email}
              onChange={e => setData('email', e.target.value)}
            />
            <TextInput
              className="mt-6"
              label="Contraseña"
              name="password"
              type="password"
              errors={errors.password}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
            />
            
          </div>
          <div className="flex items-center justify-center px-10 py-4 bg-gray-100 border-t border-gray-200">
            <LoadingButton
            
              type="submit"
              loading={processing}
              className="btn-indigo w-40 flex justify-center"
            >
                         INICIAR SESION
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
