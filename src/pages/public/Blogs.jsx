
import React from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import articulosBlog from '../../data/articulosBlog';

function Blogs() {
  return (
    <Container className="py-5">

      {/* ENCABEZADO */}
      <div className="text-center mb-5">

        <p className="text-muted mb-1">
          AromaEsencial
        </p>

        <h1>
          Noticias y Curiosidades de Perfumes
        </h1>

      </div>

      {/* ARTICULOS DEL BLOG */}
      <Row className="g-4">

        {articulosBlog.map((articulo) => (

          <Col md={6} key={articulo.id}>

            <Card className="h-100 shadow-sm">

              {/* IMAGEN COMPLETA SIN RECORTES */}
              <div
                style={{
                  width: '100%',
                  height: '350px',
                  backgroundColor: '#fff8f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px'
                }}
              >

                <img
                  src={articulo.imagen}
                  alt={articulo.titulo}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />

              </div>

              {/* INFORMACION DEL ARTICULO */}
              <Card.Body className="d-flex flex-column">

                <div className="mb-3">

                  <Badge bg="secondary">
                    {articulo.categoria}
                  </Badge>

                </div>

                <Card.Title>
                  {articulo.titulo}
                </Card.Title>

                <Card.Text>
                  {articulo.resumen}
                </Card.Text>

                {/* BOTON VER CASO */}
                <Button
                  as={Link}
                  to={`/blogs/${articulo.id}`}
                  variant="primary"
                  className="mt-auto"
                >
                  Ver caso
                </Button>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

    </Container>
  );
}

export default Blogs;
