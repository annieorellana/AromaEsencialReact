
import { apiFetch } from './apiFetch';

// ==========================================
// AROMAESENCIAL
// SERVICIO API DE PRODUCTOS Y CATEGORÍAS
// ==========================================

const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  'http://localhost:8080/api/v1'
).replace(/\/+$/, '');

// ==========================================
// MANEJO DE ERRORES
// ==========================================

async function obtenerMensajeError(respuesta) {

  let mensaje = `Error HTTP ${respuesta.status}`;

  try {

    const texto = await respuesta.text();

    if (texto) {

      try {

        const datos = JSON.parse(texto);

        if (typeof datos === 'string') {
          mensaje = datos;
        } else {

          mensaje =
            datos?.mensaje ||
            datos?.message ||
            datos?.detail ||
            datos?.error ||
            mensaje;

          // Incluir errores de validación
          // si el backend los proporciona.
          if (
            Array.isArray(datos?.detalles) &&
            datos.detalles.length > 0
          ) {
            mensaje +=
              ': ' + datos.detalles.join('; ');
          }
        }

      } catch {
        // Respuesta de texto no JSON.
        mensaje = texto;
      }
    }

  } catch {
    // Conservar el mensaje HTTP original.
  }

  if (respuesta.status === 401) {
    return 'Tu sesión ha vencido. Inicia sesión nuevamente.';
  }

  if (respuesta.status === 403) {
    return 'No tienes permisos para realizar esta operación.';
  }

  return mensaje;
}

// ==========================================
// FUNCIÓN GENERAL DE PETICIONES HTTP
// ==========================================

async function solicitar(
  ruta,
  opciones = {},
  requiereAutenticacion = false
) {

  const url = `${API_BASE_URL}${ruta}`;

  const headers = new Headers(
    opciones.headers || {}
  );

  headers.set(
    'Accept',
    'application/json'
  );

  // Agregar Content-Type solo cuando
  // se envía un cuerpo JSON.
  if (
    opciones.body !== undefined &&
    opciones.body !== null &&
    !(opciones.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  const configuracion = {
    ...opciones,
    headers
  };

  let respuesta;

  try {

    if (requiereAutenticacion) {

      // apiFetch agrega el JWT.
      // También permite renovar la sesión
      // si el token de acceso ha vencido.
      respuesta = await apiFetch(
        url,
        configuracion
      );

    } else {

      // Productos y categorías públicos:
      // no necesitan iniciar sesión.
      respuesta = await fetch(
        url,
        configuracion
      );
    }

  } catch (error) {

    console.error(
      'Error de conexión con la API:',
      error
    );

    throw error;
  }

  // ========================================
  // VALIDAR RESPUESTA
  // ========================================

  if (!respuesta.ok) {

    const mensaje =
      await obtenerMensajeError(respuesta);

    const error = new Error(mensaje);

    error.status = respuesta.status;

    throw error;
  }

  // ========================================
  // RESPUESTAS SIN CONTENIDO
  // ========================================

  if (respuesta.status === 204) {
    return null;
  }

  // ========================================
  // CONVERTIR RESPUESTA A JSON
  // ========================================

  const texto = await respuesta.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);

  } catch {
    throw new Error(
      'El servidor devolvió una respuesta JSON inválida.'
    );
  }
}

// ==========================================
// PRODUCTOS
// ==========================================

// ==========================================
// GET - LISTAR PRODUCTOS
// Endpoint público
// ==========================================

export function listarProductos() {

  return solicitar(
    '/productos',
    {
      method: 'GET'
    }
  );
}

// ==========================================
// GET - BUSCAR PRODUCTO POR ID
// Endpoint público
// ==========================================

export function buscarProducto(id) {

  return solicitar(
    `/productos/${encodeURIComponent(id)}`,
    {
      method: 'GET'
    }
  );
}

// ==========================================
// POST - CREAR PRODUCTO
// Solo ADMINISTRADOR
// ==========================================

export function crearProductoApi(producto) {

  return solicitar(
    '/productos',
    {
      method: 'POST',
      body: JSON.stringify(producto)
    },
    true
  );
}

// ==========================================
// PUT - ACTUALIZAR PRODUCTO
// Solo ADMINISTRADOR
// ==========================================

export function actualizarProductoApi(
  id,
  producto
) {

  return solicitar(
    `/productos/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(producto)
    },
    true
  );
}

// ==========================================
// DELETE - ELIMINAR PRODUCTO
// Solo ADMINISTRADOR
// ==========================================

export function eliminarProductoApi(id) {

  return solicitar(
    `/productos/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    },
    true
  );
}

// ==========================================
// GET - PRODUCTOS CON STOCK CRÍTICO
// Solo ADMINISTRADOR
// ==========================================

export function listarStockCritico() {

  return solicitar(
    '/productos/stock-critico',
    {
      method: 'GET'
    },
    true
  );
}

// ==========================================
// GET - PRODUCTOS EN OFERTA
// Endpoint público
// ==========================================

export function listarOfertas() {

  return solicitar(
    '/productos/ofertas',
    {
      method: 'GET'
    }
  );
}

// ==========================================
// CATEGORÍAS
// ==========================================

// ==========================================
// GET - LISTAR CATEGORÍAS
// Endpoint público
// ==========================================

export function listarCategorias() {

  return solicitar(
    '/categorias',
    {
      method: 'GET'
    }
  );
}

// ==========================================
// GET - BUSCAR CATEGORÍA POR ID
// Endpoint público
// ==========================================

export function buscarCategoria(id) {

  return solicitar(
    `/categorias/${encodeURIComponent(id)}`,
    {
      method: 'GET'
    }
  );
}

// ==========================================
// POST - CREAR CATEGORÍA
// Solo ADMINISTRADOR
// ==========================================

export function crearCategoriaApi(categoria) {

  return solicitar(
    '/categorias',
    {
      method: 'POST',
      body: JSON.stringify(categoria)
    },
    true
  );
}

// ==========================================
// PUT - ACTUALIZAR CATEGORÍA
// Solo ADMINISTRADOR
// ==========================================

export function actualizarCategoriaApi(
  id,
  categoria
) {

  return solicitar(
    `/categorias/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(categoria)
    },
    true
  );
}

// ==========================================
// DELETE - ELIMINAR CATEGORÍA
// Solo ADMINISTRADOR
// ==========================================

export function eliminarCategoriaApi(id) {

  return solicitar(
    `/categorias/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    },
    true
  );
}
