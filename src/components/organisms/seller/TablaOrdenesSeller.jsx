import React from 'react';

import {
  Link
} from 'react-router-dom';

import TablaResponsiva
  from '../../molecules/admin/TablaResponsiva';

import EstadoOrdenBadge
  from '../../molecules/admin/EstadoOrdenBadge';

import {
  dinero,
  fechaHora
} from '../../../utils/adminFormato';

function TablaOrdenesSeller({
  ordenes = []
}) {
  return (
    <TablaResponsiva
      encabezados={[
        'N° orden',
        'Fecha',
        'Cliente',
        {
          texto: 'Total',
          className: 'text-end'
        },
        'Estado',
        {
          texto: 'Acciones',
          className: 'text-end'
        }
      ]}
      vacio={
        ordenes.length === 0
      }
      mensajeVacio="No hay órdenes para mostrar."
    >

      {ordenes.map(
        (orden) => (

          <tr key={orden.id}>

            <td>
              {orden.id}
            </td>

            <td>
              {fechaHora(
                orden.fecha
              )}
            </td>

            <td>
              {orden.nombreCliente ||
                orden.cliente?.nombre ||
                'Sin información'}
            </td>

            <td className="text-end">
              {dinero(
                orden.total
              )}
            </td>

            <td>
              <EstadoOrdenBadge
                estado={
                  orden.estado
                }
              />
            </td>

            <td className="text-end">

              <Link
                to={
                  `/vendedor/ordenes/${orden.id}`
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

export default TablaOrdenesSeller;