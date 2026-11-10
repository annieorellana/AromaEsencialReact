import React, {
  useState
} from 'react';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import BarraFiltros
  from '../../components/molecules/admin/BarraFiltros';

import CampoFormulario
  from '../../components/molecules/admin/CampoFormulario';

import TablaOrdenes
  from '../../components/organisms/admin/TablaOrdenes';

import useOrdenes
  from '../../hooks/useOrdenes';

import {
  ESTADOS_ORDEN
} from '../../utils/adminFormato';

function AdminOrdenes() {
  // ========================================
  // ÓRDENES DESDE EL BACKEND
  // ========================================

  const ordenes = useOrdenes();

  // ========================================
  // FILTROS
  // ========================================

  const [
    busqueda,
    setBusqueda
  ] = useState('');

  const [
    estado,
    setEstado
  ] = useState('');

  // ========================================
  // NORMALIZAR ESTADOS
  // ========================================

  const normalizarEstado = (valor) =>
    String(valor || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');

  // ========================================
  // ADAPTAR BOLETAS DEL BACKEND
  // ========================================
  //
  // El backend devuelve:
  //
  // nombreCliente
  // correoCliente
  // detalles
  //
  // Algunas piezas antiguas del frontend
  // todavía pueden esperar:
  //
  // cliente.nombre
  // cliente.correo
  // productos
  //
  // Esta adaptación mantiene compatibilidad
  // mientras conectamos todo el módulo.
  // ========================================

  const ordenesAdaptadas =
    ordenes.map((orden) => ({
      ...orden,

      cliente:
        orden.cliente || {
          nombre:
            orden.nombreCliente || '',

          apellido:
            '',

          correo:
            orden.correoCliente || ''
        },

      productos:
        orden.productos ||
        orden.detalles ||
        []
    }));

  // ========================================
  // ORDENAR Y FILTRAR
  // ========================================

  const visibles = [
    ...ordenesAdaptadas
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
    .filter((orden) => {
      // FILTRO POR ESTADO
      const coincideEstado =
        !estado ||
        normalizarEstado(
          orden.estado
        ) ===
        normalizarEstado(
          estado
        );

      // FILTRO POR BÚSQUEDA
      const textoBusqueda = `
        ${orden.id || ''}
        ${orden.nombreCliente || ''}
        ${orden.correoCliente || ''}
        ${orden.cliente?.nombre || ''}
        ${orden.cliente?.apellido || ''}
        ${orden.cliente?.correo || ''}
      `
        .toLowerCase();

      const coincideBusqueda =
        textoBusqueda.includes(
          busqueda
            .trim()
            .toLowerCase()
        );

      return (
        coincideEstado &&
        coincideBusqueda
      );
    });

  // ========================================
  // VISTA
  // ========================================

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
          id="filtro-estado"
          etiqueta=""
          tipo="select"
          aria-label="Filtrar por estado"
          opciones={
            ESTADOS_ORDEN
          }
          placeholder="Todos los estados"
          valor={estado}
          onCambio={
            (e) =>
              setEstado(
                e.target.value
              )
          }
        />

      </BarraFiltros>

      <TablaOrdenes
        ordenes={
          visibles
        }
      />

    </PlantillaPagina>
  );
}

export default AdminOrdenes;