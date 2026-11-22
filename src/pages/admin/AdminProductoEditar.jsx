
import React, { useRef, useState } from 'react';

import { Card } from 'react-bootstrap';

import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import ProductoForm
  from '../../components/organisms/admin/ProductoForm';

import Alerta
  from '../../components/atoms/Alerta';

import useProductos
  from '../../hooks/useProductos';

import {
  listarCategorias
} from '../../services/CatalogoApi';

import {
  actualizarProducto
} from '../../services/productoService';

// ==========================================
// AROMAESENCIAL
// EDITAR PRODUCTO - MYSQL
// ==========================================

function AdminProductoEditar() {

  const { id } = useParams();

  const navigate = useNavigate();

  // Productos reales de Spring Boot.
  const productos = useProductos();

  const [error, setError] = useState('');

  const [guardando, setGuardando] =
    useState(false);

  const guardadoEnCurso = useRef(false);

  // ========================================
  // BUSCAR PRODUCTO POR ID REAL
  // ========================================

  const producto = productos.find(
    (item) =>
      Number(item.id) === Number(id)
  );

  // ========================================
  // NORMALIZAR NOMBRE DE CATEGORÍA
  // ========================================

  const normalizarTexto = (valor) =>
    String(valor ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // ========================================
  // GUARDAR CAMBIOS
  // ========================================

  const guardar = async (datos) => {

    // Evitar peticiones duplicadas.
    if (guardadoEnCurso.current) {
      return;
    }

    if (!producto?.id) {
      setError(
        'No se pudo identificar el producto.'
      );
      return;
    }

    guardadoEnCurso.current = true;

    setError('');
    setGuardando(true);

    try {

      // ======================================
      // OBTENER CATEGORÍAS REALES
      // ======================================

      const categorias =
        await listarCategorias();

      if (
        !Array.isArray(categorias) ||
        categorias.length === 0
      ) {
        throw new Error(
          'No se pudieron obtener las categorías desde MySQL.'
        );
      }

      // ======================================
      // IDENTIFICAR CATEGORÍA SELECCIONADA
      // ======================================

      // Compatible con formularios que
      // entregan categoriaId directamente.
      const idSeleccionado =
        Number(datos.categoriaId);

      let categoriaEncontrada = null;

      if (
        Number.isSafeInteger(idSeleccionado) &&
        idSeleccionado > 0
      ) {

        categoriaEncontrada = categorias.find(
          (categoria) =>
            Number(categoria.id) ===
            idSeleccionado
        );

      }

      // Compatibilidad con ProductoForm.jsx
      // actual, que entrega el nombre
      // de la categoría seleccionada.
      if (!categoriaEncontrada) {

        categoriaEncontrada = categorias.find(
          (categoria) =>
            normalizarTexto(categoria.nombre) ===
            normalizarTexto(datos.categoria)
        );

      }

      if (!categoriaEncontrada) {

        throw new Error(
          'La categoría seleccionada no existe en MySQL.'
        );

      }

      // ======================================
      // VALIDAR VALORES NUMÉRICOS
      // ======================================

      const precio = Number(datos.precio);
      const stock = Number(datos.stock);

      const stockCritico =
        Number(datos.stockCritico);

      if (
        !Number.isSafeInteger(precio) ||
        precio <= 0
      ) {
        throw new Error(
          'El precio debe ser un número entero mayor a cero.'
        );
      }

      if (
        !Number.isSafeInteger(stock) ||
        stock < 0
      ) {
        throw new Error(
          'El stock debe ser un número entero mayor o igual a cero.'
        );
      }

      if (
        !Number.isSafeInteger(stockCritico) ||
        stockCritico < 0
      ) {
        throw new Error(
          'El stock crítico debe ser un número entero mayor o igual a cero.'
        );
      }

      // ======================================
      // CONSTRUIR PRODUCTO PARA SPRING BOOT
      // ======================================

      const productoActualizado = {

        codigo: String(
          datos.codigo || ''
        ).trim(),

        nombre: String(
          datos.nombre || ''
        ).trim(),

        descripcion: String(
          datos.descripcion || ''
        ).trim(),

        precio,

        stock,

        stockCritico,

        imagen: String(
          datos.imagen || ''
        ).trim(),

        oferta: Boolean(datos.oferta),

        // ID consultado desde MySQL.
        // No se utilizan números fijos.
        categoriaId: Number(
          categoriaEncontrada.id
        )

      };

      // ======================================
      // ACTUALIZAR MEDIANTE JWT
      // ======================================

      // productoService utiliza CatalogoApi
      // y notifica los cambios al catálogo.
      await actualizarProducto(
        producto.id,
        productoActualizado
      );

      // ======================================
      // VOLVER AL LISTADO
      // ======================================

      navigate(
        '/admin/productos',
        {
          replace: true
        }
      );

    } catch (err) {

      console.error(
        'Error al actualizar producto:',
        err
      );

      setError(
        err.message ||
        'No fue posible actualizar el producto.'
      );

    } finally {

      guardadoEnCurso.current = false;

      setGuardando(false);

    }
  };

  // ========================================
  // PRODUCTO NO ENCONTRADO O CARGANDO
  // ========================================

  if (!producto) {

    return (

      <PlantillaPagina titulo="Editar producto">

        <Alerta variant="warning">

          Producto no encontrado
          o todavía cargando.

          {' '}

          <Link to="/admin/productos">
            Volver al listado
          </Link>

        </Alerta>

      </PlantillaPagina>

    );
  }

  // ========================================
  // ADAPTAR RESPUESTA DE SPRING BOOT
  // ========================================

  const productoInicial = {

    ...producto,

    categoria:
      producto.categoriaNombre ||
      producto.categoria ||
      ''

  };

  // ========================================
  // CÓDIGOS DE LOS DEMÁS PRODUCTOS
  // ========================================

  const codigosEnUso = productos

    .filter(
      (item) =>
        Number(item.id) !==
        Number(producto.id)
    )

    .map(
      (item) => item.codigo
    );

  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <PlantillaPagina
      titulo={`Editar: ${producto.nombre}`}
    >

      {/* =================================
          ERRORES DEL BACKEND
         ================================= */}

      {error && (

        <Alerta variant="danger">
          {error}
        </Alerta>

      )}

      {/* =================================
          FORMULARIO DE EDICIÓN
         ================================= */}

      <Card body>

        <ProductoForm

          inicial={productoInicial}

          submitLabel={
            guardando
              ? 'Guardando...'
              : 'Guardar cambios'
          }

          codigosEnUso={codigosEnUso}

          onCancel={() =>
            navigate('/admin/productos')
          }

          onSubmit={guardar}

        />

      </Card>

    </PlantillaPagina>

  );
}

export default AdminProductoEditar;
