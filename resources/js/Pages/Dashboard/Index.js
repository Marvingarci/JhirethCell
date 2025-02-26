import React, {useState, useRef, useEffect} from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import { usePage } from '@inertiajs/inertia-react';
import { Pie } from 'react-chartjs-2';
import LoadingButton from '@/Shared/LoadingButton';
import { Inertia } from '@inertiajs/inertia';
import { compareFaces, captureGeolocation } from '../../utils';
import Webcam from 'react-webcam';
import TextInput from '@/Shared/TextInput';
import DeleteButton from '@/Shared/DeleteButton';
import SelectInput from '@/Shared/SelectInput';

const Dashboard = () => {
  const { mas_vendidos, best_clientes, usuarios, asistencia_hoy } = usePage().props;

  const webcamRef1 = useRef(null);
  const [image1, setImage1] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhoto, SetActivePhoto] = useState(false);
  const [usersRegistered, setUsersRegistered] = useState('');
  const [error, setError] = useState('');


  const captureImage1 = React.useCallback(() => {
    const imageSrc = webcamRef1.current.getScreenshot();
    setImage1(imageSrc);
  }, [webcamRef1]);

  useEffect(()=>{
    if(asistencia_hoy){
      let us = asistencia_hoy.reduce((acc, asis)=> {  
        acc +=  usuarios[usuarios.findIndex(a => a.id === asis.user_id)].first_name+" "
        return acc
      }, '')
      setUsersRegistered(us)
    }
  }, [])




  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(Buffer.from(reader.result)); // Convert to binary
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const convertBase64ToUint8Array = (base64) => {
    const binaryString = window.atob(base64.split(',')[1]); // Remove data URL prefix
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const handleCompare = async () => {
    if (image1 && user) {
      setLoading(true)
      const result = await compareFaces(convertBase64ToUint8Array(image1), user)
      if (!result) {
        setLoading(false)
        return;
      }
      let finalRes = false;
      if(result.FaceMatches.length > 0){
        finalRes = result.FaceMatches.some(match=> match.Similarity > 80);
      }

      if(finalRes){
        Inertia.get(route('registro.es', user))
      }else{
        setError("No Pareces ser "+usuarios.find(a => a.id === parseInt(user))?.first_name+" segun el analisis biometrico de AWS")
        alert("No Parecer ser "+usuarios.find(a => a.id === parseInt(user))?.first_name+" segun el analisis biometrico de AWS")
        setLoading(false)
      }

      setLoading(false)


    }
  };

  console.log(asistencia_hoy);
  return (
    // <div></div>
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

        {/* Cuarto Div */}
        <div className="flex flex-col justify-center py-12 text-center gap-2 items-center h-full bg-white shadow-xl rounded-xl">
        <p className="text-lg font-bold">Asistencia</p>
        <h3>Seleccione su usuario y centre tu rostro en el panel de la camara</h3>
        <h2>Usuarios Registrados hoy: {usersRegistered} </h2>
      <div>

        {!activePhoto &&
              <LoadingButton className="btn-indigo place-self-center mt-5" onClick={e=> SetActivePhoto(true)}>Activar camara</LoadingButton>
        }

        { (!image1 && activePhoto) &&
        <div className='flex flex-col space-y-3'>
      <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Usuarios"
              onChange={e =>  setUser(e.target.value) }
            >
              <option value=""></option>
              {usuarios.map(({ id, first_name, last_name }) => (
                <option value={id}>{first_name + ' ' + last_name}</option>
              ))}
          </SelectInput>
        <Webcam
          audio={false}
          ref={webcamRef1}
          screenshotFormat="image/jpeg"
        />
        <LoadingButton className="btn-indigo place-self-center mt-5" onClick={captureImage1}>Tomar foto</LoadingButton>
        </div>
        }
        {image1 && 
        <div className='flex flex-col space-y-4 items-center'>
        <img src={image1} alt="Captured" />
        <DeleteButton onDelete={e => {setImage1(null); setError(''); setLoading(false)}}>Tomar nuevamente</DeleteButton>
        <LoadingButton loading={loading} className="btn-indigo" onClick={handleCompare}> {loading ? 'Verificando' : 'Marcar' }</LoadingButton>
        </div>
        }
        {error != '' &&
          <span className='text-red-500 text-3 mt-5'>{error}</span>
        }
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
