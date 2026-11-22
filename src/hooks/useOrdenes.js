
import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  obtenerOrdenes,
  EVENTO_ORDENES
} from '../services/orderService';

import {
  obtenerSesion,
  EVENTO_SESION
} from '../services/authService';

// ==========================================
// IDENTIFICAR USUARIO ACTUAL
// ==========================================

function identificarSesion() {
  const sesion = obtenerSesion();

  if (!sesion?.id) {
    return null;
  }

  return `${sesion.id}:${sesion.rol || ''}`;
}

// ==========================================
// HOOK CON CARGA, ERRORES Y REINTENTOS
// ==========================================

export function useOrdenesConEstado(usuarioId = null) {

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0);

  // ========================================
  // RECARGAR MANUALMENTE
  // ========================================

  const reintentar = useCallback(() => {
    setRecarga((anterior) => anterior + 1);
  }, []);

  // ========================================
  // CONSULTAR MYSQL
  // ========================================

  useEffect(() => {

    let activo = true;
    let numeroPeticion = 0;
    let identidadActual = identificarSesion();

    const cargar = async (limpiar = false) => {

      const peticionActual = ++numeroPeticion;

      if (!activo) {
        return;
      }

      setCargando(true);
      setError('');

      if (limpiar) {
        setOrdenes([]);
      }

      try {

        const respuesta = await obtenerOrdenes(
          usuarioId
        );

        if (
          !activo ||
          peticionActual !== numeroPeticion
        ) {
          return;
        }

        if (!Array.isArray(respuesta)) {
          throw new Error(
            'El servidor no devolvió una lista válida de órdenes.'
          );
        }

        setOrdenes(respuesta);

      } catch (err) {

        if (
          !activo ||
          peticionActual !== numeroPeticion
        ) {
          return;
        }

        console.error(
          'Error al consultar órdenes:',
          err
        );

        setOrdenes([]);

        setError(
          err.message ||
          'No fue posible consultar las órdenes.'
        );

      } finally {

        if (
          activo &&
          peticionActual === numeroPeticion
        ) {
          setCargando(false);
        }

      }
    };

    // ======================================
    // NUEVA COMPRA O CAMBIO DE ESTADO
    // ======================================

    const manejarCambioOrdenes = () => {
      cargar();
    };

    // ======================================
    // LOGIN O LOGOUT
    // ======================================

    const manejarCambioSesion = () => {

      const nuevaIdentidad = identificarSesion();

      if (nuevaIdentidad === identidadActual) {
        return;
      }

      identidadActual = nuevaIdentidad;

      // Invalidar respuestas anteriores.
      numeroPeticion += 1;

      setOrdenes([]);
      setError('');

      if (nuevaIdentidad) {
        cargar(true);
      } else {
        setCargando(false);
      }
    };

    window.addEventListener(
      EVENTO_ORDENES,
      manejarCambioOrdenes
    );

    window.addEventListener(
      EVENTO_SESION,
      manejarCambioSesion
    );

    // Primera carga.
    cargar();

    return () => {

      activo = false;
      numeroPeticion += 1;

      window.removeEventListener(
        EVENTO_ORDENES,
        manejarCambioOrdenes
      );

      window.removeEventListener(
        EVENTO_SESION,
        manejarCambioSesion
      );
    };

  }, [usuarioId, recarga]);

  return {
    ordenes,
    cargando,
    error,
    reintentar
  };
}


// Otros componentes pueden continuar usando:
// const ordenes = useOrdenes();

export default function useOrdenes(usuarioId = null) {
  const { ordenes } = useOrdenesConEstado(usuarioId);
  return ordenes;
}
