import React from 'react';

import {
  Card
} from 'react-bootstrap';

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

function OrdenesRecientesDashboard({
  ordenes = []
}) {

  // ========================================
  // ÚLTIMAS 5 ÓRDENES
  // ========================================

  const recientes = [
    ...ordenes
  ]
    .sort(
      (a, b) =>
        new Date(
          b.fecha || 0
        ) -
        new Date(
          a.fecha || 0
        )
    )
    .slice(0, 5);

  return (

    <Card className="shadow-sm mb-4">

      <Card.Header
        className="bg-white d-flex justify-content-between align-items-center"
      >

        <div>

          <h2 className="h5 mb-1">
            Órdenes recientes
          </h2>

          <small className="text-muted">
            Últimas órdenes registradas
            en el sistema.
          </small>

        </div>

        <Link
          to="/admin/ordenes"
          className="btn btn-sm btn-outline-dark"
        >
          Ver todas
        </Link>

      </Card.Header>

      <Card.Body>

        <TablaResponsiva
          encabezados={[
            'N°',
            'Fecha',
            'Cliente',
            'Estado',
            {
              texto: 'Total',
              className: 'text-end'
            },
            {
              texto: '',
              className: 'text-end'
            }
          ]}
          vacio={
            recientes.length === 0
          }
          mensajeVacio="Todavía no existen órdenes registradas."
        >

          {recientes.map(
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

                  <div className="fw-semibold">

                    {orden.nombreCliente ||
                      orden.cliente?.nombre ||
                      'Sin información'}

                  </div>

                  {orden.correoCliente && (

                    <small className="text-muted">
                      {
                        orden.correoCliente
                      }
                    </small>

                  )}

                </td>

                <td>

                  <EstadoOrdenBadge
                    estado={
                      orden.estado
                    }
                  />

                </td>

                <td className="text-end fw-semibold">

                  {dinero(
                    orden.total || 0
                  )}

                </td>

                <td className="text-end">

                  <Link
                    to={
                      `/admin/ordenes/${orden.id}`
                    }
                    className="btn btn-sm btn-outline-dark"
                  >
                    Ver
                  </Link>

                </td>

              </tr>

            )
          )}

        </TablaResponsiva>

      </Card.Body>

    </Card>

  );
}

export default OrdenesRecientesDashboard;