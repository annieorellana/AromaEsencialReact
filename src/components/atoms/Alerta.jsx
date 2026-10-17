import React from 'react';
import { Alert } from 'react-bootstrap';

function Alerta({ variant = 'info', className = '', children, ...resto }) {
  return <Alert variant={variant} className={className} {...resto}>{children}</Alert>;
}

export default Alerta;
