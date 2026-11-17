
import { useEffect, useState } from 'react';

import { listarProductos } from '../services/CatalogoApi';

import { EVENTO_PRODUCTOS } from '../services/productoService';

function useProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    let activo = true;

    const cargarProductos = async () => {
      try {
        const datos = await listarProductos();

        if (activo) {
          setProductos(Array.isArray(datos) ? datos : []);
        }
      } catch (error) {
        console.error(
          'Error al cargar productos desde Spring Boot:',
          error
        );
      }
    };

    cargarProductos();

    window.addEventListener(
      EVENTO_PRODUCTOS,
      cargarProductos
    );

    return () => {
      activo = false;

      window.removeEventListener(
        EVENTO_PRODUCTOS,
        cargarProductos
      );
    };
  }, []);

  return productos;
}

export default useProductos;
