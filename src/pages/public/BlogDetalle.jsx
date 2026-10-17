import React from 'react';

import {
  Container,
  Card,
  Badge,
  Button,
  Alert
} from 'react-bootstrap';

import {
  Link,
  useParams
} from 'react-router-dom';

import articulosBlog from '../../data/articulosBlog';

function BlogDetalle() {

  const { id } = useParams();

  const articulo = articulosBlog.find(
    (item) => item.id === id
  );

  if (!articulo) {

    return (
      <Container className="py-5">

        <Alert variant="warning">
          El artículo solicitado no existe.
        </Alert>

        <Button
          as={Link}
          to="/blogs"
          variant="primary"
        >
          Volver a blogs
        </Button>

      </Container>
    );
  }

  return (
    <Container className="py-5">

      <Card
        className="shadow-sm mx-auto"
        style={{ maxWidth: '900px' }}
      >

        <Card.Img
          variant="top"
          src={articulo.imagen}
          alt={articulo.titulo}
          style={{
            height: '420px',
            objectFit: 'cover'
          }}
        />

        <Card.Body className="p-4">

          <Badge
            bg="secondary"
            className="mb-3"
          >
            {articulo.categoria}
          </Badge>

          <h1 className="mb-4">
            {articulo.titulo}
          </h1>

          {articulo.parrafos.map((parrafo, index) => (

            <p key={index}>
              {parrafo}
            </p>

          ))}

          <Button
            as={Link}
            to="/blogs"
            variant="primary"
            className="mt-3"
          >
            Volver a blogs
          </Button>

        </Card.Body>

      </Card>

    </Container>
  );
}

export default BlogDetalle;