import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

// Búsqueda de texto + (opcional) un filtro adicional como children.
function BarraFiltros({ busqueda, onBusqueda, placeholder, etiqueta, children }) {
  return (
    <Row className="g-2 mb-3">
      <Col md={children ? 8 : 12}>
        <Form.Control placeholder={placeholder} aria-label={etiqueta || placeholder} value={busqueda} onChange={(e) => onBusqueda(e.target.value)} />
      </Col>
      {children && <Col md={4}>{children}</Col>}
    </Row>
  );
}

export default BarraFiltros;
