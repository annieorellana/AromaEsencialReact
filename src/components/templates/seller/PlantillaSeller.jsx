import React from 'react';

import {
  Outlet
} from 'react-router-dom';

import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

import BarraLateralSeller
  from '../../organisms/seller/BarraLateralSeller';

// ==========================================
// ENLACES DISPONIBLES PARA EL VENDEDOR
// ==========================================

const ENLACES = [
  {
    to: '/vendedor/productos',
    texto: 'Productos'
  },
  {
    to: '/vendedor/ordenes',
    texto: 'Órdenes'
  }
];

// ==========================================
// PLANTILLA DEL MÓDULO VENDEDOR
// ==========================================

function PlantillaSeller() {

  return (

    <Container
      fluid="xl"
      className="py-4"
    >

      <Row>

        <Col
          md={3}
          lg={2}
        >

          <BarraLateralSeller
            enlaces={
              ENLACES
            }
          />

        </Col>

        <Col
          md={9}
          lg={10}
        >

          <Outlet />

        </Col>

      </Row>

    </Container>

  );
}

export default PlantillaSeller;