import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TarjetaEstadistica from '../../molecules/admin/TarjetaEstadistica';
import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import { dinero } from '../../../utils/adminFormato';

const NO_CUENTAN = ['Cancelada', 'Rechazada'];

// Calcula métricas solo a partir de las órdenes recibidas (no guarda datos propios).
export function calcularReportes(ordenes) {
  const validas = ordenes.filter((o) => !NO_CUENTAN.includes(o.estado));
  const ventas = validas.reduce((t, o) => t + Number(o.total || 0), 0);
  const porEstado = ordenes.reduce((acc, o) => ({ ...acc, [o.estado || 'Sin estado']: (acc[o.estado || 'Sin estado'] || 0) + 1 }), {});
  const vendidos = {};
  validas.forEach((o) => (o.productos || []).forEach((p) => {
    vendidos[p.id] = { nombre: p.nombre, unidades: (vendidos[p.id]?.unidades || 0) + Number(p.cantidad || 0) };
  }));
  const masVendidos = Object.values(vendidos).sort((a, b) => b.unidades - a.unidades).slice(0, 5);
  return { ventas, ticketPromedio: validas.length ? Math.round(ventas / validas.length) : 0, porEstado, masVendidos };
}

function ResumenReportes({ ordenes }) {
  const r = calcularReportes(ordenes);
  return (
    <>
      <Row className="g-3 mb-4">
        <Col md={4}><TarjetaEstadistica titulo="Ventas acumuladas" valor={dinero(r.ventas)} detalle="Sin órdenes canceladas" variante="primary" /></Col>
        <Col md={4}><TarjetaEstadistica titulo="Ticket promedio" valor={dinero(r.ticketPromedio)} /></Col>
        <Col md={4}><TarjetaEstadistica titulo="Órdenes" valor={ordenes.length} variante="success" /></Col>
      </Row>
      <Row className="g-3">
        <Col lg={6}>
          <h2 className="h6">Órdenes por estado</h2>
          <TablaResponsiva hover={false} encabezados={['Estado', { texto: 'Cantidad', className: 'text-end' }]} vacio={Object.keys(r.porEstado).length === 0} mensajeVacio="Aún no hay órdenes.">
            {Object.entries(r.porEstado).map(([estado, n]) => <tr key={estado}><td>{estado}</td><td className="text-end">{n}</td></tr>)}
          </TablaResponsiva>
        </Col>
        <Col lg={6}>
          <h2 className="h6">Productos más vendidos</h2>
          <TablaResponsiva hover={false} encabezados={['Producto', { texto: 'Unidades', className: 'text-end' }]} vacio={r.masVendidos.length === 0} mensajeVacio="Aún no hay ventas.">
            {r.masVendidos.map((p) => <tr key={p.nombre}><td>{p.nombre}</td><td className="text-end">{p.unidades}</td></tr>)}
          </TablaResponsiva>
        </Col>
      </Row>
    </>
  );
}

export default ResumenReportes;
