import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import ProductoForm from '../../components/organisms/admin/ProductoForm';
import Alerta from '../../components/atoms/Alerta';
import useProductos from '../../hooks/useProductos';
import { actualizarProducto } from '../../services/productoService';

function AdminProductoEditar() {
  const { id } = useParams();
  const productos = useProductos();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const producto = productos.find((p) => p.id === id);

  if (!producto) return <Alerta variant="warning">Producto no encontrado. <Link to="/admin/productos">Volver al listado</Link></Alerta>;

  const guardar = (datos) => {
    try {
      actualizarProducto(producto.id, datos);
      navigate('/admin/productos');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <PlantillaPagina titulo={`Editar: ${producto.nombre}`}>
      {error && <Alerta variant="danger">{error}</Alerta>}
      <Card body>
        <ProductoForm inicial={producto} submitLabel="Guardar cambios"
          codigosEnUso={productos.filter((p) => p.id !== producto.id).map((p) => p.codigo)}
          onCancel={() => navigate('/admin/productos')} onSubmit={guardar} />
      </Card>
    </PlantillaPagina>
  );
}

export default AdminProductoEditar;
