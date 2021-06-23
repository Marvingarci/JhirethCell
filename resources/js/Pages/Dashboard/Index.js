import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import { usePage } from '@inertiajs/inertia-react';
import { Pie } from 'react-chartjs-2';
import LoadingButton from '@/Shared/LoadingButton';
import { Inertia } from '@inertiajs/inertia';

const Dashboard = () => {
  const { mas_vendidos, best_clientes } = usePage().props;

  console.log(best_clientes);
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Principal</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex justify-center items-center bg-white shadow-xl rounded-xl">
          <div className="flex flex-col justify-center items-center p-3">
            <h1 className="text-2xl text-center font-bold">
              Producto mas Vendido
            </h1>
            <h2 className="text-lg text-center font-bold text-green-400">
              {mas_vendidos[0].producto}
            </h2>
            <p className="text-5xl text-center font-black oldstyle-nums">
              {mas_vendidos[0].total_vendido}
            </p>
          </div>
          <div className="flex justify-center">
            {mas_vendidos.map((p, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center w-1/3"
              >
                <h2 className="text-xs font-bold text-center text-green-400">
                  {p.producto}
                </h2>
                <p className="font-bold">{p.total_vendido}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Segundo div */}
        <div className="flex flex-row justify-center text-center items-center bg-white shadow-xl rounded-xl">
        <p className="text-lg font-bold w-1/4">Mejores Clientes</p>
          <div className="w-3/4">
            <Pie
            width="200"
              className="pb-2"
              data={{
                labels: best_clientes.map(cliente => {
                  return cliente.cliente;
                }),

                datasets: [
                  {
                    data: best_clientes.map(cliente => {
                      return cliente.total;
                    }),
                    backgroundColor: [
                      'rgba(52, 211, 153, 1)',
                      'rgba(17, 24, 39, 1)',
                      'rgba(251, 191, 36, 1)'
                    ],
                    borderColor: [
                      'rgba(52, 211, 153, 1)',
                      'rgba(17, 24, 39, 1)',
                      'rgba(251, 191, 36, 1)'
                    ],
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                maintainAspectRatio: false
              }}
            />
            </div>

        </div>

        {/* Tercer div */}

        <div className="flex flex-row justify-center py-12 text-center gap-2 items-center h-full bg-white shadow-xl rounded-xl">
        <p className="text-lg font-bold">Buscador de Garantias</p>
          <div className="">
          <LoadingButton
              onClick={e=> Inertia.get("ver-garantias")}
              className="btn-indigo"
            >
              Verificar garantía
            </LoadingButton>
            </div>

        </div>
      </div>
    </div>
  );
};

// Persistent layout
// Docs: https://inertiajs.com/pages#persistent-layouts
Dashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default Dashboard;
