
import React from 'react';

import {
  Outlet
} from 'react-router-dom';

import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

import BarraLateralAdmin
  from '../../organisms/admin/BarraLateralAdmin';

// ==========================================
// ENLACES DEL PANEL ADMINISTRADOR
// ==========================================

const ENLACES = [

  {
    to: '/admin',
    texto: 'Dashboard',
    end: true
  },

  {
    to: '/admin/productos',
    texto: 'Productos'
  },

  // NUEVA OPCIÓN
  {
    to: '/admin/categorias',
    texto: 'Categorías'
  },

  {
    to: '/admin/stock-critico',
    texto: 'Stock crítico'
  },

  {
    to: '/admin/ordenes',
    texto: 'Órdenes'
  },

  {
    to: '/admin/usuarios',
    texto: 'Usuarios'
  },

  {
    to: '/admin/reportes',
    texto: 'Reportes'
  },

  {
    to: '/admin/perfil',
    texto: 'Perfil'
  }

];

// ==========================================
// PLANTILLA DEL ADMINISTRADOR
// ==========================================

function PlantillaAdmin() {

  return (

    <Container
      fluid="xl"
      className="py-4"
    >

      <Row>

        {/* MENÚ LATERAL */}

        <Col md={3} lg={2}>

          <BarraLateralAdmin
            enlaces={ENLACES}
          />

        </Col>

        {/* CONTENIDO DE LA PÁGINA */}

        <Col md={9} lg={10}>

          <Outlet />

        </Col>

      </Row>

    </Container>

  );
}

export default PlantillaAdmin;
