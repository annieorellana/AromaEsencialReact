import React from 'react';
import { Card } from 'react-bootstrap';
import FilaDato from '../../molecules/admin/FilaDato';
import { dinero } from '../../../utils/adminFormato';

function ResumenPagoOrden({ orden }) {
  const productos = orden.productos || [];
  const subtotal = orden.subtotal ?? productos.reduce((t, p) => t + Number(p.precio) * Number(p.cantidad), 0);
  return (
    <Card body className="mb-3">
      <dl className="row mb-0">
        <FilaDato etiqueta="Subtotal" valor={dinero(subtotal)} />
        <FilaDato etiqueta={orden.cupon ? `Descuento (${orden.cupon})` : 'Descuento'} valor={`-${dinero(orden.descuento)}`} />
        <FilaDato etiqueta="Despacho" valor={dinero(orden.costoEnvio)} />
        <FilaDato etiqueta="Total" valor={dinero(orden.total)} destacado />
        <FilaDato etiqueta="Método de pago" valor={orden.metodoPago || '—'} />
      </dl>
    </Card>
  );
}

export default ResumenPagoOrden;
