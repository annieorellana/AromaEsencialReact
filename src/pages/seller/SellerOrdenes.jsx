import React, {
  useState
} from 'react';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import BarraFiltros
  from '../../components/molecules/admin/BarraFiltros';

import CampoFormulario
  from '../../components/molecules/admin/CampoFormulario';

import TablaOrdenesSeller
  from '../../components/organisms/seller/TablaOrdenesSeller';

import useOrdenes
  from '../../hooks/useOrdenes';

import {
  ESTADOS_ORDEN
} from '../../utils/adminFormato';

function SellerOrdenes() {
  const ordenes =
    useOrdenes();

  const [
    busqueda,
    setBusqueda
  ] = useState('');

  const [
    estado,
    setEstado
  ] = useState('');

  const visibles = [
    ...ordenes
  ]
    .sort(
      (a, b) =>
        String(
          b.fecha || ''
        ).localeCompare(
          String(
            a.fecha || ''
          )
        )
    )
    .filter(
      (orden) => {

        const coincideEstado =
          !estado ||
          orden.estado === estado;

        const texto = `
          ${orden.id || ''}
          ${orden.nombreCliente || ''}
          ${orden.correoCliente || ''}
        `
          .toLowerCase();

        const coincideBusqueda =
          texto.includes(
            busqueda
              .trim()
              .toLowerCase()
          );

        return (
          coincideEstado &&
          coincideBusqueda
        );
      }
    );

  return (
    <PlantillaPagina
      titulo="Órdenes"
    >

      <BarraFiltros
        busqueda={busqueda}
        onBusqueda={
          setBusqueda
        }
        placeholder="Buscar por N° de orden o cliente"
        etiqueta="Buscar órdenes"
      >

        <CampoFormulario
          id="filtro-estado-vendedor"
          etiqueta=""
          tipo="select"
          aria-label="Filtrar por estado"
          opciones={
            ESTADOS_ORDEN
          }
          placeholder="Todos los estados"
          valor={
            estado
          }
          onCambio={
            (e) =>
              setEstado(
                e.target.value
              )
          }
        />

      </BarraFiltros>

      <TablaOrdenesSeller
        ordenes={
          visibles
        }
      />

    </PlantillaPagina>
  );
}

export default SellerOrdenes;