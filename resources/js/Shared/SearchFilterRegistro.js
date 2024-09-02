import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { usePrevious } from 'react-use';
import SelectInput from '@/Shared/SelectInput';
import pickBy from 'lodash/pickBy';
import moment from 'moment';

export default ({actions, modules}) => {
  const { filters, auth, organizations } = usePage().props;
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    role: filters.role || '', 
    search: filters.search || '',
    organization: filters.organization || '',
    date : filters.date || '',
    module: filters.module || '',
    venta_id: filters.venta_id || '',
    action: filters.action || '',
  });

  const prevValues = usePrevious(values);

  function reset() {
    setValues({
      role: '',
      search: '',
      organization: '',
      date: '',
        module: '',
        venta_id: '',
        action: ''
    });
  }

  useEffect(() => {
    console.log(values)
    if (prevValues) {

      const query = Object.keys(pickBy(values)).length
        ? pickBy(values)
        : { remember: 'forget' };
      Inertia.get(route(route().current()), query, {
        replace: true,
        preserveState: true
      });
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
         <SelectInput
                className="w-full "
                value={values.module}
                onChange={e => setValues({...values, module: e.target.value})}
              >
                <option value="">Selecccione Modulo</option>
                {
                  modules.map((item, index)=>{
                    return(<option id={index} value={item}>{item}</option>)
                  })
                }              
        </SelectInput>

        <SelectInput
                className="w-full "
                value={values.action}
                onChange={e => setValues({...values, organization: e.target.value})}
              >
                <option value="">Seleccciona Accion</option>
                {
                  actions.map((action, index)=>{
                    return(<option value={index}>{action}</option>)
                  })
                }
        </SelectInput>

        <SelectInput
                className="w-full "
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
        
      </div>
      <button
        onClick={reset}
        className="ml-3 text-sm text-gray-600 hover:text-gray-700 focus:text-indigo-700 focus:outline-none"
        type="button"
      >
        Borrare
      </button>
    </div>
  );
};
