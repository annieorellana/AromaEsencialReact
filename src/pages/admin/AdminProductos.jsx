import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import BarraFiltros from '../../components/molecules/admin/BarraFiltros';
import TablaProductos from '../../components/organisms/admin/TablaProductos';
import useProductos from '../../hooks/useProductos';
import { eliminarProducto, obtenerProductosStockCritico } from '../../services/productoService';

function AdminProductos() {
  const productos = useProductos();
  const [filtro, setFiltro] = useState('');
  const visibles = productos.filter((p) => `${p.codigo} ${p.nombre} ${p.categoria}`.toLowerCase().includes(filtro.trim().toLowerCase()));
  const criticosIds = new Set(obtenerProductosStockCritico().map((p) => p.id));

  const borrar = (p) => {
    if (window.confirm(`¿Eliminar "${p.nombre}"? Dejará de mostrarse en la tienda.`)) eliminarProducto(p.id);
  };

  return (
    <PlantillaPagina titulo="Productos" acciones={<Link to="/admin/productos/nuevo" className="btn btn-dark">Nuevo producto</Link>}>
      <BarraFiltros busqueda={filtro} onBusqueda={setFiltro} placeholder="Buscar por código, nombre o categoría" etiqueta="Buscar productos" />
      <TablaProductos productos={visibles} criticosIds={criticosIds} onEliminar={borrar} />
    </PlantillaPagina>
  );
}

export default AdminProductos;
