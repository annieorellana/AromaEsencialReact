import { useEffect, useState } from 'react';

import {
  obtenerProductos,
  EVENTO_PRODUCTOS
} from '../services/productoService';

function useProductos() {
  const [productos, setProductos] = useState(obtenerProductos);

  useEffect(() => {
    const actualizarProductos = () => {
      setProductos(obtenerProductos());
    };

    window.addEventListener(
      EVENTO_PRODUCTOS,
      actualizarProductos
    );

    window.addEventListener(
      'storage',
      actualizarProductos
    );

    return () => {
      window.removeEventListener(
        EVENTO_PRODUCTOS,
        actualizarProductos
      );

      window.removeEventListener(
        'storage',
        actualizarProductos
      );
    };
  }, []);

  return productos;
}

export default useProductos;