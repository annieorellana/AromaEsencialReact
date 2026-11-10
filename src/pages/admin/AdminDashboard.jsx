import React from 'react';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import GrillaEstadisticas
  from '../../components/organisms/admin/GrillaEstadisticas';

import GraficosDashboard
  from '../../components/organisms/admin/GraficosDashboard';

import OrdenesRecientesDashboard
  from '../../components/organisms/admin/OrdenesRecientesDashboard';

import useProductos
  from '../../hooks/useProductos';

import useOrdenes
  from '../../hooks/useOrdenes';

import {
  obtenerUsuarios
} from '../../services/authService';

import {
  obtenerProductosStockCritico
} from '../../services/productoService';

function AdminDashboard() {

  // ========================================
  // DATOS DEL SISTEMA
  // ========================================

  const productos =
    useProductos();

  const ordenes =
    useOrdenes();

  const usuarios =
    obtenerUsuarios();

  const stockCritico =
    obtenerProductosStockCritico();

  // ========================================
  // VISTA
  // ========================================

  return (

    <PlantillaPagina
      titulo="Panel administrador"
      descripcion="Resumen general de la actividad de AromaEsencial."
    >

      {/* =====================================
          ESTADÍSTICAS GENERALES
         ===================================== */}

      <GrillaEstadisticas
        productos={
          productos
        }
        ordenes={
          ordenes
        }
        usuarios={
          usuarios
        }
        stockCritico={
          stockCritico
        }
      />

      {/* =====================================
          GRÁFICOS
         ===================================== */}

      <GraficosDashboard
        ordenes={
          ordenes
        }
      />

      {/* =====================================
          ÓRDENES RECIENTES
         ===================================== */}

      <OrdenesRecientesDashboard
        ordenes={
          ordenes
        }
      />

    </PlantillaPagina>

  );
}

export default AdminDashboard;