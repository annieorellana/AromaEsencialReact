
const API_URL = 'http://localhost:8080/api/v1/usuarios';

// Obtiene el token cuando la autenticación JWT
// esté integrada en el frontend.
function obtenerToken() {
  const sesion = JSON.parse(
    localStorage.getItem('aromaesencial_sesion') || 'null'
  );

  return sesion?.token || sesion?.accessToken || null;
}

// Función general para realizar solicitudes
async function solicitar(ruta = '', opciones = {}) {
  const token = obtenerToken();

  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(
    `${API_URL}${ruta}`,
    {
      ...opciones,
      headers
    }
  );

  if (!respuesta.ok) {
    let mensaje = `Error HTTP ${respuesta.status}`;

    try {
      const datos = await respuesta.json();

      mensaje =
        datos.mensaje ||
        datos.message ||
        datos.detail ||
        mensaje;
    } catch (error) {
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

    throw new Error(mensaje);
  }

  if (respuesta.status === 204) {
    return null;
  }

  return respuesta.json();
}

// GET - Listar usuarios
export function listarUsuariosApi() {
  return solicitar();
}

// GET - Buscar usuario por ID
export function buscarUsuarioApi(id) {
  return solicitar(`/${id}`);
}

// POST - Crear usuario
export function crearUsuarioApi(usuario) {
  return solicitar('', {
    method: 'POST',
    body: JSON.stringify(usuario)
  });
}

// PUT - Actualizar usuario
export function actualizarUsuarioApi(id, usuario) {
  return solicitar(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(usuario)
  });
}

// DELETE - Eliminar usuario
export function eliminarUsuarioApi(id) {
  return solicitar(`/${id}`, {
    method: 'DELETE'
  });
}
