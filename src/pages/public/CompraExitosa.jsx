import React from 'react';
import { Container, Card, Alert, Button, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function CompraExitosa() {
  const location = useLocation();

  const orden = location.state?.orden;

  const formatoPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor || 0);

  if (!orden) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          No hay información de una compra reciente.
        </Alert>

        <Button as={Link} to="/productos" variant="primary">
          Ver productos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">

      <Card className="shadow-sm mx-auto" style={{ maxWidth: '850px' }}>
        <Card.Body className="p-4">

          <Alert variant="success" className="text-center">
            <h3>¡Compra realizada exitosamente!</h3>
            Tu pedido ha sido registrado correctamente.
          </Alert>

          <h4>Información del pedido</h4>

          <p><strong>Número:</strong> {orden.id}</p>

          <p>
            <strong>Fecha:</strong>{' '}
            {new Date(orden.fecha).toLocaleString('es-CL')}
          </p>

          <p>
            <strong>Cliente:</strong>{' '}
            {orden.cliente.nombre} {orden.cliente.apellido}
          </p>

          <p>
            <strong>Correo:</strong> {orden.cliente.correo}
          </p>

          <p>
            <strong>Entrega:</strong>{' '}
            {orden.cliente.envio === 'domicilio'
              ? 'Despacho a domicilio'
              : 'Retiro en tienda'}
          </p>

          {orden.cliente.envio === 'domicilio' && (
            <p>
              <strong>Dirección:</strong>{' '}
              {orden.cliente.direccion},{' '}
              {orden.cliente.comuna},{' '}
              {orden.cliente.region}
            </p>
          )}

          <hr />

          <h4>Productos comprados</h4>

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

          <hr />

          <p>Subtotal: {formatoPrecio(orden.subtotal)}</p>

          <p>Descuento: -{formatoPrecio(orden.descuento)}</p>

          <p>Despacho: {formatoPrecio(orden.costoEnvio)}</p>

          <h4 className="text-success">
            Total: {formatoPrecio(orden.total)}
          </h4>

          <Alert variant="info" className="mt-4">
            Esta compra es una simulación académica.
            No se realizó ningún cobro real.
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