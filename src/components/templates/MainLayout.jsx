import React from 'react';

import {
  useLocation
} from 'react-router-dom';

import NavbarPrincipal
  from '../organisms/NavbarPrincipal';

import useAuth
  from '../../hooks/useAuth';

function MainLayout({
  children,
  cantidadCarrito = 0
}) {

  const {
    pathname
  } = useLocation();

  const {
    usuario,
    autenticado,
    rol,
    logout
  } = useAuth();

  // ========================================
  // RUTAS CON NAVEGACIÓN PROPIA
  // ========================================

  const esRutaAdmin =
    pathname.startsWith(
      '/admin'
    );

  const esRutaVendedor =
    pathname.startsWith(
      '/vendedor'
    );

  const ocultarNavbarPublico =
    esRutaAdmin ||
    esRutaVendedor;

  return (
    <>

      {!ocultarNavbarPublico && (

        <NavbarPrincipal
          usuario={
            usuario
          }
          autenticado={
            autenticado
          }
          rol={
            rol
          }
          logout={
            logout
          }
          cantidadCarrito={
            cantidadCarrito
          }
        />

      )}

      <main>
        {children}
      </main>

    </>
  );
}

export default MainLayout;