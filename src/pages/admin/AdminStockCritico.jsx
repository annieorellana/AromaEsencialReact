import React from 'react';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import TablaStockCritico from '../../components/organisms/admin/TablaStockCritico';
import useProductos from '../../hooks/useProductos';
import { obtenerProductosStockCritico } from '../../services/productoService';

function AdminStockCritico() {
  useProductos(); // suscribe la vista a los cambios de productos
  return (
    <PlantillaPagina titulo="Stock crítico" descripcion="Productos con stock igual o inferior a su umbral crítico.">
      <TablaStockCritico productos={obtenerProductosStockCritico()} />
    </PlantillaPagina>
  );
}

export default AdminStockCritico;
