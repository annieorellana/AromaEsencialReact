
import React from 'react';

import {
  Container,
  Card,
  Alert,
  Button,
  Table
} from 'react-bootstrap';

import {
  Link,
  useLocation
} from 'react-router-dom';

// ==========================================
// AROMAESENCIAL
// COMPRA RECHAZADA - SIMULACIÓN
// ==========================================

function CompraError() {

  const location = useLocation();

  const orden = location.state?.orden || null;

  const productos = Array.isArray(orden?.productos)
    ? orden.productos
    : [];

  // ========================================
  // FORMATO DE PRECIOS
  // ========================================

  const formatoPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(Number(valor) || 0);

  // ========================================
  // DATOS DEL CLIENTE
  // ========================================

  const nombreCliente = [
    orden?.cliente?.nombre,
    orden?.cliente?.apellido
  ]
    .filter(Boolean)
    .join(' ') || 'Sin información';

  // ========================================
  // VISTA
  // ========================================

  return (
    <Container className="py-5">

      <Card
        className="shadow-sm mx-auto"
        style={{ maxWidth: '850px' }}
      >

        <Card.Body className="p-4">

          {/* MENSAJE DE PAGO RECHAZADO */}

          <Alert
            variant="danger"
            className="text-center"
          >

            <h3>
              No se pudo realizar el pago
            </h3>

            La compra no fue confirmada.

          </Alert>

          <Alert variant="warning">

            <strong>
              No se emitió ninguna boleta.
            </strong>

            <p className="mb-0 mt-2">
              Esta transacción fue rechazada
              mediante una simulación académica.
              No se registró una compra en MySQL
              ni se descontó stock por esta
              operación.
            </p>

          </Alert>

          <p className="text-center">
            Puedes volver a Checkout y
            seleccionar otro método de pago
            simulado.
          </p>

          {/* RESUMEN DE COMPRA NO CONFIRMADA */}

          {orden && (
            <>

              <hr />

              <h4>
                Resumen del pedido no confirmado
              </h4>

              <p>
                <strong>Estado:</strong>{' '}
                <span className="text-danger">
                  Rechazada (simulación)
                </span>
              </p>

              <p>
                <strong>Cliente:</strong>{' '}
                {nombreCliente}
              </p>

              {/* PRODUCTOS */}

              {productos.length > 0 && (
                <Table responsive striped>

                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>

                    {productos.map((producto, index) => (

                      <tr
                        key={`${producto.id || producto.codigo || 'item'}-${index}`}
                      >

                        <td>
                          {producto.nombre}
                        </td>

                        <td>
                          {producto.cantidad}
                        </td>

                        <td>
                          {formatoPrecio(
                            Number(producto.precio) *
                            Number(producto.cantidad)
                          )}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </Table>
              )}

              {/* TOTALES ESTIMADOS */}

              <p>
                Subtotal:{' '}
                <strong>
                  {formatoPrecio(orden.subtotal)}
                </strong>
              </p>

              <p>
                Descuento:{' '}
                <strong>
                  -{formatoPrecio(orden.descuento)}
                </strong>
              </p>

              <p>
                Despacho:{' '}
                <strong>
                  {formatoPrecio(orden.costoEnvio)}
                </strong>
              </p>

              <h4 className="text-danger">
                Total estimado:{' '}
                {formatoPrecio(orden.total)}
              </h4>

              <small className="text-muted">
                Los valores son informativos.
                No corresponden a una boleta emitida.
              </small>

            </>
          )}

          <hr />

          {/* REINTENTAR */}

          <Button
            as={Link}
            to="/checkout"
            state={{
              cupon: orden?.cupon || ''
            }}
            variant="primary"
            className="w-100 mb-2"
          >
            Reintentar compra
          </Button>

          {/* VOLVER AL CARRITO */}

          <Button
            as={Link}
            to="/carrito"
            variant="outline-secondary"
            className="w-100"
          >
            Volver al carrito
          </Button>

          {/* VOLVER AL CATÁLOGO */}

          <Button
            as={Link}
            to="/productos"
            variant="outline-dark"
            className="w-100 mt-2"
          >
            Seguir viendo productos
          </Button>

        </Card.Body>

      </Card>

    </Container>
  );
}

export default CompraError;
