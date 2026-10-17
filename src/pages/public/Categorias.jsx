import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Categorias() {
  const categorias = ['Hombre', 'Mujer', 'Unisex'];

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Categorías</h1>

      <Row className="g-4">
        {categorias.map((categoria) => (
          <Col md={4} key={categoria}>
            <Card className="text-center shadow-sm h-100">
              <Card.Body className="py-5">
                <Card.Title className="fs-3">
                  {categoria}
                </Card.Title>

                <Card.Text>
                  Descubre nuestros perfumes {categoria.toLowerCase()}.
                </Card.Text>

                <Button
                  as={Link}
                  to={`/categorias/${categoria.toLowerCase()}`}
                  variant="primary"
                >
                  Ver perfumes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Categorias;