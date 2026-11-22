
import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import BarraFiltros
  from '../../components/molecules/admin/BarraFiltros';

import TablaProductos
  from '../../components/organisms/admin/TablaProductos';

import useProductos
  from '../../hooks/useProductos';

import {
  eliminarProductoApi
} from '../../services/CatalogoApi';

import {
  EVENTO_PRODUCTOS
} from '../../services/productoService';

// ==========================================
// AROMAESENCIAL
// ADMINISTRACIÓN DE PRODUCTOS
// ==========================================

function AdminProductos() {

  // ========================================
  // PRODUCTOS DESDE MYSQL
  // ========================================

  const productos = useProductos();

  // ========================================
  // ESTADOS
  // ========================================

  const [filtro, setFiltro] =
    useState('');

  const [error, setError] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const [eliminando, setEliminando] =
    useState(false);

  // ========================================
  // ADAPTAR RESPUESTA DE SPRING BOOT
  // ========================================

  // ProductoResponse.java devuelve:
  // categoriaId y categoriaNombre.
  //
  // TablaProductos.jsx utiliza:
  // producto.categoria.
  //
  // Conservamos todos los datos originales
  // y agregamos el campo esperado por React.

  const productosNormalizados = productos.map(
    (producto) => ({

      ...producto,

      categoria:
        producto.categoriaNombre ||
        producto.categoria ||
        'Sin categoría'

    })
  );

  // ========================================
  // FILTRAR PRODUCTOS
  // ========================================

  const visibles = productosNormalizados.filter(
    (producto) => {

      const texto = [
        producto.codigo,
        producto.nombre,
        producto.categoria
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return texto.includes(
        filtro.trim().toLowerCase()
      );
    }
  );

  // ========================================
  // DETECTAR STOCK CRÍTICO
  // ========================================

  const criticosIds = new Set(

    productosNormalizados

      .filter((producto) => {

        const stock =
          Number(producto.stock);

        const stockCritico =
          Number(producto.stockCritico);

        return (
          Number.isFinite(stock) &&
          Number.isFinite(stockCritico) &&
          stock <= stockCritico
        );
      })

      .map((producto) => producto.id)

  );

  // ========================================
  // ELIMINAR PRODUCTO
  // ========================================

  const borrar = async (producto) => {

    // Evitar solicitudes simultáneas.
    if (eliminando) {
      return;
    }

    if (!producto?.id) {
      setError(
        'No se pudo identificar el producto.'
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Eliminar el producto "${producto.nombre}"?\n\n` +
      'El producto dejará de aparecer en la tienda.\n\n' +
      'Si ya fue vendido, Spring Boot impedirá ' +
      'su eliminación para conservar las boletas.'
    );

    if (!confirmar) {
      return;
    }

    setError('');
    setMensaje('');
    setEliminando(true);

    try {

      // ======================================
      // DELETE CON JWT
      // ======================================

      await eliminarProductoApi(
        producto.id
      );

      // ======================================
      // ACTUALIZAR CATÁLOGO EN REACT
      // ======================================

      window.dispatchEvent(
        new Event(EVENTO_PRODUCTOS)
      );

      setMensaje(
        `El producto "${producto.nombre}" fue eliminado correctamente.`
      );

    } catch (err) {

      console.error(
        'Error al eliminar producto:',
        err
      );

      // ======================================
      // MANEJO DE ERRORES HTTP
      // ======================================

      if (err.status === 401) {

        setError(
          'Tu sesión ha vencido. Inicia sesión nuevamente.'
        );

      } else if (err.status === 403) {

        setError(
          'No tienes permisos para eliminar productos.'
        );

      } else if (err.status === 409) {

        setError(
          'No es posible eliminar el producto porque ' +
          'existe un conflicto con registros asociados. ' +
          'Si tiene boletas, debes conservarlo ' +
          'para mantener el historial de compras.'
        );

      } else {

        setError(
          err.message ||
          'No fue posible eliminar el producto.'
        );

      }

    } finally {

      setEliminando(false);

    }
  };

  // ========================================
  // INTERFAZ
  // ========================================

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

      {/* =================================
          MENSAJE DE ÉXITO
         ================================= */}

      {mensaje && (

        <Alert variant="success">
          {mensaje}
        </Alert>

      )}

      {/* =================================
          MENSAJE DE ERROR
         ================================= */}

      {error && (

        <Alert variant="danger">
          {error}
        </Alert>

      )}

      {/* =================================
          ESTADO DE ELIMINACIÓN
         ================================= */}

      {eliminando && (

        <Alert variant="info">
          Eliminando producto...
        </Alert>

      )}

      {/* =================================
          FILTRO DE PRODUCTOS
         ================================= */}

      <BarraFiltros

        busqueda={filtro}

        onBusqueda={setFiltro}

        placeholder="Buscar por código, nombre o categoría"

        etiqueta="Buscar productos"

      />

      {/* =================================
          TABLA DE PRODUCTOS
         ================================= */}

      <TablaProductos

        productos={visibles}

        criticosIds={criticosIds}

        onEliminar={borrar}

      />

    </PlantillaPagina>
  );
}

export default AdminProductos;
