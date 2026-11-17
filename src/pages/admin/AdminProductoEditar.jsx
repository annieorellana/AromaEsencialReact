
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import ProductoForm from '../../components/organisms/admin/ProductoForm';
import Alerta from '../../components/atoms/Alerta';

import useProductos from '../../hooks/useProductos';

import { actualizarProductoApi } from '../../services/CatalogoApi';

function AdminProductoEditar() {
  const { id } = useParams();
  const productos = useProductos();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Convertimos el ID de la URL a número.
  const producto = productos.find(
    (p) => Number(p.id) === Number(id)
  );

  const guardar = async (datos) => {
    setError('');
    setGuardando(true);

    try {
      // El backend necesita el ID de la categoría.
      const categoriaId = datos.categoriaId
        || producto.categoriaId
        || (
          datos.categoria === 'Hombre' ? 1 :
          datos.categoria === 'Mujer' ? 2 :
          datos.categoria === 'Unisex' ? 3 :
          null
        );

      const productoActualizado = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: Number(datos.precio),
        stock: Number(datos.stock),
        stockCritico: Number(datos.stockCritico),
        imagen: datos.imagen,
        oferta: Boolean(datos.oferta),
        categoriaId: Number(categoriaId)
      };

      // PUT hacia Spring Boot.
      await actualizarProductoApi(
        producto.id,
        productoActualizado
      );

      // Regresamos al listado solo si la API respondió bien.
      navigate('/admin/productos');

    } catch (e) {
      console.error('Error al actualizar producto:', e);
      setError(e.message || 'No se pudo actualizar el producto.');

    } finally {
      setGuardando(false);
    }
  };

  // El hook carga los productos de manera asíncrona.
  if (!producto) {
    return (
      <PlantillaPagina titulo="Editar producto">
        <Alerta variant="warning">
          Producto no encontrado o todavía cargando.
          {' '}
          <Link to="/admin/productos">
            Volver al listado
          </Link>
        </Alerta>
      </PlantillaPagina>
    );
  }

  // Adaptamos los datos de Spring Boot al formulario.
  const productoInicial = {
    ...producto,
    categoria: producto.categoriaNombre
      || producto.categoria
      || ''
  };

  const codigosEnUso = productos
    .filter((p) => Number(p.id) !== Number(producto.id))
    .map((p) => p.codigo);

  return (
    <PlantillaPagina titulo={`Editar: ${producto.nombre}`}>

      {error && (
        <Alerta variant="danger">
          {error}
        </Alerta>
      )}

      <Card body>
        <ProductoForm
          inicial={productoInicial}
          submitLabel={
            guardando ? 'Guardando...' : 'Guardar cambios'
          }
          codigosEnUso={codigosEnUso}
          onCancel={() => navigate('/admin/productos')}
          onSubmit={guardar}
        />
      </Card>

    </PlantillaPagina>
  );
}

export default AdminProductoEditar;
