import { useEffect, useState } from 'react';

import {
  obtenerSesion,
  cerrarSesion,
  EVENTO_SESION
} from '../services/authService';

function useAuth() {
  const [usuario, setUsuario] = useState(
    obtenerSesion
  );

  useEffect(() => {
    const actualizarSesion = () => {
      setUsuario(
        obtenerSesion()
      );
    };

    window.addEventListener(
      EVENTO_SESION,
      actualizarSesion
    );

    window.addEventListener(
      'storage',
      actualizarSesion
    );

    return () => {
      window.removeEventListener(
        EVENTO_SESION,
        actualizarSesion
      );

      window.removeEventListener(
        'storage',
        actualizarSesion
      );
    };
  }, []);

  const logout = () => {
    cerrarSesion();
    setUsuario(null);
  };

  return {
    usuario,
    autenticado: usuario !== null,
    rol: usuario?.rol || null,
    logout
  };
}

export default useAuth;