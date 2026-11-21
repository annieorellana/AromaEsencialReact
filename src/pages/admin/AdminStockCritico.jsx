
import React from 'react';

import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';

import TablaStockCritico from '../../components/organisms/admin/TablaStockCritico';

import useProductos from '../../hooks/useProductos';

function AdminStockCritico() {

  // Obtener productos desde Spring Boot
  const productos = useProductos();

  // Seleccionar productos con stock crítico
  const productosCriticos = productos.filter(
    (producto) => {

      const stock = Number(producto.stock);

      const stockCritico = Number(
        producto.stockCritico
      );

      return (
        Number.isFinite(stock) &&
        Number.isFinite(stockCritico) &&
        stock <= stockCritico
      );
    }
  );

  return (
    <PlantillaPagina
      titulo="Stock crítico"
      descripcion="Productos con stock igual o inferior a su umbral crítico."
    >
      <TablaStockCritico
        productos={productosCriticos}
      />
    </PlantillaPagina>
  );
}

export default AdminStockCritico;
