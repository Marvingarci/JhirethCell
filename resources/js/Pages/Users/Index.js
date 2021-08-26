import React, {useRef} from 'react';
import {InertiaLink, usePage} from '@inertiajs/inertia-react';
import Layout from '@/Shared/Layout';
import Icon from '@/Shared/Icon';
import SearchFilter from '@/Shared/SearchFilter';
import Pagination from '@/Shared/Pagination';


import Permissions from './Permissions';
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from '@material-ui/icons/LockOpen';

const Index = () => {
    const {users} = usePage().props;
    const {data, meta: {
            links
        }} = users;


    const dialogPermissions = useRef();
    const showPermissions = (user) => {
        dialogPermissions.current.showPermissions(user);
    };

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold">Usuarios</h1>
            <div className="flex items-center justify-between mb-6">
                <Permissions ref={dialogPermissions}/>
                <SearchFilter/>
                <InertiaLink className="btn-indigo focus:outline-none"
                    href={
                        route('users.create')
                }>
                    <span>Nuevo</span>{" "}
                    <span className="hidden md:inline">
                        Usuario</span>
                </InertiaLink>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Nombre</th>
                            <th className="px-6 pt-5 pb-4">Correo</th>
                            <th className="px-6 pt-5 pb-4" colSpan="2">
                                Rol
                            </th>
                        </tr>
                    </thead>
                    <tbody> {
                        data.map(user => {
                            return (
                                <tr key={
                                        user.id
                                    }
                                    className="hover:bg-gray-100 focus-within:bg-gray-100">
                                    <td className="border-t">
                                        <InertiaLink href={
                                                route('users.edit', user.id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none">
                                            {
                                            user.photo && (
                                                <img src={
                                                        user.photo
                                                    }
                                                    className="block w-5 h-5 mr-2 -my-2 rounded-full"/>
                                            )
                                        }
                                            {
                                            user.name
                                        }
                                            {
                                            user.deleted_at && (
                                                <Icon name="trash" className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"/>
                                            )
                                        } </InertiaLink>
                                    </td>
                                    <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('users.edit', user.id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {
                                            user.email
                                        } </InertiaLink>
                                    </td>
                                    <td className="border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('users.edit', user.id)
                                            }
                                            className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none">
                                            {
                                            user.owner ? 'Owner' : 'User'
                                        } </InertiaLink>
                                    </td>
                                    <td className="w-px border-t">
                                        <IconButton className="focus:outline-none"
                                            onClick={
                                                () => showPermissions(user)
                                        }>
                                            <LockOpenIcon/>
                                        </IconButton>
                                    </td>
                                    <td className="w-px border-t">
                                        <InertiaLink tabIndex="-1"
                                            href={
                                                route('users.edit', user.id)
                                            }
                                            className="flex items-center px-4 focus:outline-none">
                                            <Icon name="cheveron-right" className="block w-6 h-6 text-gray-400 fill-current"/>
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
                                    No users found.
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

Index.layout = page => <Layout title="Users"
    children={page}/>;

export default Index;
