
import { obtenerToken } from './authService';

const API_URL = 'http://localhost:8080/api/v1/usuarios';

// ==========================================
// FUNCIÓN GENERAL PARA SOLICITUDES HTTP
// ==========================================

async function solicitar(ruta = '', opciones = {}) {

  // Obtener token JWT de Spring Boot
  const token = obtenerToken();

  // Preparar encabezados
  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers
  };

  // Agregar autorización si existe token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Realizar petición al backend
  const respuesta = await fetch(
    `${API_URL}${ruta}`,
    {
      ...opciones,
      headers
    }
  );

  // ==========================================
  // MANEJO DE ERRORES
  // ==========================================

  if (!respuesta.ok) {

    let mensaje = `Error HTTP ${respuesta.status}`;

    try {

      const datos = await respuesta.json();

      mensaje =
        datos.mensaje ||
        datos.message ||
        datos.detail ||
        mensaje;

    } catch {
      // La respuesta puede no contener JSON.
    }

    if (respuesta.status === 401) {
      mensaje = 'Debes iniciar sesión nuevamente.';
    }

    if (respuesta.status === 403) {
      mensaje =
        'No tienes permisos para administrar usuarios. ' +
        'Se requiere una sesión de administrador válida en Spring Boot.';
    }

    const error = new Error(mensaje);
    error.status = respuesta.status;

    throw error;
  }

  // Respuesta sin contenido
  if (respuesta.status === 204) {
    return null;
  }

  // Convertir respuesta a JSON
  const texto = await respuesta.text();

  return texto ? JSON.parse(texto) : null;
}

// ==========================================
// GET - LISTAR USUARIOS
// ==========================================

export function listarUsuariosApi() {
  return solicitar();
}

// ==========================================
// GET - BUSCAR USUARIO POR ID
// ==========================================

export function buscarUsuarioApi(id) {
  return solicitar(
    `/${encodeURIComponent(id)}`
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

export function actualizarUsuarioApi(id, usuario) {
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
