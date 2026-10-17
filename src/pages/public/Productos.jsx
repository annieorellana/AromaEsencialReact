import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Alert
} from 'react-bootstrap';

import ProductList from '../../components/organisms/ProductList';
import useProductos from '../../hooks/useProductos';

function Productos({ onAgregar }) {
  const productos = useProductos();

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('');

  const productosFiltrados = productos
    .filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim());

      const coincideCategoria =
        categoria === '' ||
        producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    })
    .sort((a, b) => {
      if (orden === 'menor') {
        return a.precio - b.precio;
      }

      if (orden === 'mayor') {
        return b.precio - a.precio;
      }

      return 0;
    });

  return (
    <Container className="py-5">
      <h1 className="text-center mb-3">
        Nuestros Perfumes
      </h1>

      <p className="text-center text-muted mb-4">
        Descubre nuestra colección de fragancias para
        hombre, mujer y unisex.
      </p>

      <Row className="g-3 mb-4">

        <Col md={4}>
          <Form.Group>
            <Form.Label>Buscar perfume</Form.Label>

            <Form.Control
              type="search"
              placeholder="Ej: Classic Wood"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>

            <Form.Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Unisex">Unisex</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Ordenar por precio</Form.Label>

            <Form.Select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="">Orden original</option>
              <option value="menor">Menor a mayor</option>
              <option value="mayor">Mayor a menor</option>
            </Form.Select>
          </Form.Group>
        </Col>

      </Row>

      <p className="text-muted">
        Se encontraron {productosFiltrados.length} perfumes.
      </p>

      {productosFiltrados.length === 0 ? (
        <Alert variant="warning">
          No encontramos perfumes que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <ProductList
          productos={productosFiltrados}
          onAgregar={onAgregar}
        />
      )}
    </Container>
  );
}

export default Productos;