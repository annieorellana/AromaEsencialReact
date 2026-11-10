import React, {
  useState
} from 'react';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import BarraFiltros
  from '../../components/molecules/admin/BarraFiltros';

import TablaProductosSeller
  from '../../components/organisms/seller/TablaProductosSeller';

import useProductos
  from '../../hooks/useProductos';

function SellerProductos() {
  const productos =
    useProductos();

  const [
    filtro,
    setFiltro
  ] = useState('');

  const visibles =
    productos.filter(
      (producto) =>
        `
          ${producto.codigo}
          ${producto.nombre}
          ${producto.categoria}
        `
          .toLowerCase()
          .includes(
            filtro
              .trim()
              .toLowerCase()
          )
    );

  return (
    <PlantillaPagina
      titulo="Productos"
    >

      <BarraFiltros
        busqueda={filtro}
        onBusqueda={
          setFiltro
        }
        placeholder="Buscar por código, nombre o categoría"
        etiqueta="Buscar productos"
      />

      <TablaProductosSeller
        productos={
          visibles
        }
      />

    </PlantillaPagina>
  );
}

export default SellerProductos;