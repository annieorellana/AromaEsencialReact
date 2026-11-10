import React from 'react';

import {
  Card
} from 'react-bootstrap';

import TablaResponsiva
  from '../../molecules/admin/TablaResponsiva';

import {
  dinero,
  fechaHora
} from '../../../utils/adminFormato';

function BoletaOrden({
  orden
}) {
  // ========================================
  // DATOS DEL CLIENTE
  // ========================================

  const nombreCliente =
    orden.nombreCliente ||
    [
      orden.cliente?.nombre,
      orden.cliente?.apellido
    ]
      .filter(Boolean)
      .join(' ') ||
    'Sin información';

  const correoCliente =
    orden.correoCliente ||
    orden.cliente?.correo ||
    'Sin información';

  const telefono =
    orden.telefono ||
    orden.cliente?.telefono ||
    '';

  // ========================================
  // DATOS DE ENTREGA
  // ========================================

  const metodoEnvio =
    orden.metodoEnvio ||
    orden.cliente?.envio ||
    '';

  const retiro =
    String(
      metodoEnvio
    ).toLowerCase() ===
    'retiro';

  const direccion =
    orden.direccionEnvio ||
    orden.cliente?.direccion ||
    '';

  const comuna =
    orden.comuna ||
    orden.cliente?.comuna ||
    '';

  const region =
    orden.region ||
    orden.cliente?.region ||
    '';

  // ========================================
  // PRODUCTOS
  // ========================================

  const productos =
    Array.isArray(
      orden.detalles
    )
      ? orden.detalles.map(
          (detalle) => ({
            id:
              detalle.detalleId ||
              detalle.id,

            productoId:
              detalle.productoId,

            codigo:
              detalle.codigoProducto,

            nombre:
              detalle.nombreProducto,

            cantidad:
              detalle.cantidad,

            precio:
              detalle.precioUnitario,

            subtotal:
              detalle.subtotal
          })
        )
      : (
          Array.isArray(
            orden.productos
          )
            ? orden.productos
            : []
        );

  // ========================================
  // VISTA
  // ========================================

  return (
    <>

      <Card
        body
        className="mb-3"
      >

        <h2 className="h6">
          Cliente
        </h2>

        <p className="mb-0">
          {nombreCliente}

          {' · '}

          {correoCliente}

          {telefono
            ? ` · ${telefono}`
            : ''}
        </p>

        <p className="text-muted small mb-0">

          {retiro
            ? 'Retiro en tienda'
            : [
                direccion,
                comuna,
                region
              ]
                .filter(Boolean)
                .join(', ')}

          {' · '}

          {fechaHora(
            orden.fecha
          )}

        </p>

        {orden.cupon && (
          <p className="small mb-0 mt-2">

            <strong>
              Cupón:
            </strong>{' '}

            {orden.cupon}

          </p>
        )}

      </Card>

      <TablaResponsiva
        hover={false}
        encabezados={[
          'Producto',
          {
            texto: 'Precio',
            className:
              'text-end'
          },
          {
            texto: 'Cant.',
            className:
              'text-end'
          },
          {
            texto: 'Subtotal',
            className:
              'text-end'
          }
        ]}
        vacio={
          productos.length === 0
        }
        mensajeVacio="No hay productos para mostrar."
      >

        {productos.map(
          (producto) => (

            <tr
              key={
                producto.id ||
                producto.productoId ||
                producto.codigo
              }
            >

              <td>
                {producto.nombre ||
                  'Producto'}

                {producto.codigo && (
                  <div className="text-muted small">
                    {producto.codigo}
                  </div>
                )}
              </td>

              <td className="text-end">
                {dinero(
                  producto.precio
                )}
              </td>

              <td className="text-end">
                {producto.cantidad}
              </td>

              <td className="text-end">
                {dinero(
                  producto.subtotal ??
                  (
                    producto.precio *
                    producto.cantidad
                  )
                )}
              </td>

            </tr>

          )
        )}

      </TablaResponsiva>

    </>
  );
}

export default BoletaOrden;