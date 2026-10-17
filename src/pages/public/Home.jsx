
import React, { useEffect, useState } from 'react';

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import useProductos from '../../hooks/useProductos';
import Price from '../../components/atoms/Price';

function Home() {

  // ==========================================
  // OBTENER PRODUCTOS DEL CATALOGO
  // ==========================================

  const productos = useProductos();

  // PRODUCTOS DESTACADOS
  const destacados = productos
    .filter((producto) => Number(producto.stock) > 0)
    .slice(0, 4);

  // PERFUMES DISPONIBLES PARA EL CARRUSEL
  // INCLUYE HOMBRE, MUJER Y UNISEX

  const perfumesCarrusel = productos.filter(
    (producto) =>
      Number(producto.stock) > 0 &&
      producto.imagen
  );

  // ==========================================
  // CARRUSEL AUTOMATICO
  // ==========================================

  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {

    if (perfumesCarrusel.length <= 1) {
      return;
    }

    // CAMBIAR IMAGEN CADA 4 SEGUNDOS

    const intervalo = setInterval(() => {

      setIndiceActual((anterior) =>
        (anterior + 1) % perfumesCarrusel.length
      );

    }, 4000);

    return () => clearInterval(intervalo);

  }, [perfumesCarrusel.length]);

  // PERFUME QUE SE MUESTRA ACTUALMENTE

  const indiceSeguro = perfumesCarrusel.length
    ? indiceActual % perfumesCarrusel.length
    : 0;

  const perfumeActual = perfumesCarrusel[indiceSeguro];

  return (

    <>

      {/* =====================================
          SECCION PRINCIPAL
      ===================================== */}

      <section className="aroma-hero">

        <Container className="py-5">

          <Row className="align-items-center g-4">

            {/* TEXTO PRINCIPAL */}

            <Col lg={6}>

              <p className="text-muted mb-2">
                Perfumería AromaEsencial
              </p>

              <h1 className="fw-bold display-5 mb-3">
                Bienvenidos a AromaEsencial
              </h1>

              <p className="lead">
                Descubre fragancias únicas para cada ocasión.
                Encuentra tu aroma ideal en nuestra colección
                para hombre, mujer y unisex.
              </p>

              {/* BOTONES PRINCIPALES */}

              <div className="d-flex flex-wrap gap-2 mt-4">

                <Button
                  as={Link}
                  to="/productos"
                  className="btn-aroma-principal"
                >
                  Explorar perfumes
                </Button>

                <Button
                  as={Link}
                  to="/ofertas"
                  className="btn-aroma-secundario"
                >
                  Ver ofertas
                </Button>

              </div>

            </Col>

            {/* =================================
                CARRUSEL ELEGANTE DE PERFUMES
                SOLO FOTOGRAFIAS
            ================================= */}

            <Col lg={6}>

              {perfumeActual ? (

                <div className="carrusel-aroma-elegante" style={{ height: 'auto', maxHeight: 'none', overflow: 'visible' }}>

                  <Link
                    to={`/productos/${perfumeActual.id}`}
                    className="enlace-carrusel-aroma"
                     style={{ display: 'block', height: 'auto', overflow: 'visible' }}
                  >

                    <img
                      key={perfumeActual.id}
                      src={perfumeActual.imagen}
                      alt={perfumeActual.nombre}
                      className="imagen-carrusel-elegante"
                      style={{ width: '100%', height: 'auto', maxHeight: 'none', aspectRatio: 'auto', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                    />

                  </Link>

                </div>

              ) : (

                <div className="carrusel-aroma-elegante p-5 text-center">

                  <p>
                    No hay perfumes disponibles actualmente.
                  </p>

                </div>

              )}

            </Col>

          </Row>

        </Container>

      </section>

      {/* =====================================
          CATEGORIAS
      ===================================== */}

      <section className="aroma-categorias">

        <Container className="py-5">

          <div className="text-center mb-4">

            <p className="text-muted mb-1">
              Encuentra tu estilo
            </p>

            <h2>
              Categorías
            </h2>

          </div>

          <Row className="g-4">

            {/* CATEGORIA HOMBRE */}

            <Col md={4}>

              <Card className="h-100 shadow-sm text-center">

                <Card.Body className="p-4">

                  <h3>Hombre</h3>

                  <p className="text-muted">
                    Fragancias frescas, intensas,
                    especiadas y amaderadas.
                  </p>

                  <Button
                    as={Link}
                    to="/categorias/hombre"
                    className="btn-aroma-secundario"
                  >
                    Ver perfumes
                  </Button>

                </Card.Body>

              </Card>

            </Col>

            {/* CATEGORIA MUJER */}

            <Col md={4}>

              <Card className="h-100 shadow-sm text-center">

                <Card.Body className="p-4">

                  <h3>Mujer</h3>

                  <p className="text-muted">
                    Aromas florales, suaves,
                    elegantes y envolventes.
                  </p>

                  <Button
                    as={Link}
                    to="/categorias/mujer"
                    className="btn-aroma-secundario"
                  >
                    Ver perfumes
                  </Button>

                </Card.Body>

              </Card>

            </Col>

            {/* CATEGORIA UNISEX */}

            <Col md={4}>

              <Card className="h-100 shadow-sm text-center">

                <Card.Body className="p-4">

                  <h3>Unisex</h3>

                  <p className="text-muted">
                    Fragancias equilibradas,
                    versátiles y contemporáneas.
                  </p>

                  <Button
                    as={Link}
                    to="/categorias/unisex"
                    className="btn-aroma-secundario"
                  >
                    Ver perfumes
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          </Row>

        </Container>

      </section>

      {/* =====================================
          PRODUCTOS DESTACADOS
      ===================================== */}

      <section className="aroma-destacados">

        <Container className="py-5">

          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

            <div>

              <p className="text-muted mb-1">
                Nuestra selección
              </p>

              <h2 className="mb-0">
                Perfumes destacados
              </h2>

            </div>

            <Button
              as={Link}
              to="/productos"
              className="btn-aroma-secundario mt-3 mt-md-0"
            >
              Ver todos
            </Button>

          </div>

          <Row className="g-4">

            {destacados.map((producto) => (

              <Col
                xs={12}
                sm={6}
                lg={3}
                key={producto.id}
              >

                <Card className="h-100 shadow-sm">

                  <Card.Img
                    variant="top"
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{
                      height: '260px',
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />

                  <Card.Body className="d-flex flex-column">

                    <div className="mb-2">

                      <Badge bg="secondary">
                        {producto.categoria}
                      </Badge>

                      {producto.oferta && (

                        <Badge
                          bg="danger"
                          className="ms-2"
                        >
                          Oferta
                        </Badge>

                      )}

                    </div>

                    <Card.Title>
                      {producto.nombre}
                    </Card.Title>

                    <Card.Text className="text-muted">
                      {producto.descripcion}
                    </Card.Text>

                    <div className="mt-auto">

                      <Price
                        value={producto.precio}
                      />

                      <p className="small text-muted mt-2">
                        Stock disponible: {producto.stock}
                      </p>

                      <Button
                        as={Link}
                        to={`/productos/${producto.id}`}
                        className="btn-aroma-principal w-100"
                      >
                        Ver detalle
                      </Button>

                    </div>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

        </Container>

      </section>

      {/* =====================================
          INFORMACION DE LA PERFUMERIA
      ===================================== */}

      <section className="aroma-informativo">

        <Container className="py-5">

          <Row className="align-items-center g-4">

            <Col md={7}>

              <p className="text-muted mb-1">
                Conoce nuestra historia
              </p>

              <h2>
                Más que una tienda de perfumes
              </h2>

              <p>
                AromaEsencial busca acercar fragancias
                para distintos gustos, estilos y momentos,
                ofreciendo una experiencia de compra
                sencilla y cercana.
              </p>

            </Col>

            <Col md={5} className="text-md-end">

              <Button
                as={Link}
                to="/nosotros"
                className="btn-aroma-secundario"
              >
                Conocer AromaEsencial
              </Button>

            </Col>

          </Row>

        </Container>

      </section>

    </>

  );
}

export default Home;
