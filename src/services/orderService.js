const CLAVE_ORDENES = 'aromaesencial_ordenes';

export const EVENTO_ORDENES =
  'aromaesencial-ordenes-actualizadas';

// OBTENER TODAS LAS ÓRDENES
export function obtenerOrdenes() {
  try {
    const guardadas = JSON.parse(
      localStorage.getItem(CLAVE_ORDENES) || '[]'
    );

    return Array.isArray(guardadas)
      ? guardadas
      : [];

  } catch (error) {
    console.error(
      'Error al leer las órdenes:',
      error
    );

    return [];
  }
}

// GUARDAR TODAS LAS ÓRDENES
function guardarOrdenes(ordenes) {
  try {
    localStorage.setItem(
      CLAVE_ORDENES,
      JSON.stringify(ordenes)
    );

    window.dispatchEvent(
      new Event(EVENTO_ORDENES)
    );

    return true;

  } catch (error) {
    console.error(
      'Error al guardar las órdenes:',
      error
    );

    return false;
  }
}

// CREAR UNA NUEVA ORDEN
export function crearOrden(orden) {
  try {
    const ordenes = obtenerOrdenes();

    const nuevaOrden = {
      ...orden,

      id:
        orden.id ||
        `AE-${Date.now()}`
    };

    const guardado = guardarOrdenes([
      ...ordenes,
      nuevaOrden
    ]);

    if (!guardado) {
      return null;
    }

    return nuevaOrden;

  } catch (error) {
    console.error(
      'Error al crear la orden:',
      error
    );

    return null;
  }
}

// BUSCAR UNA ORDEN POR ID
export function obtenerOrdenPorId(id) {
  const ordenes = obtenerOrdenes();

  return ordenes.find(
    (orden) =>
      orden.id === id
  );
}

// ACTUALIZAR ESTADO
export function actualizarEstadoOrden(
  id,
  nuevoEstado
) {
  try {
    const ordenes = obtenerOrdenes();

    const existe = ordenes.some(
      (orden) =>
        orden.id === id
    );

    if (!existe) {
      return false;
    }

    const actualizadas = ordenes.map(
      (orden) =>
        orden.id === id
          ? {
              ...orden,
              estado: nuevoEstado
            }
          : orden
    );

    return guardarOrdenes(
      actualizadas
    );

  } catch (error) {
    console.error(
      'Error al actualizar la orden:',
      error
    );

    return false;
  }
}