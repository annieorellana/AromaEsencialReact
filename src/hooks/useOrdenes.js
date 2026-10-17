import {
  useEffect,
  useState
} from 'react';

import {
  obtenerOrdenes,
  EVENTO_ORDENES
} from '../services/orderService';

function useOrdenes() {
  const [ordenes, setOrdenes] =
    useState(obtenerOrdenes);

  useEffect(() => {
    const actualizarOrdenes = () => {
      setOrdenes(
        obtenerOrdenes()
      );
    };

    window.addEventListener(
      EVENTO_ORDENES,
      actualizarOrdenes
    );

    window.addEventListener(
      'storage',
      actualizarOrdenes
    );

    return () => {
      window.removeEventListener(
        EVENTO_ORDENES,
        actualizarOrdenes
      );

      window.removeEventListener(
        'storage',
        actualizarOrdenes
      );
    };
  }, []);

  return ordenes;
}

export default useOrdenes;