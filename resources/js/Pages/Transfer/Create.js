import React, { useEffect, useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import SearchFilter from '@/Shared/SearchFilterForCode';
import Modal from 'react-modal';
import moment from 'moment';

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
const customStyles1 = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    // bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#app');
// Transfer
const Create = () => {
  const { tiendas, usuarios, producto , auth} = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    send_by: auth.user.id || 0 ,
    received_by: 0,
    old_company: 0,
    new_company: 0,
    note: '',
    description: '',
    items: [],
    product_id : ''
  });

  const [carrito, setCarrito] = useState([]);
  const [pin, setPin] = useState('');
  const [messagePin, setMessagePin] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);


  const closeModal = () => {
    setIsOpen(false);
  }
  const openModal = () => {
    setIsOpen(true);
  }

  const date = new Date();
  const ahora =
    date.getDate() +
    '-' +
    (date.getMonth() + 1 > 9
      ? date.getMonth() + 1
      : '0' + (date.getMonth() + 1)) +
    '-' +
    date.getFullYear();

  function handleSubmit(e) {
    e.preventDefault();

    // set all the items to the main sell
    data.items = carrito;
    data.product_id = JSON.stringify(carrito);

    // set restasnte
    // if(data.tipoPago == "credito"){
    //   data.restante = data.total
    // }

    if(checkVendor()){
      console.log(data);
      // post(route('transfer.store'));
    }

  }

  const checkVendor = () =>{
    // if(data.vendedor_id !=  auth.user.id){
      openModal()
      return false;
    // }else{
    //   return true;
    // }
  }

  const checkPin = () =>{
    let user = usuarios.find(us => us.id == data.send_by)
    console.log(pin, user.pin)
    if(pin ==  user.pin){
      closeModal()
      console.log(data);
      post(route('transfer.store'));
    }else{
      setMessagePin('Pin Incorrecto, Intente nuevamente')
    }
  }

  useEffect(() => {
    console.log(producto)
    if (producto != null) {
      console.log(producto.product)

      // If product has been sold, just scape
      if(producto.status != 'stock'){
        reset()
        return false
      }

       // If product is colective and cantidad is 0 
       if(producto.product.dbType == 'colectivo' && producto.existencia < 1){
        reset()
        return false
      }


      //Agg scaned product to the shopcart and set new values
      const newProduct = producto.product;
      newProduct.cantidad = 1;
      newProduct.codebar = producto.codebar;

      //check is the car is empty 
      if (carrito.length == 0) {
        setCarrito([...carrito, newProduct]);

      } else {
        //if the article exists, it doesnt make anything
        if (carrito.find(item => item.codebar === newProduct.codebar)) {
        } else {
          setCarrito([...carrito, newProduct]);

        }

      }

      reset();
    }
    reset();

    console.log(usuarios)
  }, [producto]);

  // useEffect(() => {
  //   console.log('useeffect carrito')
  //   SumaTotal();
  // }, [carrito])


  const setCantidad = (index, cantidad) => {
    carrito[index].cantidad = parseFloat(cantidad);
    carrito[index].total_producto =
    carrito[index].cantidad * carrito[index].sell_price;
    setCarrito([...carrito]);
    SumaTotal();
  };


 

  const SumaTotal = () => {
    console.log('suma total',carrito)
    let contar = 0;
    carrito.map(item => {
      contar = contar + item.total_producto;
    });
    console.log("contar despues de sumaTotal "+contar)
    //data.total= contar;
    setData('total', contar)
  };

  const eliminar  =  codebar => {
    const newP = carrito.filter(item => item.codebar !== codebar);
    setCarrito([...newP]);
    let contar = 0;
      newP.map(item => {
      contar = contar + item.total_producto;
    });
    setData('total', contar);
  };

  const myref = useRef();
  const reset = () => {
    myref.current.reset();
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('transfer')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Transferencias
        </InertiaLink>
        <span className="font-medium text-indigo-600"> /</span> Nueva Transferencia
      </h1>
      <div className=" overflow-hidden bg-white rounded shadow">
        <div className="flex items-center justify-center py-5">
          <p className="text-2xl text-gray-500 text-center font-bold">
            Transferencia
          </p>
        </div>
          {/* <div className="pl-8">
            <input type="checkbox" onChange={e => cambiarCliente()} />
            <label>Mayorista</label>
          </div> */}
            <div>
            <form  onSubmit={handleSubmit}>
            <div className="flex flex-wrap p-8 -mb-8 -mr-6">

            {/* {
              tipoCliente ?
              ( <TextInput
                className="w-full pb-8 pr-6 lg:w-1/3"
                label="Cliente"
                name="first_name"
                errors={errors.cliente}
                value={data.cliente}
                onChange={e => setData('cliente', e.target.value)}
              />
              )
              :
              (
                <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Mayorista"
              name="cliente"
              errors={errors.cliente}
              value={data.clientes}
              onChange={e => setMayorista(e.target.value)}
            >
              <option value=""></option>
              {contactos.map(({id, first_name, last_name}) => (
                <option value={id}>{first_name + ' ' + last_name}</option>
              ))}
            </SelectInput>
              )     
            } */}
             <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Descripcion"
              value={data.description}
              onChange={e =>  setData('description', e.target.value) }
            />
             <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Enviado por"
              name="organization_id"
              errors={errors.send_by}
              value={data.send_by}
              onChange={e =>  setData('send_by', parseInt(e.target.value)) }
            >
              <option value=""></option>
              {usuarios.map(({ id, first_name, last_name }) => (
                <option value={id}>{first_name + ' ' + last_name}</option>
              ))}
            </SelectInput>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Recibido por"
              name="organization_id"
              errors={errors.received_by} 
              value={data.received_by}
              onChange={e =>  setData('received_by',parseInt(e.target.value)) }
            >
              <option value=""></option>
              {usuarios.map(({ id, first_name, last_name }) => (
                <option value={id}>{first_name + ' ' + last_name}</option>
              ))}
            </SelectInput>
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Fecha"
              name="first_name"
              disabled
              value={ahora}
            />
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Desde"
              name="organization_id"
              errors={errors.old_company}
              value={data.old_company}
              onChange={e =>  setData('old_company',parseInt(e.target.value)) }
            >
              <option value=""></option>
              {tiendas.map(({ id, name }) => (
                <option value={id}>{name}</option>
              ))}
            </SelectInput>
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Hacia"
              name="organization_id"
              errors={errors.new_company}
              value={data.new_company}
              onChange={e =>  setData('new_company',parseInt(e.target.value)) }
            >
              <option value=""></option>
              {tiendas.map(({ id, name }) => (
                <option value={id}>{name}</option>
              ))}
            </SelectInput>
            <SearchFilter className="w-full pb-8 pr-6 lg:w-1/3" ref={myref} />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/3"
              label="Notas"
              value={data.note}
              onChange={e =>  setData('note',e.target.value) }
            />
            {/* <SelectInput
              className="w-full pr-6 lg:w-1/3"
              label="Pago"
              errors={errors.tipoPago}
              value={data.tipoPago}
              onChange={e => setData('tipoPago', e.target.value)}
            >
              <option value=""></option>
              <option value="efectivo">Efectivo</option>
              <option value="credito">Credito</option>
              <option value="transferencia">Transferencia</option>
              <option value="pos">POS</option>
            </SelectInput> */}

            {/* { data.tipoPago == 'credito' && 

              <div className="w-full pr-6 flex gap-2 items-center">
                <TextInput
                  
                  label="dias habiles de pago"
                  type="number"
                  errors={errors.dias_credito}
                  value={data.dias_credito}
                  onChange={e => setData('dias_credito', e.target.value)}
                />
                <p className='text-gray-500 font-semibold italic'>Fecha estimada { data.dias_credito != 0 && moment().add(data.dias_credito , 'days').locale("es").format("DD MMM YYYY")}</p>
              </div>
            } */}

            
            </div>
            </form>

            {/* Comienzo tabla */}
            <div className="overflow-x-auto bg-white rounded shadow w-full">
              <table className=" whitespace-nowrap w-full">
                <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4">Nombre</th>
                    <th className="px-6 pt-5 pb-4">Código</th>
                    <th className="px-6 pt-5 pb-4">Precio</th>
                    {/* <th className="px-3 pt-5 pb-4">Cantidad</th> */}
                    {/* <th className="px-6 pt-5 pb-4">Descuento</th> */}
                    <th className="px-6 pt-5 pb-4 " colSpan="2">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(
                    (
                      {
                        product_code,
                        name,
                        existencia,
                        cantidad,
                        codebar,
                        sell_price,
                        costo_servicio,
                        category_id,
                        total_producto,
                        dbType
                      },
                      index
                    ) => (
                      <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t justify-center text-center items-center">
                            {name}
                        </td>
                        <td className={`border-t justify-center text-center items-center ${codebar == 0 && 'text-red-500'}`}>
                            {codebar}
                        </td>
                        

                        {
                          category_id != 4 &&
                        <td className="border-t justify-center text-center items-center">
                          {sell_price}
                          </td>
                        }

                        {
                          category_id == 4 &&
                          <td className="border-t justify-center text-center items-center">

                          N/A
                                                    </td>

                        }
                        {
                          dbType == 'colectivo' ?
                          <td className="border-t justify-center text-center items-center">
                          <TextInput
                            className="w-20"
                            type="number"
                            value={cantidad}
                            inputProps={{
                              min: 1
                            }}
                            onChange={e => setCantidad(index, e.target.value)}
                          />
                        </td>

                          :
                          <td className="border-t justify-center text-center items-center">
                            {cantidad} 
                          </td>

                        }
                      

                        {/* {
                          category_id != 4 &&
                          <td className="border-t justify-center flex flex-row text-center items-center gap-1">
                          <TextInput
                            className="w-20"
                            name="descuento"
                            type="number"
                            onChange={e => setDescuentoCantidad(index, e.target.value)}
                            />
                        </td>
                        } */}
                       
                        {/* <td className="border-t justify-center text-center items-center">
                         
                            {total_producto}
                        </td> */}

                        <td className="border-t">
                          <button
                            onClick={e => eliminar(codebar)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="px-6 py-4 border-t" colSpan="3"></td>
                    {/* <td className="px-6 py-4 border-t font-bold">Total</td>
                    <td className="px-6 py-4 border-t font-bold">
                      {data.total}
                    </td> */}
                  </tr>
                  {carrito.length === 0 && (
                    <tr>
                      <td className="px-6 py-4 border-t" colSpan="4">
                        No hay productos aun
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* fin tabla */}
          </div>
          <div className="flex items-center justify-between px-8 py-4 bg-gray-100 border-t border-gray-200">
          {/* <LoadingButton
              type="button"
              onClick={e => setServicioIsOpen(true)}
              className="btn-indigo"
            >
              Añadir Servicio
            </LoadingButton> */}
            <LoadingButton
              loading={processing}
              type="button"
              onClick={handleSubmit}
              className="btn-indigo"
            >
              Transferir
            </LoadingButton>
          </div>
      </div>


      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ingrese el pin de vendedor"
        style={customStyles}
      >
        <div className='flex justify-between pb-5'>
          <h2 >Ingresa el pin de vendedor</h2>
          <LoadingButton className="btn-indigo" onClick={closeModal}>close</LoadingButton>
        </div>
        <div>
            <TextInput
                className="w-full pb-8 pr-6 lg:w-1/3"
                label="Pin"
                type="password"
                name="first_name"
                value={pin}
                onChange={e => setPin(e.target.value)}
            />
            <p className="text-red-500 text-xl font-bold">{messagePin}</p>

            <div className='flex gap-1'>
          <LoadingButton onClick={checkPin} className="btn-indigo" >Ok</LoadingButton>
          <LoadingButton onClick={closeModal} className="btn-indigo" >Close</LoadingButton>
            </div>
        </div>

      </Modal>


    </div>
  );
};

Create.layout = page => <Layout title="Create Contact" children={page} />;

export default Create;
