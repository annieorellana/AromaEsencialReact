import React from 'react';

function Price({ value }) {
  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);

  return <span className="fw-bold fs-5">{precioFormateado}</span>;
}

export default Price;