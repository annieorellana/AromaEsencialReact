import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function RutaProtegida({
  children,
  rolesPermitidos = []
}) {
  const {
    autenticado,
    rol
  } = useAuth();

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

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