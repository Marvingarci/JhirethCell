import React, {useRef, useState} from 'react';
import {InertiaLink, usePage} from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';
import moment from 'moment';

const Index = () => {
    const {gastos, organizations, auth} = usePage().props;
    const {data, meta: {
            links
        }} = gastos;
    const [organization, setOrganization] = useState(auth.user.organization_id);

    const buscarPorFecha =()=>{
        Inertia.post(route('reports.diarioPorDia'), {day: fecha, organization : organization} ,{
            onSuccess: page => {
              console.log(page)
            },
            onError: error => {
              console.log(error);
            }
          }
        );
      }

    const dialogPermissions = useRef();
    const showPermissions = (user) => {
        dialogPermissions.current.showPermissions(user);
    };

    console.log(data)

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold">Gastos</h1>
            <div className="flex items-center justify-between mb-6">
                <SearchFilter show_date={true} show_orga={true} organizations={organizations} />
                <InertiaLink className="btn-indigo focus:outline-none"
                    href={
                        route('gastos.create')
                }>
                    <span>Nuevo</span>{" "}
                    <span className="hidden md:inline">
                        Gasto</span>
                </InertiaLink>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Emisor</th>
                            <th className="px-6 pt-5 pb-4">Titulo</th>
                            <th className="px-6 pt-5 pb-4">Descripcion</th>
                            <th className="px-6 pt-5 pb-4">Total</th>
                            <th className="px-6 pt-5 pb-4">Fecha</th>
                            <th className="px-6 pt-5 pb-4" colSpan="2">
                                
                            </th>
                        </tr>
                    </thead>
                    <tbody> {
                        data.map(({id, title, description, total, vendedor_name, created_at}) => {
                            return (
                                <tr key={
                                        id
                                    }
                                    className="hover:bg-gray-100 focus-within:bg-gray-100">
                                    <td className="border-t">
                                        <InertiaLink href={
                                                route('gastos.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none">
                                            {
                                            vendedor_name
                                        }
                                         </InertiaLink>
                                    </td>
                                    <td className="border-t">
                                        <InertiaLink href={
                                                route('gastos.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none">
                                            {
                                            title
                                        }
                                         </InertiaLink>
                                    </td>
                                    <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('gastos.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {description} 
                                            </InertiaLink>
                                    </td>
                                    <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('gastos.edit', id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {
                                            total
                                        } </InertiaLink>
                                    </td>
                                    <td className="w-px border-t">
                                        {moment(created_at).locale("es").calendar()}
                                    </td>
                                    <td className="w-px border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('gastos.edit', id)
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
                                    No existen gastos.
                                </td>
                            </tr>
                        )
                    } </tbody>
                </table>
            </div>
            <Pagination links={links}/>
        </div>
    );
};

Index.layout = page => <Layout title="gastos"
    children={page}/>;

export default Index;
