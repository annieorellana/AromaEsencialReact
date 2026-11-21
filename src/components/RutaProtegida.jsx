
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function RutaProtegida({
  children,
  rolesPermitidos = []
}) {

  const {
    autenticado,
    rol,
    verificandoSesion
  } = useAuth();

  // Esperar mientras se comprueba o renueva
  // la sesión del usuario
  if (verificandoSesion) {
    return <p>Verificando sesión...</p>;
  }

  // Usuario sin sesión válida
  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Usuario sin el rol necesario
  if (
    rolesPermitidos.length > 0 &&
    !rolesPermitidos.includes(rol)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default RutaProtegida;
