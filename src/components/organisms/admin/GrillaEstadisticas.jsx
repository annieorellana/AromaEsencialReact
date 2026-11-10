import React from 'react';

import {
  Row,
  Col
} from 'react-bootstrap';

import TarjetaEstadistica
  from '../../molecules/admin/TarjetaEstadistica';

import {
  dinero
} from '../../../utils/adminFormato';

// ==========================================
// ESTADOS QUE NO DEBEN CONTAR COMO VENTA
// ==========================================

const NO_CUENTAN = [
  'CANCELADA',
  'RECHAZADA'
];

function GrillaEstadisticas({
  productos = [],
  ordenes = [],
  usuarios = [],
  stockCritico = []
}) {

  // ========================================
  // NORMALIZAR ESTADOS
  // ========================================

  const estadoNormalizado = (
    estado
  ) =>
    String(
      estado || ''
    )
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');

  // ========================================
  // ÓRDENES VÁLIDAS PARA VENTAS
  // ========================================

  const ordenesValidas =
    ordenes.filter(
      (orden) =>
        !NO_CUENTAN.includes(
          estadoNormalizado(
            orden.estado
          )
        )
    );

  // ========================================
  // VENTAS ACUMULADAS
  // ========================================

  const ventas =
    ordenesValidas.reduce(
      (total, orden) =>
        total +
        Number(
          orden.total || 0
        ),
      0
    );

  // ========================================
  // ÓRDENES EN PROCESO
  // ========================================

  const enProceso =
    ordenes.filter(
      (orden) => {

        const estado =
          estadoNormalizado(
            orden.estado
          );

        return [
          'CONFIRMADA',
          'EN_PREPARACION',
          'ENVIADA'
        ].includes(
          estado
        );

      }
    ).length;

  // ========================================
  // ÓRDENES ENTREGADAS
  // ========================================

  const entregadas =
    ordenes.filter(
      (orden) =>
        estadoNormalizado(
          orden.estado
        ) ===
        'ENTREGADA'
    ).length;

  // ========================================
  // ÓRDENES CANCELADAS
  // ========================================

  const canceladas =
    ordenes.filter(
      (orden) =>
        estadoNormalizado(
          orden.estado
        ) ===
        'CANCELADA'
    ).length;

  // ========================================
  // VISTA
  // ========================================

  return (

    <Row className="g-3 mb-4">

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Productos"
          valor={
            productos.length
          }
          detalle="Registrados en el catálogo"
          to="/admin/productos"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Órdenes"
          valor={
            ordenes.length
          }
          detalle="Órdenes registradas"
          to="/admin/ordenes"
          variante="primary"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Ventas acumuladas"
          valor={
            dinero(
              ventas
            )
          }
          detalle="No incluye órdenes canceladas"
          to="/admin/ordenes"
          variante="success"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Stock crítico"
          valor={
            stockCritico.length
          }
          detalle="Productos por reponer"
          to="/admin/stock-critico"
          variante="danger"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="En proceso"
          valor={
            enProceso
          }
          detalle="Confirmadas, preparando o enviadas"
          to="/admin/ordenes"
          variante="warning"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Entregadas"
          valor={
            entregadas
          }
          detalle="Órdenes completadas"
          to="/admin/ordenes"
          variante="success"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Canceladas"
          valor={
            canceladas
          }
          detalle="Órdenes anuladas"
          to="/admin/ordenes"
          variante="danger"
        />

      </Col>

      <Col
        xs={12}
        sm={6}
        xl={3}
      >

        <TarjetaEstadistica
          titulo="Usuarios"
          valor={
            usuarios.length
          }
          detalle="Usuarios registrados"
          to="/admin/usuarios"
          variante="primary"
        />

      </Col>

    </Row>

  );
}

export default GrillaEstadisticas;