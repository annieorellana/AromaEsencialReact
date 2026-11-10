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

function TablaOrdenes({
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
        ''
      ]}
      vacio={
        ordenes.length === 0
      }
      mensajeVacio="No hay órdenes para mostrar."
    >

      {ordenes.map((orden) => {

        const nombreCliente =
          orden.nombreCliente ||
          [
            orden.cliente?.nombre,
            orden.cliente?.apellido
          ]
            .filter(Boolean)
            .join(' ') ||
          'Sin información';

        return (
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
              {nombreCliente}
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
                  `/admin/ordenes/${orden.id}`
                }
                className="btn btn-sm btn-outline-dark"
              >
                Ver detalle
              </Link>

            </td>

          </tr>
        );
      })}

    </TablaResponsiva>
  );
}

export default TablaOrdenes;