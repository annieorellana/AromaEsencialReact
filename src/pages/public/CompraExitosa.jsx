import React from 'react';

import {
  Container,
  Card,
  Alert,
  Button,
  Table,
  Badge
} from 'react-bootstrap';

import {
  Link,
  useLocation
} from 'react-router-dom';

function CompraExitosa() {
  const location = useLocation();

  const orden =
    location.state?.orden;

  // ========================================
  // FORMATO DE PRECIO
  // ========================================

  const formatoPrecio = (valor) =>
    new Intl.NumberFormat(
      'es-CL',
      {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
      }
    ).format(valor || 0);

  // ========================================
  // FORMATO DE FECHA
  // ========================================

  const formatoFecha = (fecha) => {
    if (!fecha) {
      return 'Sin información';
    }

    const fechaConvertida =
      new Date(fecha);

    if (
      Number.isNaN(
        fechaConvertida.getTime()
      )
    ) {
      return fecha;
    }

    return fechaConvertida.toLocaleString(
      'es-CL'
    );
  };

  // ========================================
  // SIN INFORMACIÓN DE COMPRA
  // ========================================

  if (!orden) {
    return (
      <Container className="py-5">

        <Alert variant="info">
          No hay información de una
          compra reciente.
        </Alert>

        <Button
          as={Link}
          to="/productos"
          variant="primary"
        >
          Ver productos
        </Button>

      </Container>
    );
  }

  const detalles =
    Array.isArray(orden.detalles)
      ? orden.detalles
      : [];

  const esDomicilio =
    String(
      orden.metodoEnvio || ''
    ).toLowerCase() ===
    'domicilio';

  // ========================================
  // VISTA
  // ========================================

  return (
    <Container className="py-5">

      <Card
        className="shadow-sm mx-auto"
        style={{
          maxWidth: '850px'
        }}
      >

        <Card.Body className="p-4">

          {/* ===============================
              MENSAJE DE ÉXITO
             =============================== */}

          <Alert
            variant="success"
            className="text-center"
          >

            <h3>
              ¡Compra realizada exitosamente!
            </h3>

            Tu pedido ha sido registrado
            correctamente.

          </Alert>

          {/* ===============================
              INFORMACIÓN DE LA BOLETA
             =============================== */}

          <h4>
            Información del pedido
          </h4>

          <p>
            <strong>
              Número de boleta:
            </strong>{' '}

            #{orden.id}
          </p>

          <p>
            <strong>
              Fecha:
            </strong>{' '}

            {formatoFecha(
              orden.fecha
            )}
          </p>

          <p>
            <strong>
              Estado:
            </strong>{' '}

            <Badge bg="success">
              {orden.estado ||
                'CONFIRMADA'}
            </Badge>
          </p>

          <p>
            <strong>
              Cliente:
            </strong>{' '}

            {orden.nombreCliente ||
              'Cliente'}
          </p>

          <p>
            <strong>
              Correo:
            </strong>{' '}

            {orden.correoCliente ||
              'Sin información'}
          </p>

          {orden.telefono && (
            <p>
              <strong>
                Teléfono:
              </strong>{' '}

              {orden.telefono}
            </p>
          )}

          <p>
            <strong>
              Entrega:
            </strong>{' '}

            {esDomicilio
              ? 'Despacho a domicilio'
              : 'Retiro en tienda'}
          </p>

          {esDomicilio && (
            <>

              <p>
                <strong>
                  Dirección:
                </strong>{' '}

                {orden.direccionEnvio ||
                  'Sin información'}
              </p>

              <p>
                <strong>
                  Comuna:
                </strong>{' '}

                {orden.comuna ||
                  'Sin información'}
              </p>

              <p>
                <strong>
                  Región:
                </strong>{' '}

                {orden.region ||
                  'Sin información'}
              </p>

            </>
          )}

          <p>
            <strong>
              Método de pago:
            </strong>{' '}

            {orden.metodoPago ||
              'Sin información'}
          </p>

          {orden.cupon && (
            <p>
              <strong>
                Cupón aplicado:
              </strong>{' '}

              {orden.cupon}
            </p>
          )}

          <hr />

          {/* ===============================
              PRODUCTOS
             =============================== */}

          <h4>
            Productos comprados
          </h4>

          {detalles.length > 0 ? (

            <Table
              responsive
              striped
              bordered
            >

              <thead>

                <tr>
                  <th>
                    Producto
                  </th>

                  <th>
                    Cantidad
                  </th>

                  <th>
                    Precio unitario
                  </th>

                  <th>
                    Subtotal
                  </th>
                </tr>

              </thead>

              <tbody>

                {detalles.map(
                  (detalle) => (

                    <tr
                      key={
                        detalle.id ||
                        `${detalle.productoId}-${detalle.nombreProducto}`
                      }
                    >

                      <td>
                        {detalle.nombreProducto}
                      </td>

                      <td>
                        {detalle.cantidad}
                      </td>

                      <td>
                        {formatoPrecio(
                          detalle.precioUnitario
                        )}
                      </td>

                      <td>
                        {formatoPrecio(
                          detalle.subtotal
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </Table>

          ) : (

            <Alert variant="warning">
              No fue posible mostrar el
              detalle de los productos.
            </Alert>

          )}

          <hr />

          {/* ===============================
              TOTALES
             =============================== */}

          <div className="d-flex justify-content-between mb-2">

            <span>
              Subtotal:
            </span>

            <strong>
              {formatoPrecio(
                orden.subtotal
              )}
            </strong>

          </div>

          <div className="d-flex justify-content-between mb-2">

            <span>
              Descuento:
            </span>

            <strong className="text-success">
              -
              {formatoPrecio(
                orden.descuento
              )}
            </strong>

          </div>

          <div className="d-flex justify-content-between mb-2">

            <span>
              Despacho:
            </span>

            <strong>
              {formatoPrecio(
                orden.costoEnvio
              )}
            </strong>

          </div>

          <hr />

          <div className="d-flex justify-content-between">

            <h4>
              Total:
            </h4>

            <h4 className="text-success">
              {formatoPrecio(
                orden.total
              )}
            </h4>

          </div>

          {/* ===============================
              AVISO ACADÉMICO
             =============================== */}

          <Alert
            variant="info"
            className="mt-4"
          >
            Esta compra es una simulación
            académica. No se realizó ningún
            cobro real.
          </Alert>

          <Button
            as={Link}
            to="/productos"
            variant="primary"
            className="w-100"
          >
            Seguir comprando
          </Button>

        </Card.Body>

      </Card>

    </Container>
  );
}

export default CompraExitosa;