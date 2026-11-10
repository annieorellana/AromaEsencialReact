import React, {
  useEffect,
  useState
} from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

// ==========================================
// REGIONES Y COMUNAS
// ==========================================

const regionesComunas = {
  'Región Metropolitana de Santiago': [
    'Santiago',
    'Providencia',
    'Las Condes',
    'Ñuñoa',
    'Puente Alto',
    'Maipú',
    'La Florida',
    'San Bernardo',
    'Peñalolén'
  ],

  'Región de la Araucanía': [
    'Temuco',
    'Villarrica',
    'Pucón',
    'Angol',
    'Victoria',
    'Padre Las Casas'
  ],

  'Región de Ñuble': [
    'Chillán',
    'Chillán Viejo',
    'San Carlos',
    'Bulnes',
    'Coihueco'
  ]
};

// ==========================================
// CUPONES
// ==========================================

const descuentos = {
  AROMA10: 0.10,
  BIENVENIDA15: 0.15
};

// ==========================================
// COMPONENTE CHECKOUT
// ==========================================

function Checkout({
  carrito = [],
  finalizarCompra
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { usuario } = useAuth();

  const cupon =
    location.state?.cupon || '';

  // ========================================
  // DATOS DEL FORMULARIO
  // ========================================

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    departamento: '',
    region: '',
    comuna: '',
    indicaciones: '',
    envio: 'domicilio',
    metodoPago: 'debito'
  });

  const [error, setError] =
    useState('');

  const [procesando, setProcesando] =
    useState(false);

  // ========================================
  // COMPLETAR DATOS DEL USUARIO
  // ========================================

  useEffect(() => {
    if (!usuario) {
      return;
    }

    setDatos((anterior) => ({
      ...anterior,

      nombre:
        usuario.nombre || '',

      apellido:
        usuario.apellido || '',

      correo:
        usuario.correo || '',

      telefono:
        usuario.telefono || '',

      direccion:
        usuario.direccion || '',

      region:
        usuario.region || '',

      comuna:
        usuario.comuna || ''
    }));

  }, [usuario]);

  // ========================================
  // COMUNAS SEGÚN REGIÓN
  // ========================================

  const comunasDisponibles =
    regionesComunas[datos.region] || [];

  // ========================================
  // SUBTOTAL
  // ========================================

  const subtotal = carrito.reduce(
    (total, producto) =>
      total +
      producto.precio *
        producto.cantidad,
    0
  );

  // ========================================
  // DESCUENTO
  // ========================================

  const porcentajeDescuento =
    descuentos[cupon] || 0;

  const descuento = Math.round(
    subtotal *
      porcentajeDescuento
  );

  // ========================================
  // ENVÍO
  // ========================================

  const costoEnvio =
    datos.envio === 'domicilio'
      ? 3990
      : 0;

  // ========================================
  // TOTAL
  // ========================================

  const total =
    subtotal -
    descuento +
    costoEnvio;

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
    ).format(valor);

  // ========================================
  // CAMBIO DE FORMULARIO
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setDatos((anterior) => {
      if (name === 'region') {
        return {
          ...anterior,
          region: value,
          comuna: ''
        };
      }

      return {
        ...anterior,
        [name]: value
      };
    });
  };

  // ========================================
  // NOMBRE DEL MÉTODO DE PAGO
  // ========================================

  const obtenerNombreMetodoPago = () => {
    if (datos.metodoPago === 'debito') {
      return 'Tarjeta de débito';
    }

    if (datos.metodoPago === 'credito') {
      return 'Tarjeta de crédito';
    }

    if (
      datos.metodoPago ===
      'transferencia'
    ) {
      return 'Transferencia bancaria';
    }

    if (
      datos.metodoPago ===
      'simular-error'
    ) {
      return 'Pago rechazado simulado';
    }

    return '';
  };

  // ========================================
  // CONFIRMAR COMPRA
  // ========================================

  const confirmarCompra = async (e) => {
    e.preventDefault();

    // EVITAR DOBLE ENVÍO
    if (procesando) {
      return;
    }

    // VALIDAR CARRITO
    if (carrito.length === 0) {
      setError(
        'Tu carrito está vacío.'
      );

      return;
    }

    // VALIDAR COMPRADOR
    if (
      !datos.nombre.trim() ||
      !datos.apellido.trim() ||
      !datos.correo.trim()
    ) {
      setError(
        'Completa los datos obligatorios del comprador.'
      );

      return;
    }

    // VALIDAR DESPACHO
    if (
      datos.envio === 'domicilio'
    ) {
      if (
        !datos.direccion.trim() ||
        !datos.region ||
        !datos.comuna
      ) {
        setError(
          'Completa los datos de despacho.'
        );

        return;
      }

      if (
        !regionesComunas[
          datos.region
        ] ||
        !comunasDisponibles.includes(
          datos.comuna
        )
      ) {
        setError(
          'Selecciona una región y comuna válidas.'
        );

        return;
      }
    }

    setError('');

    // ======================================
    // ORDEN DEL FRONTEND
    // ======================================

    const orden = {
      id:
        `AE-${Date.now()}`,

      fecha:
        new Date().toISOString(),

      cliente: {
        ...datos
      },

      productos:
        carrito.map(
          (producto) => ({
            ...producto
          })
        ),

      cupon,

      subtotal,

      descuento,

      costoEnvio,

      total,

      metodoPago:
        obtenerNombreMetodoPago(),

      tarjeta:
        datos.metodoPago === 'debito' ||
        datos.metodoPago === 'credito'
          ? {
              tipo:
                datos.metodoPago ===
                'debito'
                  ? 'Débito'
                  : 'Crédito',

              titular:
                'RENATA ORTIZ',

              numero:
                '•••• •••• •••• 4242',

              vencimiento:
                '12/30'
            }
          : null,

      estado:
        'Confirmada'
    };

    // ======================================
    // PAGO RECHAZADO SIMULADO
    // ======================================

    if (
      datos.metodoPago ===
      'simular-error'
    ) {
      navigate(
        '/compra-error',
        {
          state: {
            orden: {
              ...orden,
              estado:
                'Rechazada'
            }
          }
        }
      );

      return;
    }

    // ======================================
    // COMPRA EXITOSA - API BACKEND
    // ======================================

    try {
      if (
        typeof finalizarCompra !==
        'function'
      ) {
        throw new Error(
          'No está configurada la función para finalizar la compra.'
        );
      }

      setProcesando(true);

      // ESPERAR RESPUESTA REAL
      // DEL BACKEND
      const resultado =
        await finalizarCompra(
          orden
        );

      if (!resultado) {
        throw new Error(
          'No se pudo guardar la compra.'
        );
      }

      // IR A COMPRA EXITOSA
      // CON LA BOLETA REAL DEVUELTA
      // POR SPRING BOOT
      navigate(
        '/compra-exitosa',
        {
          state: {
            orden: resultado
          }
        }
      );

    } catch (err) {
      console.error(
        'Error al confirmar la compra:',
        err
      );

      setError(
        err.message ||
        'No se pudo confirmar la compra.'
      );

    } finally {
      setProcesando(false);
    }
  };

  // ========================================
  // CARRITO VACÍO
  // ========================================

  if (
    carrito.length === 0
  ) {
    return (
      <Container className="py-5">

        <Alert variant="info">
          Tu carrito está vacío.
        </Alert>

        <Link to="/productos">
          Volver a productos
        </Link>

      </Container>
    );
  }

  // ========================================
  // VISTA
  // ========================================

  return (
    <Container className="py-5">

      <h1 className="mb-4">
        Finalizar compra
      </h1>

      <Row className="g-4">

        {/* =================================
            FORMULARIO
           ================================= */}

        <Col lg={8}>

          <Card className="shadow-sm">

            <Card.Body className="p-4">

              <h4 className="mb-4">
                Información del comprador
              </h4>

              {usuario && (
                <Alert variant="success">
                  Has iniciado sesión.{' '}
                  Tus datos disponibles
                  se completaron
                  automáticamente.
                </Alert>
              )}

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <Form
                id="form-checkout"
                onSubmit={
                  confirmarCompra
                }
              >

                {/* =========================
                    NOMBRE Y APELLIDO
                   ========================= */}

                <Row>

                  <Col md={6}>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Nombre *
                      </Form.Label>

                      <Form.Control
                        name="nombre"
                        value={
                          datos.nombre
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          procesando
                        }
                        required
                      />

                    </Form.Group>

                  </Col>

                  <Col md={6}>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Apellido *
                      </Form.Label>

                      <Form.Control
                        name="apellido"
                        value={
                          datos.apellido
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          procesando
                        }
                        required
                      />

                    </Form.Group>

                  </Col>

                </Row>

                {/* =========================
                    CORREO
                   ========================= */}

                <Form.Group className="mb-3">

                  <Form.Label>
                    Correo electrónico *
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="correo"
                    value={
                      datos.correo
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={100}
                    disabled={
                      procesando
                    }
                    required
                  />

                </Form.Group>

                {/* =========================
                    TELÉFONO
                   ========================= */}

                <Form.Group className="mb-3">

                  <Form.Label>
                    Teléfono
                  </Form.Label>

                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={
                      datos.telefono
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={15}
                    placeholder="+56912345678"
                    disabled={
                      procesando
                    }
                  />

                </Form.Group>

                {/* =========================
                    ENTREGA
                   ========================= */}

                <h5 className="mt-4 mb-3">
                  Tipo de entrega
                </h5>

                <Form.Select
                  name="envio"
                  value={
                    datos.envio
                  }
                  onChange={
                    handleChange
                  }
                  className="mb-3"
                  disabled={
                    procesando
                  }
                >

                  <option value="domicilio">
                    Despacho a domicilio
                  </option>

                  <option value="retiro">
                    Retiro en tienda
                  </option>

                </Form.Select>

                {/* =========================
                    DIRECCIÓN
                   ========================= */}

                {datos.envio ===
                  'domicilio' && (
                  <>

                    <h5 className="mt-4 mb-3">
                      Dirección de entrega
                    </h5>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Calle y número *
                      </Form.Label>

                      <Form.Control
                        name="direccion"
                        value={
                          datos.direccion
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Ej: Los Aromos 123"
                        disabled={
                          procesando
                        }
                        required
                      />

                    </Form.Group>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Departamento{' '}
                        (opcional)
                      </Form.Label>

                      <Form.Control
                        name="departamento"
                        value={
                          datos.departamento
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Ej: Depto 503"
                        disabled={
                          procesando
                        }
                      />

                    </Form.Group>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Región *
                      </Form.Label>

                      <Form.Select
                        name="region"
                        value={
                          datos.region
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          procesando
                        }
                        required
                      >

                        <option value="">
                          Seleccione una región
                        </option>

                        {Object.keys(
                          regionesComunas
                        ).map(
                          (region) => (
                            <option
                              key={
                                region
                              }
                              value={
                                region
                              }
                            >
                              {region}
                            </option>
                          )
                        )}

                      </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Comuna *
                      </Form.Label>

                      <Form.Select
                        name="comuna"
                        value={
                          comunasDisponibles.includes(
                            datos.comuna
                          )
                            ? datos.comuna
                            : ''
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          procesando ||
                          comunasDisponibles.length ===
                            0
                        }
                        required
                      >

                        <option value="">

                          {comunasDisponibles.length ===
                          0
                            ? 'Primero seleccione una región'
                            : 'Seleccione una comuna'}

                        </option>

                        {comunasDisponibles.map(
                          (comuna) => (
                            <option
                              key={
                                comuna
                              }
                              value={
                                comuna
                              }
                            >
                              {comuna}
                            </option>
                          )
                        )}

                      </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3">

                      <Form.Label>
                        Indicaciones de entrega{' '}
                        (opcional)
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="indicaciones"
                        value={
                          datos.indicaciones
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Ej: Entregar en conserjería"
                        disabled={
                          procesando
                        }
                      />

                    </Form.Group>

                  </>
                )}

                {/* =========================
                    MÉTODO DE PAGO
                   ========================= */}

                <h5 className="mt-4 mb-3">
                  Método de pago
                </h5>

                <Form.Select
                  name="metodoPago"
                  value={
                    datos.metodoPago
                  }
                  onChange={
                    handleChange
                  }
                  className="mb-3"
                  disabled={
                    procesando
                  }
                >

                  <option value="debito">
                    Tarjeta de débito
                  </option>

                  <option value="credito">
                    Tarjeta de crédito
                  </option>

                  <option value="transferencia">
                    Transferencia bancaria
                  </option>

                  <option value="simular-error">
                    Simular pago rechazado
                  </option>

                </Form.Select>

                {/* =========================
                    DATOS DE TARJETA
                   ========================= */}

                {(datos.metodoPago ===
                  'debito' ||
                  datos.metodoPago ===
                  'credito') && (

                  <Card className="mb-3 bg-light">

                    <Card.Body>

                      <h6 className="mb-3">
                        Datos de tarjeta{' '}
                        - Simulación
                      </h6>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Tipo de tarjeta
                        </Form.Label>

                        <Form.Control
                          value={
                            datos.metodoPago ===
                            'debito'
                              ? 'Tarjeta de débito'
                              : 'Tarjeta de crédito'
                          }
                          readOnly
                        />

                      </Form.Group>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Número de tarjeta
                        </Form.Label>

                        <Form.Control
                          value="4242 4242 4242 4242"
                          readOnly
                        />

                      </Form.Group>

                      <Form.Group className="mb-3">

                        <Form.Label>
                          Nombre en la tarjeta
                        </Form.Label>

                        <Form.Control
                          value="RENATA ORTIZ"
                          readOnly
                        />

                      </Form.Group>

                      <Row>

                        <Col md={6}>

                          <Form.Group className="mb-3">

                            <Form.Label>
                              Vencimiento
                            </Form.Label>

                            <Form.Control
                              value="12/30"
                              readOnly
                            />

                          </Form.Group>

                        </Col>

                        <Col md={6}>

                          <Form.Group className="mb-3">

                            <Form.Label>
                              CVV
                            </Form.Label>

                            <Form.Control
                              value="123"
                              readOnly
                            />

                          </Form.Group>

                        </Col>

                      </Row>

                      <Alert
                        variant="warning"
                        className="mb-0"
                      >
                        🔒 Datos ficticios para
                        fines académicos.
                        No ingreses información
                        bancaria real.
                      </Alert>

                    </Card.Body>

                  </Card>
                )}

                {/* =========================
                    TRANSFERENCIA
                   ========================= */}

                {datos.metodoPago ===
                  'transferencia' && (

                  <Alert variant="secondary">

                    <strong>
                      Transferencia simulada
                    </strong>

                    <br />

                    Banco: Banco Demo

                    <br />

                    Cuenta: 123456789

                    <br />

                    Titular: AromaEsencial

                    <br />

                    <small>
                      Datos ficticios para
                      fines académicos.
                    </small>

                  </Alert>
                )}

                {/* =========================
                    PAGO RECHAZADO
                   ========================= */}

                {datos.metodoPago ===
                  'simular-error' && (

                  <Alert variant="danger">
                    Esta opción permite
                    demostrar el flujo de
                    una transacción rechazada.
                  </Alert>
                )}

                <Alert variant="info">
                  Esta compra es una
                  simulación académica.{' '}
                  No se realizará ningún
                  cobro real.
                </Alert>

              </Form>

            </Card.Body>

          </Card>

        </Col>

        {/* =================================
            RESUMEN DEL PEDIDO
           ================================= */}

        <Col lg={4}>

          <Card className="shadow-sm">

            <Card.Body className="p-4">

              <h4>
                Resumen del pedido
              </h4>

              <hr />

              {carrito.map(
                (producto) => (

                  <div
                    key={
                      producto.id
                    }
                    className="d-flex justify-content-between mb-3"
                  >

                    <span>
                      {producto.nombre}
                      {' × '}
                      {producto.cantidad}
                    </span>

                    <span>
                      {formatoPrecio(
                        producto.precio *
                        producto.cantidad
                      )}
                    </span>

                  </div>
                )
              )}

              <hr />

              <div className="d-flex justify-content-between mb-2">

                <span>
                  Subtotal:
                </span>

                <strong>
                  {formatoPrecio(
                    subtotal
                  )}
                </strong>

              </div>

              {descuento > 0 && (

                <div className="d-flex justify-content-between mb-2 text-success">

                  <span>
                    Descuento:
                  </span>

                  <strong>
                    -
                    {formatoPrecio(
                      descuento
                    )}
                  </strong>

                </div>
              )}

              <div className="d-flex justify-content-between mb-2">

                <span>
                  Envío:
                </span>

                <strong>
                  {formatoPrecio(
                    costoEnvio
                  )}
                </strong>

              </div>

              <div className="d-flex justify-content-between mb-2">

                <span>
                  Pago:
                </span>

                <strong>
                  {obtenerNombreMetodoPago()}
                </strong>

              </div>

              <hr />

              <div className="d-flex justify-content-between">

                <h5>
                  Total:
                </h5>

                <h5>
                  {formatoPrecio(
                    total
                  )}
                </h5>

              </div>

              {/* =========================
                  CONFIRMAR COMPRA
                 ========================= */}

              <Button
                type="submit"
                form="form-checkout"
                variant="success"
                className="w-100 mt-3"
                disabled={
                  procesando
                }
              >
                {procesando
                  ? 'Procesando compra...'
                  : 'Confirmar compra'}
              </Button>

              <Button
                as={Link}
                to="/carrito"
                variant="outline-secondary"
                className="w-100 mt-2"
                disabled={
                  procesando
                }
              >
                Volver al carrito
              </Button>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
}

export default Checkout;