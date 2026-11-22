
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

import TablaOrdenesSeller
  from '../../components/organisms/seller/TablaOrdenesSeller';

import {
  useOrdenesConEstado
} from '../../hooks/useOrdenes';

import {
  ESTADOS_ORDEN
} from '../../utils/adminFormato';

// ==========================================
// NORMALIZAR ESTADO
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
// ÓRDENES DEL VENDEDOR
// SOLO CONSULTA
// ==========================================

function SellerOrdenes() {

  const {
    ordenes,
    cargando,
    error,
    reintentar
  } = useOrdenesConEstado();

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');

  // ========================================
  // ORDENAR Y FILTRAR
  // ========================================

  const visibles = [...ordenes]
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
          id="filtro-estado-vendedor"
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
          Consultando órdenes...
        </Alert>
      )}

      {/* ERRORES DE CONEXIÓN O PERMISOS */}

      {!cargando && error && (
        <Alert variant="danger">

          <strong>
            No fue posible consultar las órdenes.
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

      {/* VISTA DE SOLO LECTURA */}

      {!cargando && !error && (
        <TablaOrdenesSeller
          ordenes={visibles}
        />
      )}

    </PlantillaPagina>
  );
}

export default SellerOrdenes;
