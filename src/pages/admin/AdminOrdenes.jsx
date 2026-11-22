
import React, { useState } from 'react';

import {
  Alert,
  Button,
  Spinner
} from 'react-bootstrap';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import BarraFiltros
  from '../../components/molecules/admin/BarraFiltros';

import CampoFormulario
  from '../../components/molecules/admin/CampoFormulario';

import TablaOrdenes
  from '../../components/organisms/admin/TablaOrdenes';

import {
  useOrdenesConEstado
} from '../../hooks/useOrdenes';

import {
  ESTADOS_ORDEN
} from '../../utils/adminFormato';

// ==========================================
// NORMALIZAR ESTADOS
// ==========================================

function normalizarEstado(valor) {
  return String(valor || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_');
}

// ==========================================
// ÓRDENES DEL ADMINISTRADOR
// ==========================================

function AdminOrdenes() {

  const {
    ordenes,
    cargando,
    error,
    reintentar
  } = useOrdenesConEstado();

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');

  // ========================================
  // ADAPTAR RESPUESTA DEL BACKEND
  // ========================================

  const ordenesAdaptadas = ordenes.map(
    (orden) => ({
      ...orden,

      cliente: orden.cliente || {
        nombre: orden.nombreCliente || '',
        apellido: '',
        correo: orden.correoCliente || ''
      },

      productos:
        orden.productos ||
        orden.detalles ||
        []
    })
  );

  // ========================================
  // ORDENAR Y FILTRAR
  // ========================================

  const visibles = [...ordenesAdaptadas]
    .sort((a, b) =>
      String(b.fecha || '').localeCompare(
        String(a.fecha || '')
      )
    )
    .filter((orden) => {

      const coincideEstado =
        !estado ||
        normalizarEstado(orden.estado) ===
          normalizarEstado(estado);

      const texto = [
        orden.id,
        orden.nombreCliente,
        orden.correoCliente,
        orden.cliente?.nombre,
        orden.cliente?.apellido,
        orden.cliente?.correo
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        coincideEstado &&
        texto.includes(
          busqueda.trim().toLowerCase()
        )
      );
    });

  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <PlantillaPagina titulo="Órdenes">

      <BarraFiltros
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        placeholder="Buscar por N° de orden o cliente"
        etiqueta="Buscar órdenes"
      >

        <CampoFormulario
          id="filtro-estado"
          etiqueta=""
          tipo="select"
          opciones={ESTADOS_ORDEN}
          placeholder="Todos los estados"
          valor={estado}
          onCambio={(evento) =>
            setEstado(evento.target.value)
          }
        />

      </BarraFiltros>

      {/* CARGANDO */}

      {cargando && (
        <Alert variant="info">
          <Spinner
            animation="border"
            size="sm"
            className="me-2"
          />
          Consultando órdenes en MySQL...
        </Alert>
      )}

      {/* ERROR REAL DE LA API */}

      {!cargando && error && (
        <Alert variant="danger">

          <strong>
            No fue posible cargar las órdenes.
          </strong>

          <div className="mt-2">
            {error}
          </div>

          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            className="mt-3"
            onClick={reintentar}
          >
            Reintentar consulta
          </Button>

        </Alert>
      )}

      {/* RESULTADOS */}

      {!cargando && !error && (
        <TablaOrdenes
          ordenes={visibles}
        />
      )}

    </PlantillaPagina>
  );
}

export default AdminOrdenes;
