import React from 'react';
import MainMenuItem from '@/Shared/MainMenuItem';

export default ({ className }) => {
  return (
    <div className={className}>
      <MainMenuItem text="Principal" link="dashboard" icon="dashboard" />
      <MainMenuItem text="Caja" link="ventas" icon="shopping-cart" />
      <MainMenuItem text="Caja Rápida" link="ventas_rapidas" icon="store-front" />
      <MainMenuItem text="Servicios" link="servicios" icon="apple" />
      <MainMenuItem text="Productos" link="products" icon="book" />
      <MainMenuItem text="Compañias" link="organizations" icon="office" />
      <MainMenuItem text="Usuarios" link="contacts" icon="users" />
      <MainMenuItem text="Reporte" link="reports" icon="printer" />
      <MainMenuItem text="Cierre Diario" link="reports" icon="location" />

    </div>
  );
};
