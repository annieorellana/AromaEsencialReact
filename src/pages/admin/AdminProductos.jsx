
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import BarraFiltros from '../../components/molecules/admin/BarraFiltros';
import TablaProductos from '../../components/organisms/admin/TablaProductos';

import useProductos from '../../hooks/useProductos';

import {
  eliminarProductoApi
} from '../../services/CatalogoApi';

import {
  EVENTO_PRODUCTOS
} from '../../services/productoService';

function AdminProductos() {

  // Productos obtenidos desde Spring Boot
  const productos = useProductos();

  // Estados
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [eliminando, setEliminando] = useState(false);

  // Filtrar productos
  const visibles = productos.filter((producto) => {

    const texto = `
      ${producto.codigo || ''}
      ${producto.nombre || ''}
      ${producto.categoria || ''}
    `.toLowerCase();

    return texto.includes(
      filtro.trim().toLowerCase()
    );

  });

  // Identificar productos con stock crítico
  const criticosIds = new Set(
    productos
      .filter(
        (producto) =>
          Number(producto.stock) <=
          Number(producto.stockCritico)
      )
      .map((producto) => producto.id)
  );

  // Eliminar producto desde Spring Boot
  const borrar = async (producto) => {

    const confirmar = window.confirm(
      `¿Eliminar "${producto.nombre}"? Dejará de mostrarse en la tienda.`
    );

    if (!confirmar) {
      return;
    }

    setError('');
    setMensaje('');
    setEliminando(true);

    try {

      // Solicitud DELETE al backend
      await eliminarProductoApi(producto.id);

      // Actualizar el catálogo en React
      window.dispatchEvent(
        new Event(EVENTO_PRODUCTOS)
      );

      setMensaje(
        `El producto "${producto.nombre}" fue eliminado correctamente.`
      );

    } catch (error) {

      console.error(
        'Error al eliminar producto:',
        error
      );

      setError(
        error.message ||
        'No se pudo eliminar el producto.'
      );

    } finally {

      setEliminando(false);

    }

  };

  return (

    <PlantillaPagina
      titulo="Productos"
      acciones={
        <Link
          to="/admin/productos/nuevo"
          className="btn btn-dark"
        >
          Nuevo producto
        </Link>
      }
    >

      {/* MENSAJE DE EXITO */}

      {mensaje && (
        <Alert variant="success">
          {mensaje}
        </Alert>
      )}

      {/* MENSAJE DE ERROR */}

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {/* INDICADOR DE ELIMINACION */}

      {eliminando && (
        <Alert variant="info">
          Eliminando producto...
        </Alert>
      )}

      {/* FILTROS */}

      <BarraFiltros
        busqueda={filtro}
        onBusqueda={setFiltro}
        placeholder="Buscar por código, nombre o categoría"
        etiqueta="Buscar productos"
      />

      {/* TABLA DE PRODUCTOS */}

      <TablaProductos
        productos={visibles}
        criticosIds={criticosIds}
        onEliminar={borrar}
      />

    </PlantillaPagina>

  );

}

export default AdminProductos;
