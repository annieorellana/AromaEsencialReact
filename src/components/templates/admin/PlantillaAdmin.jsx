import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import BarraLateralAdmin from '../../organisms/admin/BarraLateralAdmin';

const ENLACES = [
  { to: '/admin', texto: 'Dashboard', end: true },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/stock-critico', texto: 'Stock crítico' },
  { to: '/admin/ordenes', texto: 'Órdenes' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
  { to: '/admin/reportes', texto: 'Reportes' },
  { to: '/admin/perfil', texto: 'Perfil' },
];

// Estructura de todas las vistas /admin: menú lateral + contenido. Se muestra bajo el navbar público.
function PlantillaAdmin() {
  return (
    <Container fluid="xl" className="py-4">
      <Row>
        <Col md={3} lg={2}><BarraLateralAdmin enlaces={ENLACES} /></Col>
        <Col md={9} lg={10}><Outlet /></Col>
      </Row>
    </Container>
  );
}

export default PlantillaAdmin;
