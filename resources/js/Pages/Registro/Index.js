import React, { useRef, useState } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import SearchFilterRegistro from '@/Shared/SearchFilterRegistro';
import Pagination from '@/Shared/Pagination';
import moment from 'moment';

const Index = () => {
    const { registros, organizations, auth, modules, actions, users } = usePage().props;
    const { data, meta: {
        links
    } } = registros;

    console.log(users)

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold">Registro(funcionando desde el 2 de septiembre 2024)</h1>
            <div className="flex items-center justify-between mb-6">
                <SearchFilterRegistro modules={modules} actions={actions} users={users}/>
                {/* <InertiaLink className="btn-indigo focus:outline-none"
                    href={
                        route('registro.create')
                }>
                    <span>Nuevo</span>{" "}
                    <span className="hidden md:inline">
                        Gasto</span>
                </InertiaLink> */}
            </div>
            <div className="overflow-x-auto bg-white rounded shadow overflow-auto">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Fecha</th>
                            {/* <th className="px-6 pt-5 pb-4">Modulo</th>
                            <th className="px-6 pt-5 pb-4">Venta</th> */}
                            <th className="px-6 pt-5 pb-4">Descripcion</th>
                            {/* <th className="px-6 pt-5 pb-4">Accion</th> */}
                            <th className="px-6 pt-5 pb-4">Notas</th>
                            <th className="px-6 pt-5 pb-4" colSpan="2">

                            </th>
                        </tr>
                    </thead>
                    <tbody> {
                        data.map(({ id, user, organization, module, venta, venta_id, products, inventarios, description, action, note, created_at }) => {
                            return (
                                <tr key={
                                    id
                                }
                                    className="hover:bg-gray-100 focus-within:bg-gray-100">
                                    <td className="w-px border-t">
                                        {moment(created_at).locale("es").calendar()}
                                    </td>
                                    {/* <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('registro.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {
                                                module
                                            } </InertiaLink>
                                    </td> */}
                                    {/* <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('registro.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {
                                                venta_id
                                            } </InertiaLink>
                                    </td>    */}
                                    {/* <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('registro.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {
                                                venta_id
                                            } </InertiaLink>
                                    </td> */}
                                    <td className="border-t">
                                        <InertiaLink href={route('registro.edit', id)}
                                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none">
                                            {
                                                description
                                            }
                                        </InertiaLink>
                                    </td>
                                    {/* <td className="border-t">
                                        <InertiaLink href={
                                            route('registro.edit', id)
                                        }
                                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none">
                                            {
                                                action
                                            }
                                        </InertiaLink>
                                    </td> */}
                                    <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('registro.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {note}
                                        </InertiaLink>
                                    </td>
                                    <td className="w-px border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('registro.edit', id)
                                            }
                                            className="flex items-center px-4 focus:outline-none">
                                        </InertiaLink>
                                    </td>

                                </tr>
                            );
                        })
                    }
                        {
                            data.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 border-t" colSpan="4">
                                        No existen registro.
                                    </td>
                                </tr>
                            )
                        } </tbody>
                </table>
            </div>
            <Pagination links={links} />
        </div>
    );
};

Index.layout = page => <Layout title="Registros"
    children={page} />;

export default Index;
