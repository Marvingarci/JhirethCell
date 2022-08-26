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

const IndexFast = () => {
  const { categorias, usuarios, producto, ventasRapidas, contactos, auth } =
    usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    vendedor_id: '',
    contact_id: '100',
    cliente: '',
    concepto: '',
    restante:'',
    organization_id: auth.user.organization_id || null,
    total: 0,
    tipoPago: 'pendiente',
    ventas: []
  });

  console.log(ventasRapidas);

  

  const [carrito, setCarrito] = useState([]);
  const [cuenta, setCuenta] = useState(0);
  const [seleccion, setSeleccion] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [messagePin, setMessagePin] = useState('');

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
    data.ventas = carrito;
    data.total = carrito[0].real_sell_price
    data.restante = '0'
    console.log(data);
    if(checkVendor()){ 
      post(route('ventas.store'), {
        onSuccess: page => {
          setCarrito([]);
        },
        onError:error=>{
          console.log(error)
        }
      });
    }
  }

  const closeModal = () => {
    setIsOpen(false);
  }
  const openModal = () => {
    setIsOpen(true);
  }


  const checkVendor = () =>{
    if(data.vendedor_id !=  auth.user.id){
      openModal()
      return false;
    }else{
      return true;
    }
  }

  const checkPin = () =>{
    let user = usuarios.find(us => us.id == data.vendedor_id)
    console.log(pin, user.pin)
    if(pin ==  user.pin){
      closeModal()
      console.log(data);
      post(route('ventas.store'), {
        onSuccess: page => {
          setCarrito([]);
        },
        onError:error=>{
          console.log(error)
        }
      });
    }else{
      setMessagePin('Pin Incorrecto, Intente nuevamente')
    }
  }


  useEffect(() => {
    if (producto != null) {
      //If product has been sold, just scape
      if (producto.status != 'stock') {
        reset();
        return false;
      }

      if(producto.product.dbType == 'colectivo'){
        reset()
        return false
      }
      const newProduct = producto.product;
      newProduct.cantidad = 1;
      newProduct.codebar = producto.codebar;
      newProduct.real_sell_price = newProduct.whole_sell_price;
      newProduct.descuento = 0;
      newProduct.costo_servicio = 0;
      newProduct.estado = 'pendiente';
      newProduct.total_producto = newProduct.cantidad * newProduct.whole_sell_price;
      if (carrito.length == 0) {
        setCarrito([...carrito, newProduct]);
      } else {
        if (carrito.find(item => item.id === newProduct.id)) {
        } else {
          setCarrito([...carrito, newProduct]);
        }
      }
      reset();
      SumaTotal();
    }
  }, [producto]);
  setDescuento;

  const setDescuento = (index, descuento) => {
    carrito[index].descuento = descuento;
    carrito[index].real_sell_price =
      carrito[index].whole_sell_price - carrito[index].whole_sell_price * descuento;
    carrito[index].total_producto =
      carrito[index].cantidad * carrito[index].real_sell_price;
    setCarrito([...carrito]);
    SumaTotal();
  };

  // const setCantidad = (index, cantidad) => {
  //   carrito[index].cantidad = parseFloat(cantidad);
  //   carrito[index].total_producto =
  //     carrito[index].cantidad * carrito[index].real_sell_price;
  //   setCarrito([...carrito]);
  //   SumaTotal();
  // };

  const SumaTotal = () => {
    let contar = 0;
    carrito.map(item => {
      contar = contar + item.total_producto;
    });
    setData('total', contar);
  };

  const setOrganization = (user_id) => {
    setData('vendedor_id', user_id)
    data.vendedor_id = user_id
    let user = usuarios.find(us => us.id == user_id)
    console.log(user)
    setData('organization_id' ,user.organization_id)
  }

  const eliminar = codigo => {
    const newP = carrito.filter(item => item.product_code !== codigo);
    setCarrito([...newP]);
    let contar = 0;
    newP.map(item => {
      contar = contar + item.total_producto;
    });
    setData('total', contar);
  };

  const handleConfirm = venta => {
    if (confirm('¿Está seguro de desea dar por hecho esta venta?')) {
      Inertia.put(
        route('ventas.actualizarfast', {
          id: venta.id,
          venta_detalles: venta.venta_detalles[0]
        }),
        { id: venta.id, venta_detalles: venta.venta_detalles[0] },
        {
          onSuccess: page => {},
          onError: error => {
            console.log(error);
          }
        }
      );
    }
  };

  const Seleccione =(venta)=>{
    setSeleccion(venta)
  }

  const handleCancel = (venta, razon) => {
    console.log(venta);
    if (confirm('¿Está seguro de desea proceder con la accion esta venta?')) {
      Inertia.put(
        route('ventas.destroy', {
          id: venta.id,
          venta_detalles: venta.venta_detalles,
          razonDev: razon
        }),
        { id: venta.id, venta_detalles: venta.venta_detalles[0], razonDev: razon },
        {
          onSuccess: page => {
            setSeleccion(false)
          },
          onError: error => {
            console.log(error);
          }
        }
      );
    }
  };

  const setMayorista=(contact)=>{
    contactos.filter(con => con.id == contact).map(c=>{
      data.cliente =  c.first_name + ' ' + c.last_name
    })
    data.contact_id= contact
    console.log(data)
  }

  const myref = useRef();
  const reset = () => {
    myref.current.reset();
  };
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Caja Rápida</h1>
      <div className=" overflow-hidden bg-white rounded shadow">
        <div className="flex items-center justify-center py-5">
          <p className="text-2xl text-gray-500 text-center font-bold">
            Registro de Venta Rápida
          </p>
        </div>
        <div className="flex flex-wrap p-8 -mb-8 -mr-6">
          <SearchFilter className="w-full" ref={myref} />
          {/* Comienzo tabla */}
          <div className="overflow-x-auto bg-white rounded shadow w-full">
            <table className=" whitespace-nowrap w-full">
              <thead>
                <tr className="font-bold text-left">
                  {/* <th className="px-3 pt-5 pb-4">Fecha</th> */}
                  <th className="px-6 pt-5 pb-4">Nombre</th>
                  <th className="px-6 pt-5 pb-4">Mayorista</th>
                  <th className="px-6 pt-5 pb-4">Vendedor</th>
                  <th className="px-6 pt-5 pb-4">Precio</th>
                  <th className="px-6 pt-5 pb-4">Descuento</th>
                  <th className="px-6 pt-5 pb-4 " colSpan="2">
                    Total
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
                      sell_price,
                      total_producto,
                      real_sell_price,
                      updated_at
                    },
                    index
                  ) => (
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                      <td className="border-t justify-center text-center items-center">
                        {name}
                      </td>
                      <td
                        className={`border-t justify-center text-center items-center`}
                      >
                        {/* <TextInput
                          className="w-full"
                          name="first_name"
                          errors={errors.cliente}
                          value={data.cliente}
                          onChange={e => setData('cliente', e.target.value)}
                        /> */}
                        <SelectInput
                          className="w-full"
                          name="cliente"
                          errors={errors.cliente}
                          value={data.clientes}
                          onChange={e => setMayorista(e.target.value)}
                        >
                          <option value=""></option>
                          {contactos.map(({ id, first_name, last_name }) => (
                            <option value={id}>
                              {first_name + ' ' + last_name}
                            </option>
                          ))}
                        </SelectInput>
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        <SelectInput
                          className="w-full"
                          name="organization_id"
                          errors={errors.vendedor}
                          value={data.vendedor}
                          onChange={e => setOrganization(e.target.value)}
                        >
                          <option value=""></option>
                          {usuarios.map(({ id, first_name, last_name }) => (
                            <option value={id}>
                              {first_name + ' ' + last_name}
                            </option>
                          ))}
                        </SelectInput>
                      </td>
                      {/* <td className="border-t justify-center text-center items-center">
                        <TextInput
                          className="w-20"
                          type="number"
                          value={cantidad}
                          inputProps={{
                            min: 1
                          }}
                          onChange={e => setCantidad(index, e.target.value)}
                        />
                      </td> */}

                      <td className="border-t justify-center text-center items-center">
                        {real_sell_price}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        <SelectInput
                          className="w-20"
                          name="organization_id"
                          // errors={errors.tipoPago}
                          // value={data.tipoPago}
                          onChange={e => setDescuento(index, e.target.value)}
                        >
                          <option value="0">N/A</option>
                          <option value="0.01">1%</option>
                          <option value="0.02">2%</option>
                          <option value="0.03">3%</option>
                          <option value="0.04">4%</option>
                          <option value="0.05">5%</option>
                          <option value="0.10">10%</option>
                          <option value="0.15">15%</option>
                        </SelectInput>
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {total_producto}
                      </td>

                      <td className="border-t">
                        <button
                          onClick={handleSubmit}
                          className="bg-newblue-200 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Agregar
                        </button>
                      </td>
                    </tr>
                  )
                )}

                {carrito.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 border-t" colSpan="4">
                      Escanea un producto
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* fin tabla */}
        </div>
        <div className="flex items-center justify-center py-5">
          <p className="text-lg text-gray-500 text-center font-bold">
            Cola de Ventas
          </p>
        </div>

        {/* Comienzo tabla pendiente */}
        <div className="overflow-x-auto bg-white rounded shadow w-full">
          <table className=" whitespace-nowrap w-full">
            <thead>
              <tr className="font-bold text-left">
                <th className="px-3 pt-5 pb-4">Fecha</th>
                <th className="px-3 pt-5 pb-4">Codigo</th>
                <th className="px-6 pt-5 pb-4">Nombre</th>
                <th className="px-6 pt-5 pb-4">Cliente</th>
                <th className="px-6 pt-5 pb-4">Vendedor</th>
                <th className="px-6 pt-5 pb-4">Precio</th>
                <th className="px-6 pt-5 pb-4">Descuento</th>
                <th className="px-6 pt-5 pb-4 " colSpan="2">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {ventasRapidas.map((venta, index) =>
                venta.venta_detalles.map(
                  ({
                    producto,
                    product_code,
                    precio,
                    descuento,
                    total_producto,
                    created_at
                  }) => (
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                      <td className="border-t justify-center text-center items-center">
                        {moment(created_at).locale("es").calendar()}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {product_code}
                      </td> 
                      <td className="border-t justify-center text-center items-center">
                        {producto}
                      </td>
                      <td
                        className={`border-t justify-center text-center items-center`}
                      >
                        {venta.cliente}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {usuarios
                          .filter(user => user.id == venta.vendedor_id)
                          .map(
                            ({ id, first_name, last_name }) =>
                              first_name + ' ' + last_name
                          )}
                      </td>

                      <td className="border-t justify-center text-center items-center">
                        {precio}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {descuento}
                      </td>
                      <td className="border-t justify-center text-center items-center">
                        {total_producto}
                      </td>

                      <td className="border-t">
                        { seleccion == venta.id ?(
                            <>
                              <button
                          onClick={e => handleCancel(venta, 'buena')}
                          className="bg-yellow-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          No se uso
                        </button>
                        <button
                          onClick={e => handleCancel(venta, 'mala')}
                          className="bg-yellow-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Mala
                        </button>
                        <button
                          onClick={e => handleCancel(venta, 'observacion')}
                          className="bg-yellow-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Observacion
                        </button>
                            </>
                        ):(
                          <>
                          <button
                          onClick={e => handleConfirm(venta)}
                          className="bg-green-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Vendido
                        </button>
                        <button
                          onClick={e => Seleccione(venta.id)}
                          className="bg-red-500 ring-2 text-white py-2 px-1 rounded-xl m-1"
                        >
                          Devuelto
                        </button>
                        </>
                        )
                          
                        }
                        
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
        {/* fin tabla pendiente */}
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

IndexFast.layout = page => <Layout title="Create Contact" children={page} />;

export default IndexFast;
