import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import ProductList from '../../components/organisms/ProductList';
import useProductos from '../../hooks/useProductos';

function CategoriaDetalle({ onAgregar }) {
  const { categoria } = useParams();

  const productos = useProductos();

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.categoria.toLowerCase() ===
      categoria.toLowerCase()
  );

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        Perfumes {categoria}
      </h1>

      <ProductList
        productos={productosFiltrados}
        onAgregar={onAgregar}
      />
    </Container>
  );
}

export default CategoriaDetalle;