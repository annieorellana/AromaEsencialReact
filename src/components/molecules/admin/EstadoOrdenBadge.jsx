import React from 'react';
import Badge from '../../atoms/Badge';

const COLORES = { Confirmada: 'info', 'En preparación': 'warning', Enviada: 'primary', Entregada: 'success', Cancelada: 'danger', Rechazada: 'danger' };

function EstadoOrdenBadge({ estado }) {
  return <span data-testid="estado-badge"><Badge bg={COLORES[estado] || 'secondary'}>{estado || 'Sin estado'}</Badge></span>;
}

export default EstadoOrdenBadge;
