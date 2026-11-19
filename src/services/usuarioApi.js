import { apiFetch } from './apiFetch';

const API_URL = 'http://localhost:8080/api/v1/usuarios';

export async function obtenerUsuariosAPI() {

  const respuesta = await apiFetch(API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (respuesta.status === 401) {
    throw new Error(
      'Tu sesión no es válida o ha expirado.'
    );
  }

  if (respuesta.status === 403) {
    throw new Error(
      'No tienes permisos para consultar los usuarios.'
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar usuarios: ${respuesta.status}`
    );
  }

  return await respuesta.json();
}
