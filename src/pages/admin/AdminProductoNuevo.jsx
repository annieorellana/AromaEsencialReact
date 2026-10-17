import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import ProductoForm from '../../components/organisms/admin/ProductoForm';
import Alerta from '../../components/atoms/Alerta';
import useProductos from '../../hooks/useProductos';
import { crearProducto } from '../../services/productoService';
import { generarIdProducto } from '../../utils/adminFormato';

function AdminProductoNuevo() {
  const productos = useProductos();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const guardar = (datos) => {
    try {
      crearProducto({ ...datos, id: generarIdProducto(datos.nombre) });
      navigate('/admin/productos');
    } catch (e) {
      setError(e.message); // p. ej. "Ya existe un producto con ese ID."
    }
  };

  return (
    <PlantillaPagina titulo="Nuevo producto">
      {error && <Alerta variant="danger">{error}</Alerta>}
      <Card body>
        <ProductoForm submitLabel="Crear producto" codigosEnUso={productos.map((p) => p.codigo)}
          onCancel={() => navigate('/admin/productos')} onSubmit={guardar} />
      </Card>
    </PlantillaPagina>
  );
}

export default AdminProductoNuevo;
