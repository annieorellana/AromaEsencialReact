import React from 'react';
import { Card } from 'react-bootstrap';
import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import { dinero, fechaHora } from '../../../utils/adminFormato';

// Cliente, despacho y productos/cantidades de la orden (modelo creado por Checkout).
function BoletaOrden({ orden }) {
  const c = orden.cliente || {};
  const productos = orden.productos || [];
  const retiro = c.envio === 'retiro';
  return (
    <>
      <Card body className="mb-3">
        <h2 className="h6">Cliente</h2>
        <p className="mb-0">{c.nombre} {c.apellido} · {c.correo}{c.telefono ? ` · ${c.telefono}` : ''}</p>
        <p className="text-muted small mb-0">
          {retiro ? 'Retiro en tienda' : [c.direccion, c.departamento, c.comuna, c.region].filter(Boolean).join(', ')} · {fechaHora(orden.fecha)}
        </p>
        {c.indicaciones && <p className="small mb-0">Indicaciones: {c.indicaciones}</p>}
      </Card>
      <TablaResponsiva hover={false} encabezados={['Producto', { texto: 'Precio', className: 'text-end' }, { texto: 'Cant.', className: 'text-end' }, { texto: 'Subtotal', className: 'text-end' }]}>
        {productos.map((p) => (
          <tr key={p.id}><td>{p.nombre}</td><td className="text-end">{dinero(p.precio)}</td><td className="text-end">{p.cantidad}</td><td className="text-end">{dinero(p.precio * p.cantidad)}</td></tr>
        ))}
      </TablaResponsiva>
    </>
  );
}

export default BoletaOrden;
