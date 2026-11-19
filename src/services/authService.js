import {
  iniciarSesionAPI,
  registrarUsuarioAPI,
  renovarSesionAPI,
  cerrarSesionAPI,
} from './authApi';

// ==========================================
// CLAVES DE ALMACENAMIENTO
// ==========================================

const CLAVE_SESION = 'aromaesencial_sesion';

export const EVENTO_SESION =
  'aromaesencial-sesion-actualizada';

// ==========================================
// DOMINIOS PERMITIDOS
// ==========================================

export const DOMINIOS_PERMITIDOS = [
  '@duoc.cl',
  '@profesor.duoc.cl',
  '@gmail.com'
];

// ==========================================
// VALIDAR DOMINIO DEL CORREO
// ==========================================

export function validarDominioCorreo(correo) {

  if (!correo) {
    return false;
  }

  const correoNormalizado =
    correo.trim().toLowerCase();

  return DOMINIOS_PERMITIDOS.some(
    (dominio) =>
      correoNormalizado.endsWith(dominio)
  );
}

// ==========================================
// NORMALIZAR ROLES
// ==========================================

export function normalizarRol(rol) {

  const valor = String(rol || '')
    .trim()
    .toLowerCase();

  if (
    valor === 'administrador' ||
    valor === 'admin'
  ) {
    return 'admin';
  }

  if (
    valor === 'vendedor' ||
    valor === 'seller'
  ) {
    return 'vendedor';
  }

  if (valor === 'cliente') {
    return 'cliente';
  }

  return null;
}

// ==========================================
// GUARDAR SESIÓN DESDE LA API
// ==========================================

export function guardarSesionAPI(datos) {

  if (!datos || !datos.token) {
    throw new Error(
      'El servidor no devolvió un token JWT.'
    );
  }

  const rol = normalizarRol(datos.rol);

  if (!rol) {
    throw new Error(
      'El servidor devolvió un rol desconocido.'
    );
  }

  const sesion = {
    id: datos.id,
    nombre: datos.nombre || '',
    correo: datos.correo || '',
    rol: rol,
    token: datos.token
  };

  sessionStorage.setItem(
    CLAVE_SESION,
    JSON.stringify(sesion)
  );

  // Eliminar una posible sesión antigua
  localStorage.removeItem(CLAVE_SESION);

  window.dispatchEvent(
    new Event(EVENTO_SESION)
  );

  return sesion;
}

// ==========================================
// INICIAR SESIÓN CON SPRING BOOT
// ==========================================

export async function iniciarSesion(correo, password) {

  try {

    // Enviar las credenciales a la API
    const datos = await iniciarSesionAPI(
      correo.trim().toLowerCase(),
      password
    );

    // Guardar la sesión recibida
    const sesion = guardarSesionAPI(datos);

    return {
      exito: true,
      usuario: sesion
    };

  } catch (error) {

    return {
      exito: false,
      mensaje:
        error.message ||
        'No fue posible iniciar sesión.'
    };
  }
}

// ==========================================
// OBTENER SESIÓN ACTUAL
// ==========================================

export function obtenerSesion() {

  try {

    const datos = sessionStorage.getItem(
      CLAVE_SESION
    );

    if (!datos) {
      return null;
    }

    const sesion = JSON.parse(datos);

    if (!sesion || !sesion.token) {
      return null;
    }

    // Comprobar el vencimiento del JWT
    const partes = sesion.token.split('.');

    if (partes.length !== 3) {
      cerrarSesion();
      return null;
    }

    const base64 = partes[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const payload = JSON.parse(
      atob(base64)
    );

    const ahora = Math.floor(
      Date.now() / 1000
    );

    if (
      typeof payload.exp !== 'number' ||
      payload.exp <= ahora
  ) {
  // El JWT venció, pero todavía puede
  // existir una cookie de renovación válida.
    return null;
  }

    return sesion;

  } catch (error) {

    console.error(
      'Error al recuperar la sesión:',
      error
    );

    return null;
  }
}

 // ==========================================
 // RENOVAR SESIÓN CON SPRING BOOT
 // ==========================================

// Evitar varias renovaciones simultáneas
let renovacionEnCurso = null;

export async function renovarSesion() {

  if (renovacionEnCurso) {
    return renovacionEnCurso;
  }

  renovacionEnCurso = (async () => {

    // Conservamos los datos del usuario actual
    const sesionGuardada = sessionStorage.getItem(
      CLAVE_SESION
    );

    if (!sesionGuardada) {
      return null;
    }

    try {
      const sesion = JSON.parse(sesionGuardada);

      // Spring Boot renueva la cookie HttpOnly
      // y devuelve un nuevo JWT de acceso
      const respuesta = await renovarSesionAPI();

      const nuevaSesion = {
        ...sesion,
        token: respuesta.token
      };

      sessionStorage.setItem(
        CLAVE_SESION,
        JSON.stringify(nuevaSesion)
      );

      window.dispatchEvent(
        new Event(EVENTO_SESION)
      );

      return nuevaSesion;

    } catch (error) {
      console.error(
        'No fue posible renovar la sesión:',
        error
      );

      cerrarSesion();
      return null;
    }
  })();

  try {
    return await renovacionEnCurso;
  } finally {
    renovacionEnCurso = null;
  }
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

export function cerrarSesion() {

  sessionStorage.removeItem(CLAVE_SESION);

  // Eliminar posibles sesiones antiguas
  localStorage.removeItem(CLAVE_SESION);

  window.dispatchEvent(
    new Event(EVENTO_SESION)
  );

  return true;
}

export async function cerrarSesionCompleta() {
  try {
    // Revocar el refresh token y eliminar
    // la cookie HttpOnly desde Spring Boot.
    await cerrarSesionAPI();

  } catch (error) {
    console.error(
      'No fue posible cerrar la sesión en el servidor:',
      error
    );

  } finally {
    // Eliminar siempre la sesión local.
    cerrarSesion();
  }
}


// ==========================================
// COMPROBAR AUTENTICACIÓN
// ==========================================

export function estaAutenticado() {

  return obtenerSesion() !== null;
}

// ==========================================
// OBTENER TOKEN JWT
// ==========================================

export function obtenerToken() {

  const sesion = obtenerSesion();

  return sesion?.token || null;
}

export async function registrarUsuario(usuario) {

  try {

    // Excluir datos que no debe recibir la API
    const {
      rol,
      tipoUsuario,
      confirmarPassword,
      ...datosRegistro
    } = usuario;

    // Convertir la fecha vacía a null
    const datosLimpios = {
      ...datosRegistro,
      fechaNacimiento:
        datosRegistro.fechaNacimiento || null
    };

    // Enviar el registro a Spring Boot
    const respuesta = await registrarUsuarioAPI(
      datosLimpios
    );

    return {
      exito: true,
      usuario: respuesta
    };

  } catch (error) {

    return {
      exito: false,
      mensaje:
        error.message ||
        'No fue posible registrar al usuario.'
    };
  }
}
