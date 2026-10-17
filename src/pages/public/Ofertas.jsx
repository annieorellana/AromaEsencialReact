import React from 'react';
import { Container } from 'react-bootstrap';

import ProductList from '../../components/organisms/ProductList';
import useProductos from '../../hooks/useProductos';

function Ofertas({ onAgregar }) {
  const productos = useProductos();

  const productosEnOferta = productos.filter(
    (producto) => producto.oferta === true
  );

  return (
    <Container className="py-5">
      <h1 className="text-center mb-3">
        Ofertas especiales
      </h1>

      <p className="text-center text-muted mb-4">
        Descubre nuestros perfumes seleccionados.
      </p>

      <ProductList
        productos={productosEnOferta}
        onAgregar={onAgregar}
      />
    </Container>
  );
}

export default Ofertas;