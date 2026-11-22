
import React, { useEffect, useRef, useState } from 'react';

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
// El cálculo definitivo lo hace Spring Boot.
// ==========================================

const DESCUENTOS = {
  AROMA10: 0.10,
  BIENVENIDA15: 0.15
};

const FORMULARIO_INICIAL = {
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
};

const formatoPrecio = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor || 0);

// ==========================================
// COMPONENTE CHECKOUT
// ==========================================

function Checkout({ carrito = [], finalizarCompra }) {

  const navigate = useNavigate();
  const location = useLocation();

  const { usuario, verificandoSesion } = useAuth();

  const [datos, setDatos] = useState({
    ...FORMULARIO_INICIAL
  });

  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Evitar dos compras simultáneas.
  const procesandoRef = useRef(false);

  // Evitar sobrescribir datos cuando se renueva JWT.
  const usuarioCompletadoRef = useRef(null);

  const cupon = String(
    location.state?.cupon || ''
  ).trim().toUpperCase();

  // ==========================================
  // DATOS DEL USUARIO AUTENTICADO
  // ==========================================

  useEffect(() => {

    if (!usuario?.id) {
      return;
    }

    if (usuarioCompletadoRef.current === usuario.id) {
      return;
    }

    usuarioCompletadoRef.current = usuario.id;

    const regionUsuario = usuario.region || '';

    const regionValida =
      Object.prototype.hasOwnProperty.call(
        regionesComunas,
        regionUsuario
      );

    const comunaUsuario = usuario.comuna || '';

    setDatos((anterior) => ({
      ...anterior,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      correo: usuario.correo || '',
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || '',
      region: regionValida ? regionUsuario : '',
      comuna:
        regionValida &&
        regionesComunas[regionUsuario].includes(comunaUsuario)
          ? comunaUsuario
          : ''
    }));

  }, [usuario]);

  // ==========================================
  // CÁLCULOS VISUALES
  // ==========================================

  const subtotal = carrito.reduce(
    (acumulado, producto) =>
      acumulado +
      Number(producto.precio || 0) *
      Number(producto.cantidad || 0),
    0
  );

  const porcentajeDescuento =
    DESCUENTOS[cupon] || 0;

  const descuento = Math.round(
    subtotal * porcentajeDescuento
  );

  const costoEnvio =
    datos.envio === 'domicilio' ? 3990 : 0;

  const total =
    subtotal - descuento + costoEnvio;

  const comunasDisponibles =
    regionesComunas[datos.region] || [];

  // ==========================================
  // FORMULARIO
  // ==========================================

  const handleChange = (evento) => {
    const { name, value } = evento.target;

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

  // ==========================================
  // MÉTODO DE PAGO
  // ==========================================

  const obtenerNombreMetodoPago = () => {
    switch (datos.metodoPago) {
      case 'debito':
        return 'Tarjeta de débito';

      case 'credito':
        return 'Tarjeta de crédito';

      case 'transferencia':
        return 'Transferencia bancaria';

      case 'simular-error':
        return 'Pago rechazado simulado';

      default:
        return '';
    }
  };

  // ==========================================
  // CONFIRMAR COMPRA
  // ==========================================

  const confirmarCompra = async (evento) => {

    evento.preventDefault();

    if (procesandoRef.current) {
      return;
    }

    setError('');

    // Comprobar sesión real.
    if (verificandoSesion || !usuario?.id) {
      setError(
        'Debes iniciar sesión para confirmar la compra.'
      );
      return;
    }

    // Comprobar carrito.
    if (!Array.isArray(carrito) || carrito.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    // Datos de contacto.
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

    // Comprobar cupón.
    if (
      cupon &&
      !Object.prototype.hasOwnProperty.call(
        DESCUENTOS,
        cupon
      )
    ) {
      setError('El cupón ingresado no es válido.');
      return;
    }

    // Datos de despacho.
    if (datos.envio === 'domicilio') {

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
        !comunasDisponibles.includes(datos.comuna)
      ) {
        setError(
          'Selecciona una región y comuna válidas.'
        );
        return;
      }

      const direccionCompleta = [
        datos.direccion,
        datos.departamento,
        datos.indicaciones
      ].filter(Boolean).join(', ');

      if (direccionCompleta.length > 200) {
        setError(
          'La dirección e indicaciones superan el máximo de 200 caracteres.'
        );
        return;
      }
    }

    if (typeof finalizarCompra !== 'function') {
      setError(
        'La función de finalizar compra no está configurada.'
      );
      return;
    }

    // ======================================
    // DATOS PARA EL SERVICIO DE BOLETAS
    // ======================================

    // No generamos el ID de la boleta en React.
    // El identificador lo genera MySQL.

    const orden = {
      cliente: {
        ...datos
      },

      productos: carrito.map((producto) => ({
        ...producto
      })),

      cupon: cupon || null,

      metodoPago: obtenerNombreMetodoPago()
    };

    // ======================================
    // PAGO RECHAZADO SIMULADO
    // ======================================

    if (datos.metodoPago === 'simular-error') {

      // No llamar a la API.
      // No crear boleta.
      // No descontar stock.

      navigate('/compra-error', {
        state: {
          orden: {
            ...orden,
            id: 'No emitida (simulación)',
            fecha: new Date().toISOString(),
            estado: 'RECHAZADA',
            subtotal,
            descuento,
            costoEnvio,
            total
          }
        }
      });

      return;
    }

    // ======================================
    // COMPRA REAL EN SPRING BOOT
    // ======================================

    procesandoRef.current = true;
    setProcesando(true);

    try {

      const resultado = await finalizarCompra(orden);

      // Comprobar respuesta del backend.
      if (!resultado?.id) {
        throw new Error(
          'El backend no confirmó la creación de la boleta.'
        );
      }

      // El backend devuelve la boleta definitiva
      // con ID, totales, estado y detalles.

      navigate('/compra-exitosa', {
        state: {
          orden: resultado
        },
        replace: true
      });

    } catch (err) {

      console.error(
        'Error al confirmar compra:',
        err
      );

      setError(
        err.message ||
        'No fue posible confirmar la compra.'
      );

    } finally {
      procesandoRef.current = false;
      setProcesando(false);
    }
  };

  // ==========================================
  // CARRITO VACÍO
  // ==========================================

  if (carrito.length === 0) {
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

  // ==========================================
  // VISTA PRINCIPAL
  // ==========================================

  return (
    <Container className="py-5">

      <h1 className="mb-4">
        Finalizar compra
      </h1>

      <Row className="g-4">

        {/* FORMULARIO */}

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">

              <h4 className="mb-4">
                Información del comprador
              </h4>

              {usuario?.id ? (
                <Alert variant="success">
                  Sesión iniciada como{' '}
                  <strong>
                    {usuario.correo}
                  </strong>.
                  La compra se asociará a tu cuenta.
                </Alert>
              ) : (
                <Alert variant="warning">
                  Debes iniciar sesión para comprar.
                </Alert>
              )}

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <Form
                id="form-checkout"
                onSubmit={confirmarCompra}
              >

                {/* NOMBRE Y APELLIDO */}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Nombre *
                      </Form.Label>

                      <Form.Control
                        name="nombre"
                        value={datos.nombre}
                        onChange={handleChange}
                        readOnly={Boolean(usuario?.nombre)}
                        disabled={procesando}
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
                        value={datos.apellido}
                        onChange={handleChange}
                        disabled={procesando}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* CORREO */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Correo electrónico *
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={handleChange}
                    readOnly={Boolean(usuario?.correo)}
                    disabled={procesando}
                    maxLength={100}
                    required
                  />
                </Form.Group>

                {/* TELÉFONO */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Teléfono
                  </Form.Label>

                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={datos.telefono}
                    onChange={handleChange}
                    disabled={procesando}
                    maxLength={20}
                    placeholder="+56912345678"
                  />
                </Form.Group>

                {/* TIPO DE ENTREGA */}

                <h5 className="mt-4 mb-3">
                  Tipo de entrega
                </h5>

                <Form.Select
                  name="envio"
                  value={datos.envio}
                  onChange={handleChange}
                  disabled={procesando}
                  className="mb-3"
                >
                  <option value="domicilio">
                    Despacho a domicilio
                  </option>
                  <option value="retiro">
                    Retiro en tienda
                  </option>
                </Form.Select>

                {/* DIRECCIÓN */}

                {datos.envio === 'domicilio' && (
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
                        value={datos.direccion}
                        onChange={handleChange}
                        disabled={procesando}
                        placeholder="Ej: Los Aromos 123"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Departamento (opcional)
                      </Form.Label>

                      <Form.Control
                        name="departamento"
                        value={datos.departamento}
                        onChange={handleChange}
                        disabled={procesando}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Región *
                      </Form.Label>

                      <Form.Select
                        name="region"
                        value={datos.region}
                        onChange={handleChange}
                        disabled={procesando}
                        required
                      >
                        <option value="">
                          Seleccione una región
                        </option>

                        {Object.keys(regionesComunas).map(
                          (region) => (
                            <option
                              key={region}
                              value={region}
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
                        value={datos.comuna}
                        onChange={handleChange}
                        disabled={
                          procesando ||
                          comunasDisponibles.length === 0
                        }
                        required
                      >
                        <option value="">
                          Seleccione una comuna
                        </option>

                        {comunasDisponibles.map(
                          (comuna) => (
                            <option
                              key={comuna}
                              value={comuna}
                            >
                              {comuna}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Indicaciones (opcional)
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="indicaciones"
                        value={datos.indicaciones}
                        onChange={handleChange}
                        disabled={procesando}
                        placeholder="Ej: Entregar en conserjería"
                      />
                    </Form.Group>
                  </>
                )}

                {/* MÉTODO DE PAGO */}

                <h5 className="mt-4 mb-3">
                  Método de pago
                </h5>

                <Form.Select
                  name="metodoPago"
                  value={datos.metodoPago}
                  onChange={handleChange}
                  disabled={procesando}
                  className="mb-3"
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

                {/* TARJETAS SIMULADAS */}

                {['debito', 'credito'].includes(
                  datos.metodoPago
                ) && (
                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <h6>
                        Datos de tarjeta — Simulación
                      </h6>

                      <p className="mb-1">
                        Tipo: {obtenerNombreMetodoPago()}
                      </p>
                      <p className="mb-1">
                        Número: 4242 4242 4242 4242
                      </p>
                      <p className="mb-1">
                        Titular: RENATA ORTIZ
                      </p>
                      <p className="mb-3">
                        Vencimiento: 12/30
                      </p>

                      <Alert
                        variant="warning"
                        className="mb-0"
                      >
                        Datos ficticios para fines
                        académicos. No ingreses
                        información bancaria real.
                      </Alert>
                    </Card.Body>
                  </Card>
                )}

                {/* TRANSFERENCIA SIMULADA */}

                {datos.metodoPago === 'transferencia' && (
                  <Alert variant="secondary">
                    <strong>
                      Transferencia simulada
                    </strong>

                    <p className="mb-0">
                      Banco: Banco Demo
                    </p>
                    <p className="mb-0">
                      Cuenta: 123456789
                    </p>
                    <p className="mb-0">
                      Titular: AromaEsencial
                    </p>
                  </Alert>
                )}

                {datos.metodoPago === 'simular-error' && (
                  <Alert variant="danger">
                    Se simulará una transacción
                    rechazada. No se generará boleta.
                  </Alert>
                )}

                <Alert variant="info">
                  Esta compra es una simulación
                  académica. No se realizará
                  ningún cobro real.
                </Alert>

              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* RESUMEN DEL PEDIDO */}

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">

              <h4>
                Resumen del pedido
              </h4>

              <hr />

              {carrito.map((producto) => (
                <div
                  key={producto.id}
                  className="d-flex justify-content-between mb-3"
                >
                  <span>
                    {producto.nombre}
                    {' × '}
                    {producto.cantidad}
                  </span>

                  <span>
                    {formatoPrecio(
                      Number(producto.precio || 0) *
                      Number(producto.cantidad || 0)
                    )}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>
                  {formatoPrecio(subtotal)}
                </strong>
              </div>

              {descuento > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>
                    Descuento ({cupon}):
                  </span>

                  <strong>
                    -{formatoPrecio(descuento)}
                  </strong>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <strong>
                  {formatoPrecio(costoEnvio)}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Pago:</span>
                <strong>
                  {obtenerNombreMetodoPago()}
                </strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <h5>Total estimado:</h5>
                <h5>
                  {formatoPrecio(total)}
                </h5>
              </div>

              <small className="text-muted">
                El total definitivo será
                calculado por Spring Boot.
              </small>

              <Button
                type="submit"
                form="form-checkout"
                variant="success"
                className="w-100 mt-3"
                disabled={
                  procesando ||
                  verificandoSesion ||
                  !usuario?.id
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
                disabled={procesando}
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
