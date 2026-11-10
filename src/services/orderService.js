// ==========================================
// AROMAESENCIAL
// SERVICIO DE BOLETAS / ÓRDENES
// CONECTADO AL BACKEND SPRING BOOT
// ==========================================

const API_BASE =
  'http://localhost:8080/api/v1';

const API_BOLETAS =
  `${API_BASE}/boletas`;

const API_PRODUCTOS =
  `${API_BASE}/productos`;

// ==========================================
// USUARIO TEMPORAL DE INTEGRACIÓN
// ==========================================
//
// El módulo de autenticación corresponde
// al Integrante B y UsuarioController al C.
//
// Mientras esas ramas no estén integradas,
// las boletas se crean usando el cliente
// demo existente en el backend.
//
// Cliente Demo = ID 3
//
// ==========================================

const USUARIO_CLIENTE_DEMO_ID = 3;

// EVENTO PARA ACTUALIZAR LAS VISTAS
export const EVENTO_ORDENES =
  'aromaesencial-ordenes-actualizadas';

// ==========================================
// OBTENER MENSAJE DE ERROR DEL BACKEND
// ==========================================

async function obtenerMensajeError(
  response
) {
  try {
    const data =
      await response.json();

    return (
      data?.mensaje ||
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`
    );

  } catch (error) {
    return `Error HTTP ${response.status}`;
  }
}

// ==========================================
// NOTIFICAR CAMBIO DE ÓRDENES
// ==========================================

function notificarCambioOrdenes() {
  window.dispatchEvent(
    new Event(EVENTO_ORDENES)
  );
}

// ==========================================
// OBTENER PRODUCTOS DEL BACKEND
// ==========================================

async function obtenerProductosBackend() {
  const response = await fetch(
    API_PRODUCTOS,
    {
      method: 'GET',

      headers: {
        Accept: 'application/json'
      }
    }
  );

  if (!response.ok) {
    const mensaje =
      await obtenerMensajeError(
        response
      );

    throw new Error(mensaje);
  }

  const productos =
    await response.json();

  return Array.isArray(productos)
    ? productos
    : [];
}

// ==========================================
// CONVERTIR PRODUCTOS DEL FRONTEND
// A IDS DEL BACKEND
// ==========================================
//
// FRONTEND:
//
// {
//   id: "classic-wood",
//   codigo: "PF-001",
//   cantidad: 1
// }
//
// BACKEND:
//
// {
//   productoId: 2,
//   cantidad: 1
// }
//
// El código PF-001 se usa como puente.
// ==========================================

async function convertirProductos(
  productosFrontend = []
) {
  const productosBackend =
    await obtenerProductosBackend();

  return productosFrontend.map(
    (productoFrontend) => {

      const productoBackend =
        productosBackend.find(
          (producto) =>
            String(
              producto.codigo || ''
            ).toUpperCase() ===
            String(
              productoFrontend.codigo || ''
            ).toUpperCase()
        );

      if (!productoBackend) {
        throw new Error(
          `No se encontró en el backend el producto "${productoFrontend.nombre}".`
        );
      }

      return {
        productoId:
          productoBackend.id,

        cantidad:
          Number(
            productoFrontend.cantidad
          )
      };
    }
  );
}

// ==========================================
// CREAR NUEVA BOLETA
// POST /api/v1/boletas
// ==========================================

export async function crearOrden(
  orden
) {
  try {
    const items =
      await convertirProductos(
        orden.productos || []
      );

    if (items.length === 0) {
      throw new Error(
        'La orden no contiene productos.'
      );
    }

    const metodoEnvio =
      orden.cliente?.envio ||
      'retiro';

    // ======================================
    // DIRECCIÓN
    // ======================================

    let direccionEnvio = null;

    if (
      metodoEnvio === 'domicilio'
    ) {
      const partesDireccion = [
        orden.cliente?.direccion,
        orden.cliente?.departamento
      ].filter(Boolean);

      direccionEnvio =
        partesDireccion.join(', ');

      if (
        orden.cliente?.indicaciones
      ) {
        direccionEnvio +=
          ` - ${orden.cliente.indicaciones}`;
      }
    }

    // ======================================
    // REQUEST QUE ESPERA SPRING BOOT
    // ======================================

    const request = {
      usuarioId:
        USUARIO_CLIENTE_DEMO_ID,

      items,

      cupon:
        orden.cupon
          ? String(
              orden.cupon
            ).trim().toUpperCase()
          : null,

      metodoPago:
        orden.metodoPago ||
        null,

      metodoEnvio,

      direccionEnvio:
        metodoEnvio === 'domicilio'
          ? direccionEnvio
          : null,

      region:
        metodoEnvio === 'domicilio'
          ? orden.cliente?.region ||
            null
          : null,

      comuna:
        metodoEnvio === 'domicilio'
          ? orden.cliente?.comuna ||
            null
          : null,

      telefono:
        orden.cliente?.telefono ||
        null
    };

    console.log(
      'Enviando boleta al backend:',
      request
    );

    // ======================================
    // LLAMADA AL BACKEND
    // ======================================

    const response = await fetch(
      API_BOLETAS,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Accept:
            'application/json'
        },

        body:
          JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const mensaje =
        await obtenerMensajeError(
          response
        );

      throw new Error(mensaje);
    }

    // ESTA ES LA BOLETA REAL DE MYSQL
    const nuevaOrden =
      await response.json();

    console.log(
      'Boleta creada:',
      nuevaOrden
    );

    notificarCambioOrdenes();

    return nuevaOrden;

  } catch (error) {
    console.error(
      'Error al crear la orden:',
      error
    );

    return null;
  }
}

// ==========================================
// LISTAR TODAS LAS BOLETAS
// GET /api/v1/boletas
// ==========================================

export async function obtenerOrdenes() {
  try {
    const response = await fetch(
      API_BOLETAS,
      {
        method: 'GET',

        headers: {
          Accept:
            'application/json'
        }
      }
    );

    if (!response.ok) {
      const mensaje =
        await obtenerMensajeError(
          response
        );

      throw new Error(mensaje);
    }

    const ordenes =
      await response.json();

    return Array.isArray(ordenes)
      ? ordenes
      : [];

  } catch (error) {
    console.error(
      'Error al obtener las órdenes:',
      error
    );

    return [];
  }
}

// ==========================================
// OBTENER DETALLE DE UNA BOLETA
// GET /api/v1/boletas/{id}
// ==========================================

export async function obtenerOrdenPorId(
  id
) {
  try {
    const response = await fetch(
      `${API_BOLETAS}/${encodeURIComponent(
        id
      )}`,
      {
        method: 'GET',

        headers: {
          Accept:
            'application/json'
        }
      }
    );

    if (!response.ok) {
      const mensaje =
        await obtenerMensajeError(
          response
        );

      throw new Error(mensaje);
    }

    return await response.json();

  } catch (error) {
    console.error(
      `Error al obtener la orden ${id}:`,
      error
    );

    return null;
  }
}

// ==========================================
// ACTUALIZAR ESTADO DE BOLETA
// PATCH /api/v1/boletas/{id}/estado
// ==========================================

export async function actualizarEstadoOrden(
  id,
  nuevoEstado
) {
  try {
    const estado =
      String(
        nuevoEstado || ''
      )
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_');

    const response = await fetch(
      `${API_BOLETAS}/${encodeURIComponent(
        id
      )}/estado`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',

          Accept:
            'application/json'
        },

        body:
          JSON.stringify({
            estado
          })
      }
    );

    if (!response.ok) {
      const mensaje =
        await obtenerMensajeError(
          response
        );

      throw new Error(mensaje);
    }

    const ordenActualizada =
      await response.json();

    notificarCambioOrdenes();

    return ordenActualizada;

  } catch (error) {
    console.error(
      `Error al actualizar la orden ${id}:`,
      error
    );

    return null;
  }
}