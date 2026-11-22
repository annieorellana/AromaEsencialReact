
import { apiFetch } from './apiFetch';

// ==========================================
// CONFIGURACIÓN DE API
// ==========================================

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  'http://localhost:8080/api/v1'
).replace(/\/+$/, '');

const API_URL = `${API_BASE}/usuarios`;

// ==========================================
// FUNCIÓN GENERAL PARA PETICIONES HTTP
// ==========================================

async function solicitar(ruta = '', opciones = {}) {

  const headers = new Headers(
    opciones.headers || {}
  );

  headers.set(
    'Accept',
    'application/json'
  );

  // Spring Boot necesita este encabezado
  // para recibir correctamente los DTO JSON.
  if (
    opciones.body !== undefined &&
    opciones.body !== null &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  // apiFetch incorpora el JWT y puede
  // renovar la sesión cuando corresponda.
  const respuesta = await apiFetch(
    `${API_URL}${ruta}`,
    {
      ...opciones,
      headers
    }
  );

  // ========================================
  // MANEJO DE ERRORES
  // ========================================

  if (!respuesta.ok) {

    let mensaje =
      `Error HTTP ${respuesta.status}`;

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
          }

        } catch {
          mensaje = texto;
        }
      }

    } catch {
      // No fue posible leer la respuesta.
    }

    if (respuesta.status === 401) {
      mensaje =
        'Tu sesión ha vencido. Inicia sesión nuevamente.';
    }

    if (respuesta.status === 403) {
      mensaje =
        'No tienes permisos para administrar usuarios.';
    }

    const error = new Error(mensaje);

    error.status = respuesta.status;

    throw error;
  }

  // ========================================
  // RESPUESTA EXITOSA
  // ========================================

  if (respuesta.status === 204) {
    return null;
  }

  const texto = await respuesta.text();

  return texto
    ? JSON.parse(texto)
    : null;
}

// ==========================================
// GET - LISTAR USUARIOS
// ==========================================

export function listarUsuariosApi() {

  return solicitar('', {
    method: 'GET'
  });
}

// ==========================================
// GET - BUSCAR USUARIO POR ID
// ==========================================

export function buscarUsuarioApi(id) {

  return solicitar(
    `/${encodeURIComponent(id)}`,
    {
      method: 'GET'
    }
  );
}

// ==========================================
// POST - CREAR USUARIO
// ==========================================

export function crearUsuarioApi(usuario) {

  return solicitar('', {
    method: 'POST',

    body: JSON.stringify(usuario)
  });
}

// ==========================================
// PUT - ACTUALIZAR USUARIO
// ==========================================

export function actualizarUsuarioApi(
  id,
  usuario
) {

  return solicitar(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PUT',

      body: JSON.stringify(usuario)
    }
  );
}

// ==========================================
// DELETE - ELIMINAR USUARIO
// ==========================================

export function eliminarUsuarioApi(id) {

  return solicitar(
    `/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    }
  );
}
