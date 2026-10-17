import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form
} from 'react-bootstrap';

import { Link, useNavigate } from 'react-router-dom';

// Cupones de descuento
const cupones = {
  AROMA10: 0.10,
  BIENVENIDA15: 0.15
};

function Carrito({ carrito, cambiarCantidad, eliminarProducto }) {

  const navigate = useNavigate();

  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Calcular subtotal
  const subtotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  // Calcular descuento
  const porcentajeDescuento = cupones[cuponAplicado] || 0;

  const descuento = Math.round(
    subtotal * porcentajeDescuento
  );

  // Calcular total
  const total = subtotal - descuento;

  // Formato de precios chilenos
  const formatoPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor);

  // Aplicar cupón
  const aplicarCupon = () => {
    const codigo = codigoCupon.trim().toUpperCase();

    if (Object.prototype.hasOwnProperty.call(cupones, codigo)) {
      setCuponAplicado(codigo);
      setMensaje('Cupón aplicado correctamente.');
    } else {
      setCuponAplicado('');
      setMensaje('El cupón ingresado no es válido.');
    }
  };

  // Ir al checkout conservando el cupón
  const continuarAlPago = () => {
    navigate('/checkout', {
      state: {
        cupon: cuponAplicado
      }
    });
  };

  return (
    <Container className="py-5">

      <h1 className="mb-4">
        Carrito de compras
      </h1>

      {carrito.length === 0 ? (

        <Alert variant="info">
          Tu carrito está vacío.

          <div className="mt-3">
            <Button
              as={Link}
              to="/productos"
              variant="primary"
            >
              Ver productos
            </Button>
          </div>
        </Alert>

      ) : (

        <Row className="g-4">

          {/* LISTADO DE PRODUCTOS */}
          <Col lg={8}>

            {carrito.map((producto) => (

              <Card
                key={producto.id}
                className="mb-3 shadow-sm"
              >

                <Card.Body>

                  <Row className="align-items-center g-3">

                    {/* Imagen */}
                    <Col xs={4} md={2}>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="img-fluid rounded"
                      />
                    </Col>

                    {/* Información */}
                    <Col xs={8} md={4}>
                      <h5>{producto.nombre}</h5>

                      <p className="text-muted mb-1">
                        {producto.categoria}
                      </p>

                      <strong>
                        {formatoPrecio(producto.precio)}
                      </strong>
                    </Col>

                    {/* Cantidad */}
                    <Col xs={7} md={3}>

                      <div className="d-flex align-items-center gap-2">

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={producto.cantidad <= 1}
                          onClick={() =>
                            cambiarCantidad(producto.id, -1)
                          }
                        >
                          −
                        </Button>

                        <span>{producto.cantidad}</span>

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={
                            producto.cantidad >= producto.stock
                          }
                          onClick={() =>
                            cambiarCantidad(producto.id, 1)
                          }
                        >
                          +
                        </Button>

                      </div>

                    </Col>

                    {/* Total y eliminar */}
                    <Col xs={5} md={3} className="text-end">

                      <p className="fw-bold">
                        {formatoPrecio(
                          producto.precio * producto.cantidad
                        )}
                      </p>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          eliminarProducto(producto.id)
                        }
                      >
                        Eliminar
                      </Button>

                    </Col>

                  </Row>

                </Card.Body>

              </Card>

            ))}

          </Col>

          {/* RESUMEN DE COMPRA */}
          <Col lg={4}>

            <Card className="shadow-sm">

              <Card.Body>

                <h4>Resumen de compra</h4>

                <hr />

                {/* Subtotal */}
                <div className="d-flex justify-content-between">

                  <span>Subtotal:</span>

                  <strong>
                    {formatoPrecio(subtotal)}
                  </strong>

                </div>

                {/* Descuento */}
                {descuento > 0 && (

                  <div className="d-flex justify-content-between text-success mt-2">

                    <span>Descuento:</span>

                    <strong>
                      -{formatoPrecio(descuento)}
                    </strong>

                  </div>

                )}

                <hr />

                {/* Total */}
                <div className="d-flex justify-content-between">

                  <strong>Total:</strong>

                  <strong>
                    {formatoPrecio(total)}
                  </strong>

                </div>

                {/* CUPÓN */}
                <Form.Group className="mt-4">

                  <Form.Label>
                    Cupón de descuento
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Ej: AROMA10"
                    value={codigoCupon}
                    onChange={(e) =>
                      setCodigoCupon(e.target.value)
                    }
                  />

                  <Button
                    variant="secondary"
                    className="mt-2 w-100"
                    onClick={aplicarCupon}
                  >
                    Aplicar cupón
                  </Button>

                </Form.Group>

                {/* Mensaje del cupón */}
                {mensaje && (

                  <Alert
                    variant={
                      cuponAplicado ? 'success' : 'danger'
                    }
                    className="mt-3"
                  >
                    {mensaje}
                  </Alert>

                )}

                {/* CONTINUAR AL CHECKOUT */}
                <Button
                  variant="success"
                  className="w-100 mt-3"
                  onClick={continuarAlPago}
                >
                  Continuar al pago
                </Button>

                <Button
                  as={Link}
                  to="/productos"
                  variant="outline-secondary"
                  className="w-100 mt-2"
                >
                  Seguir comprando
                </Button>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      )}

    </Container>
  );
}

export default Carrito;