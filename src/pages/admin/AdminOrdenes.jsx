import React, { useState } from 'react';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import BarraFiltros from '../../components/molecules/admin/BarraFiltros';
import CampoFormulario from '../../components/molecules/admin/CampoFormulario';
import TablaOrdenes from '../../components/organisms/admin/TablaOrdenes';
import useOrdenes from '../../hooks/useOrdenes';
import { ESTADOS_ORDEN } from '../../utils/adminFormato';

function AdminOrdenes() {
  const ordenes = useOrdenes();
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const visibles = [...ordenes]
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
    .filter((o) => (!estado || o.estado === estado) &&
      `${o.id} ${o.cliente?.nombre} ${o.cliente?.apellido} ${o.cliente?.correo}`.toLowerCase().includes(busqueda.trim().toLowerCase()));
  return (
    <PlantillaPagina titulo="Órdenes">
      <BarraFiltros busqueda={busqueda} onBusqueda={setBusqueda} placeholder="Buscar por N° de orden o cliente" etiqueta="Buscar órdenes">
        <CampoFormulario id="filtro-estado" etiqueta="" tipo="select" aria-label="Filtrar por estado" opciones={ESTADOS_ORDEN}
          placeholder="Todos los estados" valor={estado} onCambio={(e) => setEstado(e.target.value)} />
      </BarraFiltros>
      <TablaOrdenes ordenes={visibles} />
    </PlantillaPagina>
  );
}

export default AdminOrdenes;
