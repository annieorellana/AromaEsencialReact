
import {
  iniciarSesionAPI,
  registrarUsuarioAPI,
  renovarSesionAPI,
  cerrarSesionAPI
} from './authApi';

// ==========================================
// CONFIGURACIÓN DE SESIÓN
// ==========================================

const CLAVE_SESION = 'aromaesencial_sesion';
const CLAVE_TOKEN = 'aromaesencial_token';
const CLAVE_PERFIL = 'aromaesencial_perfil';

export const EVENTO_SESION =
  'aromaesencial-sesion-actualizada';

export const DOMINIOS_PERMITIDOS = [
  '@duoc.cl',
  '@profesor.duoc.cl',
  '@gmail.com'
];

let renovacionEnCurso = null;
let versionSesion = 0;

// ==========================================
// VALIDACIÓN DE CORREO
// ==========================================

export function validarDominioCorreo(correo) {
  const valor = String(correo || '')
    .trim()
    .toLowerCase();

  return DOMINIOS_PERMITIDOS.some(
    (dominio) => valor.endsWith(dominio)
  );
}

// ==========================================
// NORMALIZACIÓN DE ROLES
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
// LEER DATOS ALMACENADOS
// ==========================================

function leerJSON(almacen, clave) {
  try {
    const valor = almacen.getItem(clave);

    return valor
      ? JSON.parse(valor)
      : null;

  } catch {
    return null;
  }
}

// ==========================================
// LEER DATOS DEL JWT
// ==========================================

// Se utiliza solo para comprobar la
// consistencia de la sesión en React.
// La validación de seguridad la hace Spring Boot.

function leerClaims(token) {
  try {
    const base64 = token
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const datos = atob(
      base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      )
    );

    return JSON.parse(datos);

  } catch {
    return null;
  }
}

// ==========================================
// COMPROBAR IDENTIDAD DEL PERFIL
// ==========================================

function correspondeAlToken(perfil, token) {
  const claims = leerClaims(token);

  return Boolean(
    perfil &&
    Number.isSafeInteger(Number(perfil.id)) &&
    Number(perfil.id) > 0 &&
    claims?.sub &&
    String(claims.sub).toLowerCase() ===
      String(perfil.correo || '').toLowerCase()
  );
}

// ==========================================
// NOTIFICAR CAMBIO DE SESIÓN
// ==========================================

function notificarSesion() {
  window.dispatchEvent(
    new Event(EVENTO_SESION)
  );
}

// ==========================================
// OBTENER JWT VIGENTE
// ==========================================

export function obtenerToken() {
  const token = sessionStorage.getItem(
    CLAVE_TOKEN
  );

  const exp = leerClaims(
    token || ''
  )?.exp;

  // Si está vencido o por vencer,
  // apiFetch intentará renovarlo.
  return (
    token &&
    Number(exp) * 1000 > Date.now() + 5000
  )
    ? token
    : null;
}

// ==========================================
// OBTENER SESIÓN DEL USUARIO
// ==========================================

export function obtenerSesion() {
  const token = obtenerToken();

  if (!token) {
    return null;
  }

  const perfil = leerJSON(
    sessionStorage,
    CLAVE_SESION
  );

  return correspondeAlToken(perfil, token)
    ? perfil
    : null;
}

// ==========================================
// GUARDAR RESPUESTA DE AUTENTICACIÓN
// ==========================================

// Login entrega token, ID, nombre,
// correo y rol.
//
// Refresh entrega solamente un token.
// Por eso se conserva el perfil anterior.

export function guardarSesionAPI(
  datos,
  conservarPerfil = false
) {

  const token = datos?.token;

  const claims = leerClaims(
    token || ''
  );

  const anterior = conservarPerfil
    ? (
        leerJSON(
          sessionStorage,
          CLAVE_SESION
        ) ||
        leerJSON(
          localStorage,
          CLAVE_PERFIL
        )
      )
    : null;

  const perfil = {
    id: Number(
      datos?.id ?? anterior?.id
    ),

    nombre:
      datos?.nombre ??
      anterior?.nombre ??
      '',

    apellido:
      datos?.apellido ??
      anterior?.apellido ??
      '',

    correo:
      datos?.correo ??
      anterior?.correo ??
      '',

    telefono:
      datos?.telefono ??
      anterior?.telefono ??
      '',

    direccion:
      datos?.direccion ??
      anterior?.direccion ??
      '',

    region:
      datos?.region ??
      anterior?.region ??
      '',

    comuna:
      datos?.comuna ??
      anterior?.comuna ??
      '',

    rol: normalizarRol(
      datos?.rol ?? claims?.rol
    )
  };

  // Confirmar que la respuesta permite
  // recuperar el usuario correcto.
  if (
    !token ||
    !perfil.rol ||
    Number(claims?.exp) * 1000 <= Date.now() ||
    !correspondeAlToken(perfil, token)
  ) {
    throw new Error(
      'No fue posible recuperar una sesión válida. Inicia sesión nuevamente.'
    );
  }

  // JWT y sesión de la pestaña actual.
  sessionStorage.setItem(
    CLAVE_TOKEN,
    token
  );

  sessionStorage.setItem(
    CLAVE_SESION,
    JSON.stringify(perfil)
  );

  // Conservar solamente el perfil necesario
  // para recuperarlo después de renovar.
  // No guardar contraseñas.
  localStorage.setItem(
    CLAVE_PERFIL,
    JSON.stringify(perfil)
  );

  // Eliminar almacenamiento antiguo del JWT.
  localStorage.removeItem(
    CLAVE_TOKEN
  );

  localStorage.removeItem(
    CLAVE_SESION
  );

  notificarSesion();

  return perfil;
}

// ==========================================
// INICIAR SESIÓN REAL CON SPRING BOOT
// ==========================================

export async function iniciarSesion(
  correo,
  password
) {

  try {

    const correoNormalizado = String(
      correo || ''
    )
      .trim()
      .toLowerCase();

    const datos = await iniciarSesionAPI(
      correoNormalizado,
      password
    );

    // Invalidar renovaciones de una
    // sesión anterior.
    versionSesion += 1;

    const usuario = guardarSesionAPI(
      datos
    );

    return {
      exito: true,
      usuario
    };

  } catch (error) {

    console.error(
      'Error al iniciar sesión:',
      error
    );

    return {
      exito: false,
      mensaje:
        error.message ||
        'No fue posible iniciar sesión.'
    };
  }
}

// ==========================================
// REGISTRAR USUARIO REAL EN MYSQL
// ==========================================

export async function registrarUsuario(
  usuario
) {

  try {

    // No asignamos ID ni rol privilegiado.
    // Spring Boot crea el usuario CLIENTE.
    const creado = await registrarUsuarioAPI({
      run: usuario.run,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      password: usuario.password,
      telefono: usuario.telefono || null,
      fechaNacimiento:
        usuario.fechaNacimiento || null,
      region: usuario.region || null,
      comuna: usuario.comuna || null,
      direccion: usuario.direccion || null
    });

    return {
      exito: true,
      usuario: creado
    };

  } catch (error) {

    console.error(
      'Error al registrar usuario:',
      error
    );

    return {
      exito: false,
      mensaje:
        error.message ||
        'No fue posible registrar el usuario.'
    };
  }
}

// ==========================================
// RENOVAR JWT MEDIANTE COOKIE HTTPONLY
// ==========================================

export async function renovarSesion() {

  // Compartir una renovación en curso.
  if (renovacionEnCurso) {
    return renovacionEnCurso;
  }

  const versionInicial = versionSesion;

  renovacionEnCurso = (async () => {

    try {

      const datos =
        await renovarSesionAPI();

      // No restaurar una sesión si el
      // usuario cerró sesión mientras
      // se realizaba la renovación.
      if (
        versionInicial !== versionSesion
      ) {
        return null;
      }

      return guardarSesionAPI(
        datos,
        true
      );

    } catch (error) {

      console.warn(
        'No fue posible renovar la sesión:',
        error.message
      );

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
// LIMPIAR SESIÓN LOCAL
// ==========================================

export function cerrarSesion() {

  versionSesion += 1;

  sessionStorage.removeItem(
    CLAVE_SESION
  );

  sessionStorage.removeItem(
    CLAVE_TOKEN
  );

  localStorage.removeItem(
    CLAVE_PERFIL
  );

  // Compatibilidad con el almacenamiento
  // de versiones anteriores.
  localStorage.removeItem(
    CLAVE_SESION
  );

  localStorage.removeItem(
    CLAVE_TOKEN
  );

  notificarSesion();

  return true;
}

// ==========================================
// CERRAR SESIÓN EN SPRING BOOT
// ==========================================

export async function cerrarSesionCompleta() {

  try {

    // Solicitar revocación del refresh token
    // y eliminación de la cookie HttpOnly.
    await cerrarSesionAPI();

  } catch (error) {

    console.error(
      'No se pudo revocar la sesión en el servidor:',
      error
    );

  } finally {

    // Limpiar la sesión visible en React.
    cerrarSesion();
  }
}

// ==========================================
// COMPROBAR AUTENTICACIÓN
// ==========================================

export function estaAutenticado() {
  return obtenerSesion() !== null;
}



export function obtenerUsuarios() {
  return [];
}

export function guardarUsuarios() {
  return false;
}
