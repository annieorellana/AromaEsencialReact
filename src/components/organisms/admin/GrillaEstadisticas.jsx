import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TarjetaEstadistica from '../../molecules/admin/TarjetaEstadistica';
import { dinero } from '../../../utils/adminFormato';

const NO_CUENTAN = ['Cancelada', 'Rechazada'];

function GrillaEstadisticas({ productos, ordenes, usuarios, stockCritico }) {
  const ventas = ordenes.filter((o) => !NO_CUENTAN.includes(o.estado)).reduce((t, o) => t + Number(o.total || 0), 0);
  return (
    <Row className="g-3 mb-4">
      <Col xs={6} lg={3}><TarjetaEstadistica titulo="Productos" valor={productos.length} detalle="Publicados en la tienda" to="/admin/productos" /></Col>
      <Col xs={6} lg={3}><TarjetaEstadistica titulo="Órdenes" valor={ordenes.length} detalle={`Ventas: ${dinero(ventas)}`} to="/admin/ordenes" variante="primary" /></Col>
      <Col xs={6} lg={3}><TarjetaEstadistica titulo="Usuarios" valor={usuarios.length} detalle="Registrados" to="/admin/usuarios" variante="success" /></Col>
      <Col xs={6} lg={3}><TarjetaEstadistica titulo="Stock crítico" valor={stockCritico.length} detalle="Productos por reponer" to="/admin/stock-critico" variante="danger" /></Col>
    </Row>
  );
}

export default GrillaEstadisticas;
