import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TarjetaEstadistica({ titulo, valor, detalle, to, variante = 'dark' }) {
  const tarjeta = (
    <Card className={`h-100 shadow-sm border-${variante}`}>
      <Card.Body>
        <Card.Subtitle className="text-muted small mb-1">{titulo}</Card.Subtitle>
        <p className={`display-6 fw-semibold mb-1 text-${variante}`} data-testid="stat-valor">{valor}</p>
        {detalle && <Card.Text className="small mb-0">{detalle}</Card.Text>}
      </Card.Body>
    </Card>
  );
  return to ? <Link to={to} className="text-decoration-none text-reset">{tarjeta}</Link> : tarjeta;
}

export default TarjetaEstadistica;
