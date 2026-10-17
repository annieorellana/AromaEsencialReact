import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Button from '../atoms/Button';
import Price from '../atoms/Price';
import ProductImage from '../atoms/ProductImage';
import Badge from '../atoms/Badge';

function ProductCard({ producto, onAgregar }) {
  return (
    <Card className="h-100 shadow-sm">
      <ProductImage
        src={producto.imagen}
        alt={producto.nombre}
      />

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary">
            {producto.categoria}
          </Badge>

          {producto.oferta && (
            <Badge bg="danger">
              Oferta
            </Badge>
          )}
        </div>

        <Card.Title>
          {producto.nombre}
        </Card.Title>

        <Card.Text>
          {producto.descripcion}
        </Card.Text>

        <div className="mt-auto">
          <Price value={producto.precio} />

          <p className="text-muted mt-2">
            Stock: {producto.stock}
          </p>

          <Button
            variant="dark"
            className="w-100"
            onClick={() => onAgregar(producto)}
            disabled={producto.stock === 0}
          >
            Agregar al carrito
          </Button>

          <Link
            to={`/productos/${producto.id}`}
            className="btn btn-outline-secondary w-100 mt-2"
          >
            Ver detalles
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;