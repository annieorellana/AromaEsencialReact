
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import ProductoForm from '../../components/organisms/admin/ProductoForm';
import Alerta from '../../components/atoms/Alerta';
import useProductos from '../../hooks/useProductos';
import { crearProducto } from '../../services/productoService';
import { listarCategorias } from '../../services/CatalogoApi';

function AdminProductoNuevo() {
  const productos = useProductos();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardar = async (datos) => {
    if (guardando) return;

    setError('');
    setGuardando(true);

    try {
      // Consultar las categorías reales del backend
      const categorias = await listarCategorias();

      // Buscar la categoría seleccionada en el formulario
      const categoriaEncontrada = categorias.find(
        (categoria) =>
          categoria.nombre.toLowerCase() ===
          datos.categoria.toLowerCase()
      );

      if (!categoriaEncontrada) {
        throw new Error(
          'La categoría seleccionada no existe en el backend.'
        );
      }

      // Preparar el producto para Spring Boot
      const productoParaApi = {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: Number(datos.precio),
        stock: Number(datos.stock),
        stockCritico: Number(datos.stockCritico),
        imagen: datos.imagen,
        oferta: Boolean(datos.oferta),
        categoriaId: categoriaEncontrada.id
      };

      // Guardar el producto en Spring Boot
      await crearProducto(productoParaApi);

      // Regresar al listado de administración
      navigate('/admin/productos');

    } catch (e) {
      setError(
        e.message || 'No se pudo crear el producto.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <PlantillaPagina titulo="Nuevo producto">
      {error && (
        <Alerta variant="danger">
          {error}
        </Alerta>
      )}

      <Card body>
        <ProductoForm
          submitLabel={
            guardando
              ? 'Guardando...'
              : 'Crear producto'
          }
          codigosEnUso={productos.map(
            (producto) => producto.codigo
          )}
          onCancel={() => navigate('/admin/productos')}
          onSubmit={guardar}
        />
      </Card>
    </PlantillaPagina>
  );
}

export default AdminProductoNuevo;
