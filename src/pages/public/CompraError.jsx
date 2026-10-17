import React from 'react';
import { Container, Card, Alert, Button, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function CompraError() {
  const location = useLocation();

  const orden = location.state?.orden;

  const formatoPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor || 0);

  return (
    <Container className="py-5">

      <Card className="shadow-sm mx-auto" style={{ maxWidth: '850px' }}>
        <Card.Body className="p-4">

          <Alert variant="danger" className="text-center">
            <h3>No se pudo realizar el pago</h3>
            Tu compra no fue confirmada.
          </Alert>

          <p className="text-center">
            Puedes volver al checkout y seleccionar otro método
            de pago simulado.
          </p>

          {orden && (
            <>
              <hr />

              <h4>Resumen del pedido</h4>

              <p>
                <strong>Número:</strong> {orden.id}
              </p>

              <p>
                <strong>Cliente:</strong>{' '}
                {orden.cliente.nombre} {orden.cliente.apellido}
              </p>

              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {orden.productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                      <td>
                        {formatoPrecio(
                          producto.precio * producto.cantidad
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <p>Subtotal: {formatoPrecio(orden.subtotal)}</p>

              <p>Descuento: -{formatoPrecio(orden.descuento)}</p>

              <p>Despacho: {formatoPrecio(orden.costoEnvio)}</p>

              <h4 className="text-danger">
                Total: {formatoPrecio(orden.total)}
              </h4>
            </>
          )}

          <hr />

          <Button
            as={Link}
            to="/checkout"
            state={{ cupon: orden?.cupon || '' }}
            variant="primary"
            className="w-100 mb-2"
          >
            Reintentar compra
          </Button>

          <Button
            as={Link}
            to="/carrito"
            variant="outline-secondary"
            className="w-100"
          >
            Volver al carrito
          </Button>

        </Card.Body>
      </Card>

    </Container>
  );
}

export default CompraError;