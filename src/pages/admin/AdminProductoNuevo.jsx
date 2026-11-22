
import React, { useRef, useState } from 'react';

import { Card } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import ProductoForm
  from '../../components/organisms/admin/ProductoForm';

import Alerta
  from '../../components/atoms/Alerta';

import useProductos
  from '../../hooks/useProductos';

import {
  crearProducto
} from '../../services/productoService';

// ==========================================
// AROMAESENCIAL
// ADMINISTRACIÓN - NUEVO PRODUCTO
// ==========================================

function AdminProductoNuevo() {

  const navigate = useNavigate();

  // Productos existentes en MySQL.
  const productos = useProductos();

  const [error, setError] = useState('');

  const [guardando, setGuardando] =
    useState(false);

  // Evitar peticiones duplicadas.
  const guardadoEnCurso = useRef(false);

  // ========================================
  // CÓDIGOS EXISTENTES
  // ========================================

  const codigosEnUso = productos.map(
    (producto) => producto.codigo
  );

  // ========================================
  // GUARDAR PRODUCTO EN MYSQL
  // ========================================

  const guardar = async (datos) => {

    if (guardadoEnCurso.current) {
      return;
    }

    guardadoEnCurso.current = true;

    setError('');
    setGuardando(true);

    try {

      // ======================================
      // OBTENER CATEGORÍA REAL
      // ======================================

      // ProductoForm.jsx ya consulta las
      // categorías desde Spring Boot.
      //
      // No utilizamos ID fijos.
      // No necesitamos consultar otra vez
      // el nombre de la categoría.

      const categoriaId = Number(
        datos.categoriaId
      );

      if (
        !Number.isSafeInteger(categoriaId) ||
        categoriaId <= 0
      ) {
        throw new Error(
          'Selecciona una categoría válida.'
        );
      }

      // ======================================
      // VALIDAR CAMPOS
      // ======================================

      const codigo = String(
        datos.codigo || ''
      ).trim();

      const nombre = String(
        datos.nombre || ''
      ).trim();

      const descripcion = String(
        datos.descripcion || ''
      ).trim();

      const precio = Number(datos.precio);
      const stock = Number(datos.stock);

      const stockCritico = Number(
        datos.stockCritico
      );

      if (!codigo || !nombre) {
        throw new Error(
          'El código y nombre son obligatorios.'
        );
      }

      if (
        codigo.length > 20 ||
        nombre.length > 120 ||
        descripcion.length > 500
      ) {
        throw new Error(
          'Uno de los campos supera el largo permitido.'
        );
      }

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
          'El stock debe ser un entero mayor o igual a cero.'
        );
      }

      if (
        !Number.isSafeInteger(stockCritico) ||
        stockCritico < 0
      ) {
        throw new Error(
          'El stock crítico debe ser un entero mayor o igual a cero.'
        );
      }

      // ======================================
      // PREPARAR PRODUCTO PARA SPRING BOOT
      // ======================================

      const productoParaApi = {

        codigo,
        nombre,
        descripcion,

        precio,
        stock,
        stockCritico,

        imagen: String(
          datos.imagen || ''
        ).trim(),

        oferta: Boolean(
          datos.oferta
        ),

        // Categoría real obtenida desde MySQL.
        categoriaId
      };

      // ======================================
      // GUARDAR MEDIANTE API REST + JWT
      // ======================================

      const productoCreado = await crearProducto(
        productoParaApi
      );

      // Spring Boot devuelve el ID generado.
      if (!productoCreado?.id) {
        throw new Error(
          'El servidor no confirmó la creación del producto.'
        );
      }

      // ======================================
      // VOLVER A ADMINISTRACIÓN
      // ======================================

      navigate(
        '/admin/productos',
        {
          replace: true
        }
      );

    } catch (err) {

      console.error(
        'Error al crear el producto:',
        err
      );

      setError(
        err.message ||
        'No fue posible crear el producto.'
      );

    } finally {

      guardadoEnCurso.current = false;
      setGuardando(false);

    }
  };

  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <PlantillaPagina
      titulo="Nuevo producto"
      descripcion="Registrar un perfume en el catálogo de AromaEsencial."
    >

      {/* =================================
          ERRORES
         ================================= */}

      {error && (

        <Alerta variant="danger">
          {error}
        </Alerta>

      )}

      {/* =================================
          FORMULARIO
         ================================= */}

      <Card body>

        <ProductoForm

          submitLabel={
            guardando
              ? 'Guardando producto...'
              : 'Crear producto'
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

export default AdminProductoNuevo;
