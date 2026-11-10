import React from 'react';

import Badge
  from '../../atoms/Badge';

// ==========================================
// COLORES SEGÚN ESTADO DEL BACKEND
// ==========================================

const COLORES = {
  CONFIRMADA: 'info',
  EN_PREPARACION: 'warning',
  ENVIADA: 'primary',
  ENTREGADA: 'success',
  CANCELADA: 'danger',
  RECHAZADA: 'danger'
};

// ==========================================
// TEXTO AMIGABLE PARA MOSTRAR
// ==========================================

const ETIQUETAS = {
  CONFIRMADA: 'Confirmada',
  EN_PREPARACION: 'En preparación',
  ENVIADA: 'Enviada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
  RECHAZADA: 'Rechazada'
};

function EstadoOrdenBadge({
  estado
}) {
  const estadoNormalizado =
    String(
      estado || ''
    )
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');

  const color =
    COLORES[
      estadoNormalizado
    ] || 'secondary';

  const etiqueta =
    ETIQUETAS[
      estadoNormalizado
    ] ||
    estado ||
    'Sin estado';

  return (
    <span
      data-testid="estado-badge"
    >
      <Badge bg={color}>
        {etiqueta}
      </Badge>
    </span>
  );
}

export default EstadoOrdenBadge;