import React,  {useState} from 'react';
import Helmet from 'react-helmet';
import {Inertia} from '@inertiajs/inertia';
import {InertiaLink, usePage, useForm} from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import SearchFilter from '@/Shared/SearchFilter';
import moment from 'moment';
import Icon from '@/Shared/Icon';

const Edit = () => {
    const {user, organizations, VentasPorMes, VentasCreditoPorMes} = usePage().props;

    // const {data: VentasPorMesData, meta: {links}} = VentasPorMes;
    const {
        data,
        setData,
        errors,
        post,
        processing
    } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: user.password || '',
        organization_id: user.organization_id || 1,
        pin: user.pin || '',
        owner: user.owner ? '1' : '0' || '0',
        photo: '',

        // NOTE: When working with Laravel PUT/PATCH requests and FormData
        // you SHOULD send POST request and fake the PUT request like this.
        _method: 'PUT'
    });
    const [tab, setTab] = useState('ventas')
    let totalMes = 0;
    let totalMesCredito = 0;

    function handleSubmit(e) {
        e.preventDefault();

        // NOTE: We are using POST method here, not PUT/PACH. See comment above.
        post(route('users.update', user.id));
    }

    function destroy() {
        if (confirm('Are you sure you want to delete this user?')) {
            Inertia.delete(route('users.destroy', user.id));
        }
    }

    function restore() {
        if (confirm('Are you sure you want to restore this user?')) {
            Inertia.put(route('users.restore', user.id));
        }
    }

    console.log(VentasPorMes)

    return (
      <div>
        <Helmet title={`${data.first_name} ${data.last_name}`} />
        <div className="flex justify-start max-w-lg mb-8">
          <h1 className="text-3xl font-bold">
            <InertiaLink
              href={route('users')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Users
            </InertiaLink>
            <span className="mx-2 font-medium text-indigo-600">/</span>
            {data.first_name}
            {data.last_name}{' '}
          </h1>
          {user.photo && (
            <img className="block w-8 h-8 ml-4 rounded-full" src={user.photo} />
          )}{' '}
        </div>
        {user.deleted_at && (
          <TrashedMessage onRestore={restore}>
            This user has been deleted.
          </TrashedMessage>
        )}
        <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap p-8 -mb-8 -mr-6">
              <TextInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="First Name"
                name="first_name"
                errors={errors.first_name}
                value={data.first_name}
                onChange={e => setData('first_name', e.target.value)}
              />
              <TextInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="Last Name"
                name="last_name"
                errors={errors.last_name}
                value={data.last_name}
                onChange={e => setData('last_name', e.target.value)}
              />
              <TextInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="Email"
                name="email"
                type="email"
                errors={errors.email}
                value={data.email}
                onChange={e => setData('email', e.target.value)}
              />
              <TextInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="Password"
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
                label="Owner"
                name="owner"
                errors={errors.owner}
                value={data.owner}
                onChange={e => setData('owner', e.target.value)}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </SelectInput>
              <SelectInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="Organizacion"
                errors={errors.organization_id}
                value={data.organization_id}
                onChange={e => setData('organization_id', e.target.value)}
              >
                {organizations.map(orga => (
                  <option value={orga.id}>{orga.name}</option>
                ))}
                {/* <option value="0">No</option> */}
              </SelectInput>
            </div>
            <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
              {!user.deleted_at && (
                <DeleteButton onDelete={destroy}>Delete User</DeleteButton>
              )}

              <LoadingButton
                loading={processing}
                type="submit"
                className="ml-auto btn-indigo"
              >
                Update User
              </LoadingButton>
            </div>
          </form>
        </div>
        <SearchFilter show_month={true} user_id={user.id}/>
        <div className='m-5 bg-white rounded-md'>
          <div className='flex mb-4'>
            <div onClick={e => setTab('ventas')} className={ tab == 'ventas' ? 'w-1/2 border-2 border-gray-400 py-3 bg-gray-100 text-center text-xl': 'w-1/2 border-2 border-gray-400 py-3 cursor-pointer bg-gray-300 text-center text-xl'}>Ventas</div>
            <div onClick={e => setTab('creditos')} className={ tab == 'creditos' ? 'w-1/2 border-2 border-gray-400 py-3 bg-gray-100 text-center text-xl': 'w-1/2 border-2 border-gray-400 py-3 cursor-pointer bg-gray-300 text-center text-xl'}>Creditos</div>
          </div>
          <div className="overflow-x-auto bg-white rounded shadow">
              {
                (tab == 'ventas' && VentasPorMes.length > 0) &&
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="font-bold text-left">
                        <th className="px-6 pt-5 pb-4">Fecha</th>
                        <th className="px-6 pt-5 pb-4">Cliente</th>
                        <th className="px-6 pt-5 pb-4">Tipo de Pago</th>
                        <th className="px-6 pt-5 pb-4" colSpan="2">
                          Total
                        </th>
                      </tr>
                    </thead>
                          <tbody >
                            <tr>
                              <td colSpan="5" className='text-center text-lg font-bold'>{moment(VentasPorMes[0].created_at).locale("es").format("YYYY MMMM")}</td>
                            </tr>
                           
                       {                       
                        VentasPorMes.map(({ id, cliente, limite_pago,  tipoPago, created_at , total}, index) => {
                          totalMes += total
                          return(
                          <tr
                            key={index}
                            className="hover:bg-gray-100 focus-within:bg-gray-100"
                          >
                            <td className="border-t">
                              <InertiaLink
                                href={route('ventas.edit', id)}
                                className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                              >
                              {limite_pago != null && <strong>Fue Credito / </strong>}  {moment(created_at).locale("es").format("DD MMMM")}
                                
                              </InertiaLink>
                            </td>
                            <td className="border-t">
                              <InertiaLink
                                tabIndex="1"
                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                                href={route('ventas.edit', id)}
                              >
                                {cliente}
                              </InertiaLink>
                            </td>
                            <td className="border-t">
                              <InertiaLink
                                tabIndex="-1"
                                href={route('ventas.edit', id)}
                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                              >
                                {tipoPago}
                              </InertiaLink>
                            </td>
                            <td className="border-t">
                              <InertiaLink
                                tabIndex="-1"
                                href={route('ventas.edit', id)}
                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                              >
                                {total}
                              </InertiaLink>
                            </td>
                            <td className="w-px border-t">
                              <InertiaLink
                                tabIndex="-1"
                                href={route('ventas.edit', id)}
                                className="flex items-center px-4 focus:outline-none"
                              >
                                <Icon
                                  name="cheveron-right"
                                  className="block w-6 h-6 text-gray-400 fill-current"
                                />
                              </InertiaLink>
                            </td>
                          </tr>
                          )
                      })

                        }
                            <tr>
                              <td colSpan="3" className="justify-end text-right font-bold">Total Venta {                            
                              moment(VentasPorMes[0].created_at).locale("es").
                              format('MMMM')
                              }</td>
                              <td colSpan="2"  className="text-left px-1 font-bold">{totalMes}</td>
                            </tr>
                          </tbody>

        
                    
                  
                  </table>
              }
              {
                (tab == 'creditos' && VentasCreditoPorMes.length > 0)  &&
                <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="font-bold text-left">
                    <th className="px-6 pt-5 pb-4">Fecha</th>
                    <th className="px-6 pt-5 pb-4">Cliente</th>
                    <th className="px-6 pt-5 pb-4">Tipo de Pago</th>
                    <th className="px-6 pt-5 pb-4" colSpan="2">
                      Total
                    </th>
                  </tr>
                </thead>
  
                      <tbody >
                        <tr  >
                          <td colSpan="5" className='text-center text-lg font-bold'>{moment(VentasCreditoPorMes[0].created_at).locale("es").format('YYYY MMMM')}</td>
                        </tr>
                        {
                                          
                     VentasCreditoPorMes.map(({ id, cliente, vendedor_id, tipoPago, created_at , total}, index) => {
                      totalMesCredito += total
                      return(
                      <tr
                        key={index}
                        className="hover:bg-gray-100 focus-within:bg-gray-100"
                      >
                        <td className="border-t">
                          <InertiaLink
                            href={route('ventas.edit', id)}
                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                          >
                            {moment(created_at).locale("es").calendar()}
                            
                          </InertiaLink>
                        </td>
                        <td className="border-t">
                          <InertiaLink
                            tabIndex="1"
                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                            href={route('ventas.edit', id)}
                          >
                            {cliente}
                          </InertiaLink>
                        </td>
                        <td className="border-t">
                          <InertiaLink
                            tabIndex="-1"
                            href={route('ventas.edit', id)}
                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                          >
                            {tipoPago}
                          </InertiaLink>
                        </td>
                        <td className="border-t">
                          <InertiaLink
                            tabIndex="-1"
                            href={route('ventas.edit', id)}
                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                          >
                            {total}
                          </InertiaLink>
                        </td>
                        <td className="w-px border-t">
                          <InertiaLink
                            tabIndex="-1"
                            href={route('ventas.edit', id)}
                            className="flex items-center px-4 focus:outline-none"
                          >
                            <Icon
                              name="cheveron-right"
                              className="block w-6 h-6 text-gray-400 fill-current"
                            />
                          </InertiaLink>
                        </td>
                      </tr>
                      )
                      })
                    } 
                        <tr>
                          <td colSpan="3" className="justify-end text-right font-bold">Total Credito {moment(VentasCreditoPorMes[0].created_at).locale("es").format('YYYY MMMM')}</td>
                          <td colSpan="2"  className="text-left px-1 font-bold">{totalMesCredito}</td>
                        </tr>
                      </tbody>


              
              </table>
              }
      </div>
          </div>
      </div>

    
    );
};

Edit.layout = page => <Layout children={page}/>;

export default Edit;
