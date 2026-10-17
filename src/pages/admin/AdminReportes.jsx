import React from 'react';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import ResumenReportes from '../../components/organisms/admin/ResumenReportes';
import useOrdenes from '../../hooks/useOrdenes';

function AdminReportes() {
  const ordenes = useOrdenes();
  return (
    <PlantillaPagina titulo="Reportes" descripcion="Indicadores calculados a partir de las órdenes registradas.">
      <ResumenReportes ordenes={ordenes} />
    </PlantillaPagina>
  );
}

export default AdminReportes;
