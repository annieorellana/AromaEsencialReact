import React from 'react';
import { Route } from 'react-router-dom';
import RutaProtegida from '../components/RutaProtegida';
import PlantillaAdmin from '../components/templates/admin/PlantillaAdmin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProductos from '../pages/admin/AdminProductos';
import AdminProductoNuevo from '../pages/admin/AdminProductoNuevo';
import AdminProductoEditar from '../pages/admin/AdminProductoEditar';
import AdminStockCritico from '../pages/admin/AdminStockCritico';
import AdminOrdenes from '../pages/admin/AdminOrdenes';
import AdminOrdenDetalle from '../pages/admin/AdminOrdenDetalle';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminReportes from '../pages/admin/AdminReportes';
import AdminPerfil from '../pages/admin/AdminPerfil';
import { sembrarAdminDemo } from '../utils/sembrarAdmin';

// Garantiza que exista un administrador para poder entrar (admin@duoc.cl / admin123). Quitar al entregar si no se desea.
sembrarAdminDemo();

// Todas las rutas /admin exigen sesión con rol "admin" (RutaProtegida existente).
export const adminRoutes = (
  <Route path="/admin" element={<RutaProtegida rolesPermitidos={['admin']}><PlantillaAdmin /></RutaProtegida>}>
    <Route index element={<AdminDashboard />} />
    <Route path="productos" element={<AdminProductos />} />
    <Route path="productos/nuevo" element={<AdminProductoNuevo />} />
    <Route path="productos/:id/editar" element={<AdminProductoEditar />} />
    <Route path="stock-critico" element={<AdminStockCritico />} />
    <Route path="ordenes" element={<AdminOrdenes />} />
    <Route path="ordenes/:id" element={<AdminOrdenDetalle />} />
    <Route path="usuarios" element={<AdminUsuarios />} />
    <Route path="reportes" element={<AdminReportes />} />
    <Route path="perfil" element={<AdminPerfil />} />
  </Route>
);
