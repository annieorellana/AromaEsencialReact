import React from 'react';
import { Form } from 'react-bootstrap';

// Etiqueta + control (texto, número, textarea, select o interruptor) + mensaje de error.
function CampoFormulario({ id, etiqueta, error, tipo = 'text', opciones = [], placeholder, valor, onCambio, ...extra }) {
  if (tipo === 'switch') {
    return (
      <Form.Group className="mb-3" controlId={id}>
        <Form.Check type="switch" label={etiqueta} checked={!!valor} onChange={onCambio} {...extra} />
      </Form.Group>
    );
  }
  const control = tipo === 'select' ? (
    <Form.Select value={valor} onChange={onCambio} isInvalid={!!error} {...extra}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
    </Form.Select>
  ) : (
    <Form.Control as={tipo === 'textarea' ? 'textarea' : 'input'} type={tipo === 'textarea' ? undefined : tipo}
      value={valor} onChange={onCambio} placeholder={placeholder} isInvalid={!!error} {...extra} />
  );
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      {control}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}

export default CampoFormulario;
