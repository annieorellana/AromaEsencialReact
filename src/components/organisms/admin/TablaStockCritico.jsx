import React from 'react';
import { Link } from 'react-router-dom';
import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import Alerta from '../../atoms/Alerta';

function TablaStockCritico({ productos }) {
  if (productos.length === 0) return <Alerta variant="success">Todos los productos tienen stock suficiente.</Alerta>;
  return (
    <TablaResponsiva hover={false}
      encabezados={['Código', 'Producto', { texto: 'Stock', className: 'text-end' }, { texto: 'Umbral', className: 'text-end' }, '']}>
      {productos.map((p) => (
        <tr key={p.id} className="table-danger">
          <td>{p.codigo}</td><td>{p.nombre}</td>
          <td className="text-end fw-semibold">{p.stock}</td><td className="text-end">{p.stockCritico}</td>
          <td className="text-end"><Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-dark">Reponer</Link></td>
        </tr>
      ))}
    </TablaResponsiva>
  );
}

export default TablaStockCritico;
