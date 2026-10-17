const CLAVE_CARRITO = 'aromaesencial_carrito';

export function obtenerCarrito() {
  try {
    const guardado = JSON.parse(
      localStorage.getItem(CLAVE_CARRITO) || '[]'
    );

    return Array.isArray(guardado)
      ? guardado
      : [];

  } catch (error) {
    console.error(
      'Error al leer el carrito:',
      error
    );

    return [];
  }
}

export function guardarCarrito(carrito) {
  try {
    localStorage.setItem(
      CLAVE_CARRITO,
      JSON.stringify(carrito)
    );

    return true;

  } catch (error) {
    console.error(
      'Error al guardar el carrito:',
      error
    );

    return false;
  }
}

export function agregarProductoAlCarrito(
  carrito,
  producto
) {
  if (!producto || producto.stock <= 0) {
    return carrito;
  }

  const existente = carrito.find(
    (item) => item.id === producto.id
  );

  if (existente) {
    return carrito.map((item) =>
      item.id === producto.id
        ? {
            ...item,
            cantidad: Math.min(
              item.cantidad + 1,
              producto.stock
            )
          }
        : item
    );
  }

  return [
    ...carrito,
    {
      ...producto,
      cantidad: 1
    }
  ];
}

export function cambiarCantidadProducto(
  carrito,
  id,
  cambio
) {
  return carrito.map((item) =>
    item.id === id
      ? {
          ...item,
          cantidad: Math.min(
            item.stock,
            Math.max(
              1,
              item.cantidad + cambio
            )
          )
        }
      : item
  );
}

export function eliminarProductoDelCarrito(
  carrito,
  id
) {
  return carrito.filter(
    (item) => item.id !== id
  );
}

export function vaciarCarrito() {
  localStorage.setItem(
    CLAVE_CARRITO,
    JSON.stringify([])
  );

  return [];
}

export function obtenerCantidadTotal(carrito) {
  return carrito.reduce(
    (total, item) =>
      total + item.cantidad,
    0
  );
}