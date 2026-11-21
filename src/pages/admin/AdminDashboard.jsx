import React, { useEffect, useState } from 'react';

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
  obtenerUsuariosAPI
} from '../../services/usuarioApi';

import {
  obtenerProductosStockCritico
} from '../../services/productoService';

function AdminDashboard() {

  // ========================================
  // DATOS DEL SISTEMA
  // ========================================

  const productos = useProductos();
  const ordenes = useOrdenes();

  const [usuarios, setUsuarios] = useState([]);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  const stockCritico = obtenerProductosStockCritico();

  // ========================================
  // CONSULTAR USUARIOS DESDE MYSQL
  // ========================================

  useEffect(() => {
    let activo = true;

    async function cargarUsuarios() {
      try {
        const resultado = await obtenerUsuariosAPI();

        if (activo) {
          setUsuarios(resultado);
          setErrorUsuarios('');
        }

      } catch (error) {
        if (activo) {
          setUsuarios([]);
          setErrorUsuarios(
            error.message || 'No se pudieron cargar los usuarios.'
          );
        }

      } finally {
        if (activo) {
          setCargandoUsuarios(false);
        }
      }
    }

    cargarUsuarios();

    return () => {
      activo = false;
    };
  }, []);

  // ========================================
  // VISTA
  // ========================================

  return (
    <PlantillaPagina
      titulo="Panel administrador"
      descripcion="Resumen general de la actividad de AromaEsencial."
    >

      {cargandoUsuarios && (
        <p>Cargando usuarios...</p>
      )}

      {errorUsuarios && (
        <p className="text-danger" role="alert">
          {errorUsuarios}
        </p>
      )}

      {/* ESTADÍSTICAS GENERALES */}
      <GrillaEstadisticas
        productos={productos}
        ordenes={ordenes}
        usuarios={usuarios}
        stockCritico={stockCritico}
      />

      {/* GRÁFICOS */}
      <GraficosDashboard
        ordenes={ordenes}
      />

      {/* ÓRDENES RECIENTES */}
      <OrdenesRecientesDashboard
        ordenes={ordenes}
      />

    </PlantillaPagina>
  );
}

export default AdminDashboard;
