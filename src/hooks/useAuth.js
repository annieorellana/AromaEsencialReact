import { useEffect, useState } from 'react';

import {
  obtenerSesion,
  renovarSesion,
  cerrarSesionCompleta,
  EVENTO_SESION
} from '../services/authService';

function useAuth() {

  const [usuario, setUsuario] = useState(
    obtenerSesion
  );

  const [verificandoSesion, setVerificandoSesion] =
    useState(true);

  useEffect(() => {

    let activo = true;

    async function comprobarSesion() {

      const sesionActual = obtenerSesion();

      if (sesionActual) {
        if (activo) {
          setUsuario(sesionActual);
          setVerificandoSesion(false);
        }
        return;
      }

      // Si el JWT venció, intentar renovarlo
      // utilizando la cookie HttpOnly.
      const sesionRenovada = await renovarSesion();

      if (activo) {
        setUsuario(sesionRenovada);
        setVerificandoSesion(false);
      }
    }

    const actualizarSesion = () => {
      if (activo) {
        setUsuario(obtenerSesion());
      }
    };

    window.addEventListener(
      EVENTO_SESION,
      actualizarSesion
    );

    window.addEventListener(
      'storage',
      actualizarSesion
    );

    comprobarSesion();

    return () => {
      activo = false;

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

  const logout = async () => {
    await cerrarSesionCompleta();
    setUsuario(null);
};

  return {
    usuario,
    autenticado: usuario !== null,
    rol: usuario?.rol || null,
    verificandoSesion,
    logout
  };
}

export default useAuth;
