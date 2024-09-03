import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { usePrevious } from 'react-use';
import SelectInput from '@/Shared/SelectInput';
import pickBy from 'lodash/pickBy';
import moment from 'moment';

export default ({show_orga = false, show_date = false, show_month = false, user_id = 1}) => {
  const { filters, auth, organizations } = usePage().props;
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    role: filters.role || '', // role is used only on users page
    search: filters.search || '',
    trashed: filters.trashed || '',
    organization: filters.organization || auth.user.organization_id,
    date : filters.date || '',
    month : filters.month || moment().format('YYYY-MM')
  });

  const prevValues = usePrevious(values);

  function reset() {
    setValues({
      role: '',
      search: '',
      trashed: '',
      organization: auth.user.organization_id,
      date: moment().format('YYYY-MM-DD'),
      month: moment().format('YYYY-MM')
    });
  }

  useEffect(() => {
    console.log(values)
    if (prevValues) {

      const query = Object.keys(pickBy(values)).length
        ? pickBy(values)
        : { remember: 'forget' };
      console.log(route(route().current()))
      // if route is users.edit we need to send the user id to the route, this would be the path "users/{user}/edit"
      // take account the route().current() returns a Router object
     if(route(route().current()).name == 'users.edit'){
      // use the user_id prop to send the user id
      Inertia.get(route(route().current(), user_id), query, {
        replace: true,
        preserveState: true
      });
    } else {
      Inertia.get(route(route().current()), query, {
        replace: true,
        preserveState: true
      });
    }
    }
  }, [values]);

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;

    setValues(values => ({
      ...values,
      [key]: value
    }));

    if (opened) setOpened(false);
  }

  return (
    <div className="flex items-center w-full mr-4 rounded-xl">
      <div className="relative flex justify-between w-full bg-white rounded-xl shadow p-5 items-center space-x-2 ">
      <input
          className="relative w-full px-6 py-3 form-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoComplete="off"
          autoFocus
          type="text"
          name="search"
          value={values.search}
          onChange={handleChange}
          placeholder="Buscar..."
        />
        {
          show_orga &&
         <SelectInput
                className="w-full "
                disabled={!auth.user.owner}
                value={values.organization}
                onChange={e => setValues({...values, organization: e.target.value})}
              >
                <option value="">Seleccciona Tienda</option>
                {
                  organizations.map(orga=>{
                    return(<option value={orga.id}>{orga.name}</option>)
                  })
                }              
        </SelectInput>
        }
        {
          show_date &&
          <input
          className="relative w-full px-6 py-3 form-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoComplete="off"
          autoFocus
          type="date"
          name="date"
          value={values.date}
          onChange={handleChange}
          placeholder="Fecha"
        />
        }
        {
          show_month &&
          <input
          className="relative w-full px-6 py-3 form-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoComplete="off"
          autoFocus
          type="month"
          name="month"
          value={values.month}
          onChange={handleChange}
          placeholder="Mes"
          />
        }
      </div>
      <button
        onClick={reset}
        className="ml-3 text-sm text-gray-600 hover:text-gray-700 focus:text-indigo-700 focus:outline-none"
        type="button"
      >
        Borrar
      </button>
    </div>
  );
};
