
import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button,
  Form,
  Spinner
} from 'react-bootstrap';

import {
  Link,
  useParams
} from 'react-router-dom';

import Price from '../../components/atoms/Price';
import useProductos from '../../hooks/useProductos';

import {
  obtenerPerfilOlfativo
} from '../../data/perfilesOlfativos';

function ProductoDetalle({ onAgregar }) {

  // OBTENER ID DESDE LA URL
  const { id } = useParams();

  // OBTENER PRODUCTOS DESDE SPRING BOOT
  const productos = useProductos();

  // BUSCAR PRODUCTO POR ID
  // String permite comparar IDs numericos y de texto
  const producto = productos.find(
    (item) => String(item.id) === String(id)
  );

  // ESTADOS
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  // REINICIAR AL CAMBIAR DE PRODUCTO
  useEffect(() => {
    setCantidad(1);
    setMensaje('');
  }, [id]);

  // ESPERAR LA CARGA INICIAL DE PRODUCTOS
  useEffect(() => {
    // Tiempo breve para permitir la consulta inicial
    const temporizador = setTimeout(() => {
      setCargando(false);
    }, 1000);

    return () => clearTimeout(temporizador);
  }, []);

  // PANTALLA DE CARGA
  if (cargando && !producto) {
    return (
      <Container className="py-5 text-center">
        <Spinner
          animation="border"
          variant="secondary"
          className="mb-3"
        />

        <p className="text-muted">
          Cargando información del perfume...
        </p>
      </Container>
    );
  }

  // PRODUCTO NO ENCONTRADO
  if (!producto) {
    return (
      <Container className="py-5">

        <Alert variant="warning">
          El producto solicitado no existe.
        </Alert>

        <Link to="/productos">
          Volver al catálogo
        </Link>

      </Container>
    );
  }

  // INFORMACION OLFATIVA
  const perfil = obtenerPerfilOlfativo(producto);

  // STOCK DISPONIBLE
  const stock = Math.max(
    0,
    Number(producto.stock) || 0
  );

  // PRODUCTOS RELACIONADOS
  const relacionados = productos
    .filter(
      (item) =>
        String(item.id) !== String(producto.id) &&
        item.categoria === producto.categoria
    )
    .slice(0, 3);

  // CANTIDAD VALIDA
  const unidades = Math.min(
    stock,
    Math.max(1, Number(cantidad) || 1)
  );

  // AGREGAR AL CARRITO
  const agregar = () => {

    if (stock <= 0) {
      return;
    }

    if (typeof onAgregar !== 'function') {
      setMensaje('No se pudo agregar el producto al carrito.');
      return;
    }

    for (let i = 0; i < unidades; i += 1) {
      onAgregar(producto);
    }

    setMensaje(
      `${unidades} unidad(es) agregada(s) al carrito.`
    );
  };

  // FICHA TECNICA DEL PERFUME
  const ficha = [
    ['Familia olfativa', perfil.familia],
    ['Concentración', perfil.concentracion],
    ['Intensidad', perfil.intensidad],
    ['Duración aproximada', perfil.duracion],
    ['Ideal para', perfil.ocasion]
  ];

  // PIRAMIDE OLFATIVA
  const notas = [
    {
      titulo: 'Salida',
      tiempo: '0–30 min',
      descripcion:
        'Lo primero que percibes al aplicar el perfume.',
      valores: perfil.salida
    },
    {
      titulo: 'Corazón',
      tiempo: '30 min–4 h',
      descripcion:
        'El carácter principal que define la fragancia.',
      valores: perfil.corazon
    },
    {
      titulo: 'Fondo',
      tiempo: '4 h en adelante',
      descripcion:
        'Las notas más profundas que quedan sobre la piel.',
      valores: perfil.fondo
    }
  ];

  return (

    <Container className="py-5">

      {/* INFORMACION PRINCIPAL */}

      <Row className="g-4 mb-5">

        {/* IMAGEN DEL PERFUME */}

        <Col md={6}>

          <div
            style={{
              width: '100%',
              backgroundColor: '#fff8f5',
              borderRadius: '12px',
              overflow: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >

            <img
              src={producto.imagen}
              alt={producto.nombre}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                borderRadius: '12px'
              }}
            />

          </div>

        </Col>

        {/* DATOS DEL PRODUCTO */}

        <Col md={6}>

          <Badge
            bg="secondary"
            className="mb-3"
          >
            {producto.categoria}
          </Badge>

          {' '}

          {producto.oferta && (

            <Badge bg="danger">
              Oferta
            </Badge>

          )}

          <h1 className="mt-3">
            {producto.nombre}
          </h1>

          <Price value={producto.precio} />

          {/* DESCRIPCION */}

          <h4 className="mt-4">
            Descripción
          </h4>

          <p>
            {perfil.descripcion}
          </p>

          {/* FICHA OLFATIVA */}

          <Row className="g-3 my-3">

            {ficha.map(([titulo, valor]) => (

              <Col sm={6} key={titulo}>

                <Card className="h-100 bg-light">

                  <Card.Body>

                    <small className="text-muted d-block">
                      {titulo}
                    </small>

                    <strong>
                      {valor}
                    </strong>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

          {/* INFORMACION DE INVENTARIO */}

          <p>
            <strong>Código:</strong>{' '}
            {producto.codigo || '—'}
          </p>

          <p>
            <strong>Categoría:</strong>{' '}
            {producto.categoria}
          </p>

          <p>
            <strong>Stock disponible:</strong>{' '}
            {stock}
          </p>

          {/* ALERTA STOCK CRITICO */}

          {stock > 0 &&
            stock <=
              (Number(producto.stockCritico) || 0) && (

              <Alert variant="warning">
                Quedan pocas unidades disponibles.
              </Alert>

          )}

          {/* ALERTA SIN STOCK */}

          {stock === 0 && (

            <Alert variant="danger">
              Producto agotado.
            </Alert>

          )}

          {/* SELECTOR DE CANTIDAD */}

          <Form.Group
            className="mb-3"
            style={{ maxWidth: '180px' }}
          >

            <Form.Label>
              Cantidad
            </Form.Label>

            <div className="d-flex align-items-center gap-2">

              {/* RESTAR */}

              <Button
                variant="outline-secondary"
                type="button"
                disabled={cantidad <= 1 || stock === 0}
                onClick={() =>
                  setCantidad((anterior) =>
                    Math.max(1, anterior - 1)
                  )
                }
              >
                −
              </Button>

              {/* CANTIDAD */}

              <Form.Control
                type="number"
                min="1"
                max={stock || 1}
                value={cantidad}
                disabled={stock === 0}
                onChange={(e) =>
                  setCantidad(
                    Math.min(
                      stock || 1,
                      Math.max(
                        1,
                        Number(e.target.value) || 1
                      )
                    )
                  )
                }
              />

              {/* SUMAR */}

              <Button
                variant="outline-secondary"
                type="button"
                disabled={cantidad >= stock}
                onClick={() =>
                  setCantidad((anterior) =>
                    Math.min(stock, anterior + 1)
                  )
                }
              >
                +
              </Button>

            </div>

          </Form.Group>

          {/* BOTON AGREGAR AL CARRITO */}

          <Button
            variant="dark"
            onClick={agregar}
            disabled={stock === 0}
          >
            Añadir al carrito
          </Button>

          {/* MENSAJE DE CONFIRMACION */}

          {mensaje && (

            <Alert
              variant="success"
              className="mt-3"
              role="status"
            >
              {mensaje}
            </Alert>

          )}

        </Col>

      </Row>

      {/* PIRAMIDE OLFATIVA */}

      <section className="mb-5">

        <h2>
          Pirámide olfativa
        </h2>

        <p>
          Las notas cambian con el paso de las horas.
          Esta guía te muestra qué aromas predominan
          desde la primera aplicación hasta el fondo
          de la fragancia.
        </p>

        <Row className="g-3">

          {notas.map((etapa, index) => (

            <Col
              md={4}
              key={etapa.titulo}
            >

              <Card className="h-100 shadow-sm">

                <Card.Body>

                  <Badge
                    bg="secondary"
                    className="mb-2"
                  >
                    0{index + 1}
                  </Badge>

                  <h3>
                    {etapa.titulo}
                  </h3>

                  <p className="text-muted">
                    {etapa.tiempo}
                  </p>

                  <p>
                    {etapa.descripcion}
                  </p>

                  <div className="d-flex flex-wrap gap-2">

                    {etapa.valores.map((nota) => (

                      <Badge
                        key={nota}
                        bg="light"
                        text="dark"
                        className="border"
                      >
                        {nota}
                      </Badge>

                    ))}

                  </div>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

        <small className="text-muted d-block mt-3">
          * La evolución y duración son referenciales
          y pueden variar según la piel, el clima
          y la cantidad aplicada.
        </small>

      </section>

      {/* PRODUCTOS RELACIONADOS */}

      <section>

        <h2 className="mb-4">
          Productos relacionados
        </h2>

        <Row className="g-3">

          {relacionados.map((item) => (

            <Col
              key={item.id}
              md={4}
            >

              <Card className="h-100 shadow-sm">

                {/* IMAGEN DEL PRODUCTO */}

                <Card.Img
                  variant="top"
                  src={item.imagen}
                  alt={item.nombre}
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    backgroundColor: '#fff8f5'
                  }}
                />

                <Card.Body className="d-flex flex-column">

                  <h5>
                    {item.nombre}
                  </h5>

                  <Price value={item.precio} />

                  <Button
                    as={Link}
                    to={`/productos/${item.id}`}
                    variant="outline-dark"
                    className="mt-auto"
                  >
                    Ver detalle
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      </section>

    </Container>

  );
}

export default ProductoDetalle;
