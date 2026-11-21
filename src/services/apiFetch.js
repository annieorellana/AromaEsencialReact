import {
  obtenerToken,
  renovarSesion
} from './authService';

export async function apiFetch(url, opciones = {}) {

  const realizarPeticion = (token) => {
    const headers = new Headers(opciones.headers || {});

    headers.set('Authorization', `Bearer ${token}`);

    return fetch(url, {
      ...opciones,
      headers
    });
  };

  let token = obtenerToken();

  if (!token) {
    console.log('Intentando renovar JWT desde React')
    const sesion = await renovarSesion();
    token = sesion?.token || null;
  }

  if (!token) {
    throw new Error(
      'No hay una sesión válida. Debes iniciar sesión.'
    );
  }

  let respuesta = await realizarPeticion(token);

  if (respuesta.status === 401) {
    const sesionRenovada = await renovarSesion();

    if (sesionRenovada?.token) {
      respuesta = await realizarPeticion(
        sesionRenovada.token
      );
    }
  }

  return respuesta;
}
