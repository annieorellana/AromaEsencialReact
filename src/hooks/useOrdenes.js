import {
  useEffect,
  useState
} from 'react';

import {
  obtenerOrdenes,
  EVENTO_ORDENES
} from '../services/orderService';

function useOrdenes(usuarioId = null) {
  const [ordenes, setOrdenes] =
    useState([]);

  useEffect(() => {
    let activo = true;

    const cargarOrdenes = async () => {
      const datos = await obtenerOrdenes(
        usuarioId
      );

      if (activo) {
        setOrdenes(
          Array.isArray(datos)
            ? datos
            : []
        );
      }
    };

    cargarOrdenes();

    const actualizarOrdenes = () => {
      cargarOrdenes();
    };

    window.addEventListener(
      EVENTO_ORDENES,
      actualizarOrdenes
    );

    return () => {
      activo = false;

      window.removeEventListener(
        EVENTO_ORDENES,
        actualizarOrdenes
      );
    };
  }, [usuarioId]);

  return ordenes;
}

export default useOrdenes;