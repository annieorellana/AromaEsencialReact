
import {
  obtenerToken,
  renovarSesion
} from './authService';

// ==========================================
// RENOVACIÓN COORDINADA DE JWT
// ==========================================

// Evita que varias peticiones simultáneas
// intenten renovar el refresh token a la vez.
let renovacionEnCurso = null;

async function obtenerTokenRenovado() {

  if (!renovacionEnCurso) {

    renovacionEnCurso = (async () => {

      const tokenAnterior = obtenerToken();

      // authService gestiona la renovación
      // y el almacenamiento de la sesión.
      const sesionRenovada =
        await renovarSesion();

      // Leer el token actualizado desde
      // el servicio de autenticación.
      const tokenActual = obtenerToken();

      if (
        tokenActual &&
        tokenActual !== tokenAnterior
      ) {
        return tokenActual;
      }

      // Compatibilidad si renovarSesion
      // devuelve directamente el token.
      const tokenDevuelto =
        sesionRenovada?.token;

      return (
        tokenDevuelto &&
        tokenDevuelto !== tokenAnterior
      )
        ? tokenDevuelto
        : null;

    })().finally(() => {
      renovacionEnCurso = null;
    });
  }

  return renovacionEnCurso;
}

// ==========================================
// PETICIONES PROTEGIDAS CON JWT
// ==========================================

export async function apiFetch(
  url,
  opciones = {}
) {

  // ========================================
  // REALIZAR PETICIÓN AUTENTICADA
  // ========================================

  const realizarPeticion = (token) => {

    const headers = new Headers(
      opciones.headers || {}
    );

    headers.set(
      'Authorization',
      `Bearer ${token}`
    );

    return fetch(url, {
      ...opciones,
      headers
    });
  };

  // ========================================
  // OBTENER TOKEN DE ACCESO
  // ========================================

  let tokenUsado = obtenerToken();

  // Cuando no exista JWT, intentar renovar.
  if (!tokenUsado) {
    tokenUsado =
      await obtenerTokenRenovado();
  }

  if (!tokenUsado) {
    throw new Error(
      'No hay una sesión válida. Debes iniciar sesión.'
    );
  }

  // ========================================
  // PRIMER INTENTO
  // ========================================

  let respuesta =
    await realizarPeticion(tokenUsado);

  // ========================================
  // RENOVAR SI EL JWT EXPIRÓ
  // ========================================

  if (respuesta.status === 401) {

    // Otra petición pudo haber renovado
    // el token mientras esperábamos.
    const tokenEnAlmacenamiento =
      obtenerToken();

    const tokenParaReintento =
      tokenEnAlmacenamiento &&
      tokenEnAlmacenamiento !== tokenUsado

        ? tokenEnAlmacenamiento

        : await obtenerTokenRenovado();

    // Reintentar solo una vez.
    if (tokenParaReintento) {

      respuesta = await realizarPeticion(
        tokenParaReintento
      );
    }
  }

  // ========================================
  // DEVOLVER RESPUESTA
  // ========================================

  // Los servicios que llaman a apiFetch
  // se encargan de interpretar códigos
  // HTTP, mensajes y datos JSON.
  return respuesta;
}
