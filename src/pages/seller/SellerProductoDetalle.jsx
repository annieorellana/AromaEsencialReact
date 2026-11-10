import React from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button
} from 'react-bootstrap';

import {
  Link,
  useParams
} from 'react-router-dom';

import Price
  from '../../components/atoms/Price';

import useProductos
  from '../../hooks/useProductos';

import {
  obtenerPerfilOlfativo
} from '../../data/perfilesOlfativos';

function SellerProductoDetalle() {

  // ========================================
  // ID DEL PRODUCTO
  // ========================================

  const { id } =
    useParams();

  // ========================================
  // PRODUCTOS
  // ========================================

  const productos =
    useProductos();

  // ========================================
  // PRODUCTO SELECCIONADO
  // ========================================

  const producto =
    productos.find(
      (item) =>
        String(item.id) ===
        String(id)
    );

  // ========================================
  // PRODUCTO NO ENCONTRADO
  // ========================================

  if (!producto) {
    return (
      <Container className="py-5">

        <Alert variant="warning">
          El producto solicitado
          no existe.
        </Alert>

        <Link to="/vendedor/productos">
          Volver a productos
        </Link>

      </Container>
    );
  }

  // ========================================
  // PERFIL OLFATIVO
  // ========================================

  const perfil =
    obtenerPerfilOlfativo(
      producto
    );

  // ========================================
  // STOCK
  // ========================================

  const stock =
    Math.max(
      0,
      Number(
        producto.stock
      ) || 0
    );

  // ========================================
  // PRODUCTOS RELACIONADOS
  // ========================================

  const relacionados =
    productos
      .filter(
        (item) =>
          String(item.id) !==
            String(producto.id) &&
          item.categoria ===
            producto.categoria
      )
      .slice(
        0,
        3
      );

  // ========================================
  // FICHA TÉCNICA
  // ========================================

  const ficha = [
    [
      'Familia olfativa',
      perfil.familia
    ],
    [
      'Concentración',
      perfil.concentracion
    ],
    [
      'Intensidad',
      perfil.intensidad
    ],
    [
      'Duración aproximada',
      perfil.duracion
    ],
    [
      'Ideal para',
      perfil.ocasion
    ]
  ];

  // ========================================
  // PIRÁMIDE OLFATIVA
  // ========================================

  const notas = [
    {
      titulo: 'Salida',
      tiempo: '0–30 min',
      descripcion:
        'Lo primero que percibes al aplicar el perfume.',
      valores:
        perfil.salida
    },
    {
      titulo: 'Corazón',
      tiempo: '30 min–4 h',
      descripcion:
        'El carácter principal que define la fragancia.',
      valores:
        perfil.corazon
    },
    {
      titulo: 'Fondo',
      tiempo: '4 h en adelante',
      descripcion:
        'Las notas más profundas que quedan sobre la piel.',
      valores:
        perfil.fondo
    }
  ];

  // ========================================
  // VISTA
  // ========================================

  return (
    <Container className="py-5">

      {/* =================================
          VOLVER
         ================================= */}

      <div className="mb-4">

        <Link
          to="/vendedor/productos"
          className="small"
        >
          ← Volver a productos
        </Link>

      </div>

      {/* =================================
          INFORMACIÓN PRINCIPAL
         ================================= */}

      <Row className="g-4 mb-5">

        {/* IMAGEN */}

        <Col md={6}>

          <div
            style={{
              width: '100%',
              backgroundColor:
                '#fff8f5',
              borderRadius:
                '12px',
              overflow:
                'visible',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center'
            }}
          >

            <img
              src={
                producto.imagen
              }
              alt={
                producto.nombre
              }
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit:
                  'contain',
                objectPosition:
                  'center',
                display:
                  'block',
                borderRadius:
                  '12px'
              }}
            />

          </div>

        </Col>

        {/* DATOS */}

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

          <Price
            value={
              producto.precio
            }
          />

          {/* DESCRIPCIÓN */}

          <h4 className="mt-4">
            Descripción
          </h4>

          <p>
            {perfil.descripcion}
          </p>

          {/* FICHA */}

          <Row className="g-3 my-3">

            {ficha.map(
              ([
                titulo,
                valor
              ]) => (

                <Col
                  sm={6}
                  key={
                    titulo
                  }
                >

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

              )
            )}

          </Row>

          {/* INVENTARIO */}

          <hr />

          <h5>
            Información del producto
          </h5>

          <p>
            <strong>
              Código:
            </strong>{' '}
            {producto.codigo ||
              '—'}
          </p>

          <p>
            <strong>
              Categoría:
            </strong>{' '}
            {producto.categoria}
          </p>

          <p>
            <strong>
              Precio:
            </strong>{' '}

            <Price
              value={
                producto.precio
              }
            />
          </p>

          <p>
            <strong>
              Stock disponible:
            </strong>{' '}
            {stock}
          </p>

          <p>
            <strong>
              Stock crítico:
            </strong>{' '}
            {producto.stockCritico ??
              '—'}
          </p>

          <p>
            <strong>
              Oferta:
            </strong>{' '}

            {producto.oferta
              ? 'Sí'
              : 'No'}
          </p>

          {/* STOCK CRÍTICO */}

          {stock > 0 &&
            stock <=
              (
                Number(
                  producto.stockCritico
                ) || 0
              ) && (

              <Alert variant="warning">
                Este producto tiene
                stock crítico.
              </Alert>

          )}

          {/* SIN STOCK */}

          {stock === 0 && (

            <Alert variant="danger">
              Producto agotado.
            </Alert>

          )}

          {/* SOLO LECTURA */}

          <Alert variant="info">
            Vista de vendedor:
            información disponible
            solo para consulta.
          </Alert>

        </Col>

      </Row>

      {/* =================================
          PIRÁMIDE OLFATIVA
         ================================= */}

      <section className="mb-5">

        <h2>
          Pirámide olfativa
        </h2>

        <p>
          Las notas cambian con el
          paso de las horas.
        </p>

        <Row className="g-3">

          {notas.map(
            (
              etapa,
              index
            ) => (

              <Col
                md={4}
                key={
                  etapa.titulo
                }
              >

                <Card className="h-100 shadow-sm">

                  <Card.Body>

                    <Badge
                      bg="secondary"
                      className="mb-2"
                    >
                      0
                      {index + 1}
                    </Badge>

                    <h3>
                      {etapa.titulo}
                    </h3>

                    <p className="text-muted">
                      {etapa.tiempo}
                    </p>

                    <p>
                      {
                        etapa.descripcion
                      }
                    </p>

                    <div className="d-flex flex-wrap gap-2">

                      {etapa.valores.map(
                        (nota) => (

                          <Badge
                            key={
                              nota
                            }
                            bg="light"
                            text="dark"
                            className="border"
                          >
                            {nota}
                          </Badge>

                        )
                      )}

                    </div>

                  </Card.Body>

                </Card>

              </Col>

            )
          )}

        </Row>

      </section>

      {/* =================================
          PRODUCTOS RELACIONADOS
         ================================= */}

      <section>

        <h2 className="mb-4">
          Productos relacionados
        </h2>

        <Row className="g-3">

          {relacionados.map(
            (item) => (

              <Col
                key={
                  item.id
                }
                md={4}
              >

                <Card className="h-100 shadow-sm">

                  <Card.Img
                    variant="top"
                    src={
                      item.imagen
                    }
                    alt={
                      item.nombre
                    }
                    style={{
                      width:
                        '100%',
                      height:
                        '220px',
                      objectFit:
                        'contain',
                      objectPosition:
                        'center',
                      backgroundColor:
                        '#fff8f5'
                    }}
                  />

                  <Card.Body className="d-flex flex-column">

                    <h5>
                      {item.nombre}
                    </h5>

                    <Price
                      value={
                        item.precio
                      }
                    />

                    <Button
                      as={
                        Link
                      }
                      to={
                        `/vendedor/productos/${item.id}`
                      }
                      variant="outline-dark"
                      className="mt-auto"
                    >
                      Ver detalle
                    </Button>

                  </Card.Body>

                </Card>

              </Col>

            )
          )}

        </Row>

      </section>

    </Container>
  );
}

export default SellerProductoDetalle;