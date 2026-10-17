import {
  useEffect,
  useState
} from 'react';

import {
  obtenerCarrito,
  guardarCarrito,
  agregarProductoAlCarrito,
  cambiarCantidadProducto,
  eliminarProductoDelCarrito,
  obtenerCantidadTotal
} from '../services/cartService';

function useCart() {

  const [carrito, setCarrito] =
    useState(obtenerCarrito);

  // GUARDAR EL CARRITO
  // CADA VEZ QUE CAMBIA
  useEffect(() => {

    guardarCarrito(carrito);

  }, [carrito]);

  // AGREGAR PRODUCTO
  const agregarAlCarrito = (
    producto
  ) => {

    setCarrito(
      (anterior) =>
        agregarProductoAlCarrito(
          anterior,
          producto
        )
    );

  };

  // CAMBIAR CANTIDAD
  const cambiarCantidad = (
    id,
    cambio
  ) => {

    setCarrito(
      (anterior) =>
        cambiarCantidadProducto(
          anterior,
          id,
          cambio
        )
    );

  };

  // ELIMINAR PRODUCTO
  const eliminarProducto = (
    id
  ) => {

    setCarrito(
      (anterior) =>
        eliminarProductoDelCarrito(
          anterior,
          id
        )
    );

  };

  // VACIAR CARRITO
  const limpiarCarrito = () => {

    setCarrito([]);

  };

  // CANTIDAD TOTAL
  const cantidadCarrito =
    obtenerCantidadTotal(
      carrito
    );

  return {

    carrito,

    agregarAlCarrito,

    cambiarCantidad,

    eliminarProducto,

    limpiarCarrito,

    cantidadCarrito

  };
}

export default useCart;