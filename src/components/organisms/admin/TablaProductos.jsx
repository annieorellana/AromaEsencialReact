import React from 'react';
import { Link } from 'react-router-dom';
import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import Button from '../../atoms/Button';
import Badge from '../../atoms/Badge';
import { dinero } from '../../../utils/adminFormato';

// `criticosIds` proviene de obtenerProductosStockCritico() (productoService): aquí no se recalcula.
function TablaProductos({ productos, criticosIds = new Set(), onEliminar }) {
  return (
    <TablaResponsiva
      encabezados={['Código', 'Nombre', 'Categoría', { texto: 'Precio', className: 'text-end' }, { texto: 'Stock', className: 'text-end' }, 'Oferta', { texto: 'Acciones', className: 'text-end' }]}
      vacio={productos.length === 0} mensajeVacio="No hay productos que coincidan.">
      {productos.map((p) => (
        <tr key={p.id}>
          <td>{p.codigo}</td><td>{p.nombre}</td><td>{p.categoria}</td>
          <td className="text-end">{dinero(p.precio)}</td>
          <td className="text-end">{p.stock} {criticosIds.has(p.id) && <Badge bg="danger">Crítico</Badge>}</td>
          <td>{p.oferta ? <Badge bg="warning">Oferta</Badge> : '—'}</td>
          <td className="text-end text-nowrap">
            <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-dark me-1">Editar</Link>
            <Button variant="outline-danger" className="btn-sm" onClick={() => onEliminar(p)}>Eliminar</Button>
          </td>
        </tr>
      ))}
    </TablaResponsiva>
  );
}

export default TablaProductos;
