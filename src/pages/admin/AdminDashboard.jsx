import React from 'react';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import GrillaEstadisticas from '../../components/organisms/admin/GrillaEstadisticas';
import useProductos from '../../hooks/useProductos';
import useOrdenes from '../../hooks/useOrdenes';
import { obtenerUsuarios } from '../../services/authService';
import { obtenerProductosStockCritico } from '../../services/productoService';

function AdminDashboard() {
  const productos = useProductos();           // se actualiza solo (evento de productoService)
  const ordenes = useOrdenes();               // se actualiza solo (evento de orderService)
  const usuarios = obtenerUsuarios();
  const stockCritico = obtenerProductosStockCritico(); // lógica existente de productoService
  return (
    <PlantillaPagina titulo="Panel administrador" descripcion="Resumen de la actividad de AromaEsencial.">
      <GrillaEstadisticas productos={productos} ordenes={ordenes} usuarios={usuarios} stockCritico={stockCritico} />
    </PlantillaPagina>
  );
}

export default AdminDashboard;
