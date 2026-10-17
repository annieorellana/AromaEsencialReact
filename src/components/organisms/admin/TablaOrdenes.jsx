import React from 'react';
import { Link } from 'react-router-dom';
import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import EstadoOrdenBadge from '../../molecules/admin/EstadoOrdenBadge';
import { dinero, fechaHora } from '../../../utils/adminFormato';

function TablaOrdenes({ ordenes }) {
  return (
    <TablaResponsiva encabezados={['N° orden', 'Fecha', 'Cliente', { texto: 'Total', className: 'text-end' }, 'Estado', '']}
      vacio={ordenes.length === 0} mensajeVacio="No hay órdenes para mostrar.">
      {ordenes.map((o) => (
        <tr key={o.id}>
          <td>{o.id}</td><td>{fechaHora(o.fecha)}</td><td>{o.cliente?.nombre} {o.cliente?.apellido}</td>
          <td className="text-end">{dinero(o.total)}</td><td><EstadoOrdenBadge estado={o.estado} /></td>
          <td className="text-end"><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-dark">Ver detalle</Link></td>
        </tr>
      ))}
    </TablaResponsiva>
  );
}

export default TablaOrdenes;
