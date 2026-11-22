
import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  obtenerSesion,
  renovarSesion,
  cerrarSesionCompleta,
  normalizarRol,
  EVENTO_SESION
} from '../services/authService';

// ==========================================
// AROMAESENCIAL
// HOOK DE AUTENTICACIÓN
// ==========================================

function useAuth() {

  // ========================================
  // ESTADO INICIAL DEL USUARIO
  // ========================================

  const [usuario, setUsuario] = useState(
    () => obtenerSesion()
  );

  const [
    verificandoSesion,
    setVerificandoSesion
  ] = useState(true);

  // ========================================
  // SINCRONIZAR SESIÓN
  // ========================================

  const actualizarSesion = useCallback(() => {

    const sesionActual = obtenerSesion();

    setUsuario(
      sesionActual || null
    );

    return sesionActual;

  }, []);

  // ========================================
  // COMPROBAR Y RECUPERAR SESIÓN
  // ========================================

  useEffect(() => {

    let componenteActivo = true;

    // ======================================
    // VERIFICACIÓN INICIAL
    // ======================================

    const comprobarSesion = async () => {

      try {

        // Primero revisar si existe
        // una sesión con JWT vigente.
        let sesion = obtenerSesion();

        if (!sesion) {

          // Si no existe un JWT vigente,
          // intentar recuperar la sesión
          // mediante la cookie HttpOnly.
          sesion = await renovarSesion();

        }

        if (!componenteActivo) {
          return;
        }

        // Volver a consultar el estado actual.
        // Evita restaurar datos antiguos si
        // el usuario inició o cerró sesión
        // mientras se renovaba el JWT.
        const sesionActual =
          obtenerSesion();

        setUsuario(
          sesionActual || sesion || null
        );

      } catch (error) {

        console.warn(
          'No fue posible verificar la sesión:',
          error
        );

        if (componenteActivo) {

          setUsuario(
            obtenerSesion() || null
          );

        }

      } finally {

        if (componenteActivo) {
          setVerificandoSesion(false);
        }

      }
    };

    // ======================================
    // EVENTOS DE AUTENTICACIÓN
    // ======================================

    const manejarCambioSesion = () => {

      if (!componenteActivo) {
        return;
      }

      actualizarSesion();

      setVerificandoSesion(false);
    };

    // Login, renovación o logout.
    window.addEventListener(
      EVENTO_SESION,
      manejarCambioSesion
    );

    // Detectar cambios de almacenamiento
    // originados por otra pestaña.
    window.addEventListener(
      'storage',
      manejarCambioSesion
    );

    // Ejecutar verificación al montar.
    comprobarSesion();

    // ======================================
    // LIMPIAR EVENTOS
    // ======================================

    return () => {

      componenteActivo = false;

      window.removeEventListener(
        EVENTO_SESION,
        manejarCambioSesion
      );

      window.removeEventListener(
        'storage',
        manejarCambioSesion
      );
    };

  }, [actualizarSesion]);

  // ========================================
  // CERRAR SESIÓN
  // ========================================

  const logout = useCallback(async () => {

    try {

      // Revocar el refresh token en
      // Spring Boot y limpiar la sesión.
      await cerrarSesionCompleta();

    } catch (error) {

      console.error(
        'Error al cerrar sesión:',
        error
      );

    } finally {

      // Asegurar que React actualice
      // los componentes que utilizan
      // este hook.
      setUsuario(null);

      setVerificandoSesion(false);
    }

  }, []);

  // ========================================
  // DATOS DE AUTENTICACIÓN
  // ========================================

  const autenticado =
    usuario !== null &&
    Boolean(usuario?.id);

  const rol =
    autenticado
      ? normalizarRol(usuario.rol)
      : null;

  // ========================================
  // RESULTADO DEL HOOK
  // ========================================

  return {
    usuario,
    autenticado,
    rol,
    verificandoSesion,
    logout,
    actualizarSesion
  };
}

export default useAuth;
