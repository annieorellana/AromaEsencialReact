import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarPrincipal from '../organisms/NavbarPrincipal';
import useAuth from '../../hooks/useAuth';

function MainLayout({
  children,
  cantidadCarrito = 0
}) {
  const { pathname } = useLocation();

  const {
    usuario,
    autenticado,
    rol,
    logout
  } = useAuth();

  const esRutaAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!esRutaAdmin && (
        <NavbarPrincipal
          usuario={usuario}
          autenticado={autenticado}
          rol={rol}
          logout={logout}
          cantidadCarrito={cantidadCarrito}
        />
      )}

      <main>
        {children}
      </main>
    </>
  );
}

export default MainLayout;