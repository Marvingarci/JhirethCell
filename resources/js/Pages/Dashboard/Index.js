import React, { useEffect, useState } from 'react';
import Layout from '@/Shared/Layout';
import { usePage, useForm } from '@inertiajs/inertia-react';
import { Pie } from 'react-chartjs-2';
import { Inertia } from '@inertiajs/inertia';
import LoadingButton from '@/Shared/LoadingButton';
import SelectInput from '@/Shared/SelectInput';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#app');

const Dashboard = () => {
  const { macAddress, organizations, mas_vendidos, best_clientes } = usePage().props;
  const [modalIsOpen, setIsOpen] = useState(false);

  const { data, setData, errors, post, processing } = useForm({
    macAddress: macAddress,
    company_id: '',
  });

  const checkIfDevicesExists = () => {
    let exists = false
    organizations.map(orga => {
      if(orga.devices == null){
               
      }else{
        exists = orga.devices.some(device => device === macAddress);
      }
    });
    return exists;
  }

  useEffect(() => {
    if(!checkIfDevicesExists()){
      openModal();
      
    }
  }, [])

  const closeModal = () => {
    setIsOpen(false);
  }
  const openModal = () => {
    setIsOpen(true);
  }

  const SaveDevice = (e) => {
    e.preventDefault();
    console.log(data);
    post(route('save.device'),{
      onSuccess: page => {
        console.log(page)
        closeModal();
      },
      onError: errors =>{
        console.log(errors)
      }
    });
  }

  console.log(organizations, macAddress, checkIfDevicesExists());
  return (
    // <div></div>
    <div>
      <h1 className="mb-8 text-3xl font-bold">Principal</h1>
      <div className="grid grid-cols-2 gap-3">
        {(mas_vendidos != undefined  && mas_vendidos.length > 0) &&
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
        }
        {/* Segundo div */}
          {
            (best_clientes != undefined && best_clientes.length > 0) &&

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
          }

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

       <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Computadora"
        style={customStyles}
      >
        <div className='flex justify-between pb-5 px-5'>
          <h2 className='text-gray-500 text-xl font-bold'>Agregar Computadora</h2>
        </div>
        <div className='flex flex-col h-full overflow-y-auto'>
            <div className='text-gray-700 pb-10 text-break'>Este Dispositivo no ha sido registrado, porfavor selecciona la tienda a la que pertenece esta computadora</div>
            <div className='flex  justify-between gap-5 p-1 border-2' >
            <SelectInput
              className="w-full pr-6 lg:w-1/3"
              label="Empresa"
              value={data.company_id}
              onChange={e => setData('company_id', e.target.value) }
            >
              <option value=""></option>
              {
                organizations.map((orga, index) => {
                 return  <option key={index} value={orga.id}>{orga.name}</option>
                }
                )
              }
              {/* <option value="efectivo">Efectivo</option>
              <option value="credito">Credito</option>
              <option value="transferencia">Transferencia</option>
              <option value="pos">POS</option> */}
            </SelectInput>
            <LoadingButton className="btn-indigo" type="button" onClick={SaveDevice}>Guardar</LoadingButton>
          </div>
        {/* <div className='flex justify-between'>
        <div>
        <LoadingButton className="btn-indigo" type="button" onClick={ e => addPayments()}>Nuevo</LoadingButton>
        </div>
        <div className='flex flex-col'>
        <span className="text-lg text-end">Total: {data.total}</span>
        <span className="text-lg border-b-2 text-end">Pagado: {pagado}</span>
        <span className="text-lg font-bold border-2 text-end">Balance: {data.total - pagado}</span>

        </div>
        </div> */}
        </div>
        

      </Modal>
     </div>

     
  );
};

Dashboard.layout = page => <Layout title="Dashboard" children={page} />;

export default Dashboard;
