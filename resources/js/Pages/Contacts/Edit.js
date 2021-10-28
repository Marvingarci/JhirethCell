import React, { useEffect, useState, useRef } from 'react';
import Helmet from 'react-helmet';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage, useForm } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import DeleteButton from '@/Shared/DeleteButton';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import TrashedMessage from '@/Shared/TrashedMessage';
import moment from 'moment';

const Edit = () => {
  const { contact, organizations, comprasE, comprasC, comprasP, usuarios } =
    usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    organization_id: contact.organization_id || '',
    email: contact.email || '',
    phone: contact.phone || '',
    address: contact.address || '',
    city: contact.city || '',
    region: contact.region || '',
    country: contact.country || '',
    postal_code: contact.postal_code || ''
  });

  var totalC = 0;
  var totalE =0;
  var totalP= 0;


  function handleSubmit(e) {
    e.preventDefault();
    put(route('contacts.update', contact.id));
  }

  function destroy() {
    if (confirm('Are you sure you want to delete this contact?')) {
      Inertia.delete(route('contacts.destroy', contact.id));
    }
  }

  function restore() {
    if (confirm('Are you sure you want to restore this contact?')) {
      Inertia.put(route('contacts.restore', contact.id));
    }
  }

  return (
    <div>
      <Helmet title={`${data.first_name} ${data.last_name}`} />
      <h1 className="mb-8 text-3xl font-bold">
        <InertiaLink
          href={route('contacts')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Contacts
        </InertiaLink>
        <span className="mx-2 font-medium text-indigo-600">/</span>
        {data.first_name} {data.last_name}
      </h1>
      {contact.deleted_at && (
        <TrashedMessage onRestore={restore}>
          This contact has been deleted.
        </TrashedMessage>
      )}
      <div className="max-w-full overflow-hidden bg-white rounded shadow">
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
            <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Organization"
              name="organization_id"
              errors={errors.organization_id}
              value={data.organization_id}
              onChange={e => setData('organization_id', e.target.value)}
            >
              <option value=""></option>
              {organizations.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </SelectInput>
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
              label="Phone"
              name="phone"
              type="text"
              errors={errors.phone}
              value={data.phone}
              onChange={e => setData('phone', e.target.value)}
            />
            <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Address"
              name="address"
              type="text"
              errors={errors.address}
              value={data.address}
              onChange={e => setData('address', e.target.value)}
            />
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="City"
              name="city"
              type="text"
              errors={errors.city}
              value={data.city}
              onChange={e => setData('city', e.target.value)}
            /> */}
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Province/State"
              name="region"
              type="text"
              errors={errors.region}
              value={data.region}
              onChange={e => setData('region', e.target.value)}
            /> */}
            {/* <SelectInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Country"
              name="country"
              errors={errors.country}
              value={data.country}
              onChange={e => setData('country', e.target.value)}
            >
              <option value=""></option>
              <option value="CA">Canada</option>
              <option value="US">United States</option>
            </SelectInput> */}
            {/* <TextInput
              className="w-full pb-8 pr-6 lg:w-1/2"
              label="Postal Code"
              name="postal_code"
              type="text"
              errors={errors.postal_code}
              value={data.postal_code}
              onChange={e => setData('postal_code', e.target.value)}
            /> */}
          </div>
          <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
            {!contact.deleted_at && (
              <DeleteButton onDelete={destroy}>Delete Contact</DeleteButton>
            )}
            <LoadingButton
              loading={processing}
              type="submit"
              className="ml-auto btn-indigo"
            >
              Update Contact
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="max-w-full overflow-hidden bg-white rounded shadow mt-5 p-10">
        <h1 className="text-indigo-600 hover:text-indigo-700 text-xl">
          Credito
        </h1>

        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Fecha</th>
              <th className="px-6 pt-5 pb-4">Cliente</th>
              <th className="px-6 pt-5 pb-4">Vendedor</th>
              <th className="px-6 pt-5 pb-4">Tipo</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {comprasC.map(({ id, cliente, vendedor_id, total, tipoPago, created_at }) => {
              totalC += parseInt(total);
              return (
                <tr
                  key={id}
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
                      {usuarios.map(user => {
                        if (user.id == vendedor_id) {
                          return user.first_name + ' ' + user.last_name;
                        }
                      })}
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
                      ver factura
                    </InertiaLink>
                  </td>
                </tr>
              );
            })}
            <tr key="">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{totalC}</td>
            </tr>
            {comprasC.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No hay ventas al credito aún
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Ventas pendientes */}

        <h1 className="text-indigo-600 hover:text-indigo-700 text-xl">
          Pendientes
        </h1>

        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Fecha</th>
              <th className="px-6 pt-5 pb-4">Cliente</th>
              <th className="px-6 pt-5 pb-4">Vendedor</th>
              <th className="px-6 pt-5 pb-4">Tipo</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {comprasP.map(({ id, cliente, vendedor_id, total, tipoPago , created_at}) =>{ 
               totalP += parseInt(total);
               return(
              <tr
                key={id}
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
                    {usuarios.map(user => {
                      if (user.id == vendedor_id) {
                        return user.first_name + ' ' + user.last_name;
                      }
                    })}
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
                    ver factura
                  </InertiaLink>
                </td>
              </tr>
            )})}
            <tr key="">
              <td></td>
              <td></td>
              <td></td>
              <td>total</td>
              <td>{ totalP}</td>
            </tr>
            {comprasP.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No hay ventas al credito aún
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Ventas efectivo */}
        <h1 className="text-indigo-600 hover:text-indigo-700 text-xl">
          Efectivo
        </h1>

        <table className="w-full whitespace-nowrap border-2">
          <thead>
            <tr className="font-bold text-left">
              <th className="px-6 pt-5 pb-4">Venta</th>
              <th className="px-6 pt-5 pb-4">Cliente</th>
              <th className="px-6 pt-5 pb-4">Vendedor</th>
              <th className="px-6 pt-5 pb-4">Tipo</th>
              <th className="px-6 pt-5 pb-4" colSpan="2">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {comprasE.map(({ id, cliente, vendedor_id, total, tipoPago, created_at }) =>{
                totalE += parseInt(total);
               return(
              <tr
                key={id}
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
                    {usuarios.map(user => {
                      if (user.id == vendedor_id) {
                        return user.first_name + ' ' + user.last_name;
                      }
                    })}
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
                    ver factura
                  </InertiaLink>
                </td>
              </tr>
            )})}
             <tr key="">
              <td></td>
              <td></td>
              <td></td>
              <td>Total</td>
              <td>{ totalE}</td>
            </tr>
            {comprasE.length === 0 && (
              <tr>
                <td className="px-6 py-4 border-t" colSpan="4">
                  No hay ventas al credito aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Edit.layout = page => <Layout children={page} />;

export default Edit;
