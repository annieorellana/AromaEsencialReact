import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import ProductCard from '../molecules/ProductCard';

function ProductList({ productos = [], onAgregar }) {
  return (
    <Container className="py-4">
      {productos.length === 0 ? (
        <Alert variant="info" className="text-center">
          No se encontraron productos disponibles.
        </Alert>
      ) : (
        <Row className="g-4">
          {productos.map((producto) => (
            <Col
              key={producto.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <ProductCard
                producto={producto}
                onAgregar={onAgregar}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ProductList;