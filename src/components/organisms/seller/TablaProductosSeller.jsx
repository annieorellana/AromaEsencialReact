import React from 'react';

import {
  Link
} from 'react-router-dom';

import TablaResponsiva
  from '../../molecules/admin/TablaResponsiva';

import Badge
  from '../../atoms/Badge';

import {
  dinero
} from '../../../utils/adminFormato';

function TablaProductosSeller({
  productos = []
}) {
  return (
    <TablaResponsiva
      encabezados={[
        'Código',
        'Nombre',
        'Categoría',
        {
          texto: 'Precio',
          className: 'text-end'
        },
        {
          texto: 'Stock',
          className: 'text-end'
        },
        'Oferta',
        {
          texto: 'Acciones',
          className: 'text-end'
        }
      ]}
      vacio={
        productos.length === 0
      }
      mensajeVacio="No hay productos para mostrar."
    >

      {productos.map(
        (producto) => (

          <tr key={producto.id}>

            <td>
              {producto.codigo}
            </td>

            <td>
              {producto.nombre}
            </td>

            <td>
              {producto.categoria}
            </td>

            <td className="text-end">
              {dinero(
                producto.precio
              )}
            </td>

            <td className="text-end">
              {producto.stock}
            </td>

            <td>
              {producto.oferta
                ? (
                  <Badge bg="warning">
                    Oferta
                  </Badge>
                )
                : '—'}
            </td>

            <td className="text-end">

              <Link
                to={
                  `/vendedor/productos/${producto.id}`
                }
                className="btn btn-sm btn-outline-dark"
              >
                Ver detalle
              </Link>

            </td>

          </tr>

        )
      )}

    </TablaResponsiva>
  );
}

export default TablaProductosSeller;