
import React from 'react';

import {
  Container,
  Alert,
} from 'react-bootstrap';

import { useParams } from 'react-router-dom';

import ProductList from '../../components/organisms/ProductList';

import useProductos from '../../hooks/useProductos';

function CategoriaDetalle({ onAgregar }) {

  // Obtener categoría desde la URL
  const { categoria } = useParams();

  // Obtener productos desde Spring Boot
  const productos = useProductos();

  // Normalizar nombre de categoría
  const categoriaActual = String(
    categoria || ''
  ).trim().toLowerCase();

  // Filtrar productos por categoría
  const productosFiltrados = productos.filter(
    (producto) => {

      const nombreCategoria = String(
        producto.categoriaNombre ||
        producto.categoria ||
        ''
      ).trim().toLowerCase();

      return nombreCategoria === categoriaActual;
    }
  );

  // Formatear nombre para el título
  const tituloCategoria =
    categoriaActual.charAt(0).toUpperCase() +
    categoriaActual.slice(1);

  return (
    <Container className="py-5">

      <h1 className="text-center mb-4">
        Perfumes {tituloCategoria}
      </h1>

      {productosFiltrados.length === 0 ? (

        <Alert variant="info">
          No hay perfumes disponibles en esta categoría.
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

export default CategoriaDetalle;
