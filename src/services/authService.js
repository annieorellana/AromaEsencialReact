
const API_URL = 'http://localhost:8080/api/v1';

const CLAVE_USUARIOS = 'aromaesencial_usuarios';
const CLAVE_USUARIOS_ANTIGUA = 'aromaesencial-users';
const CLAVE_SESION = 'aromaesencial_sesion';
const CLAVE_TOKEN = 'aromaesencial_token';

export const EVENTO_SESION =
  'aromaesencial-sesion-actualizada';

export const DOMINIOS_PERMITIDOS = [
  '@duoc.cl',
  '@profesor.duoc.cl',
  '@gmail.com'
];

// ==========================================
// OBTENER USUARIOS LOCALES
// ==========================================

export function obtenerUsuarios() {
  try {
    const actuales = JSON.parse(
      localStorage.getItem(CLAVE_USUARIOS) || '[]'
    );

    const antiguos = JSON.parse(
      localStorage.getItem(CLAVE_USUARIOS_ANTIGUA) || '[]'
    );

    const combinados = [
      ...(Array.isArray(actuales) ? actuales : []),
      ...(Array.isArray(antiguos) ? antiguos : [])
    ];

    return combinados.filter(
      (usuario, index, arreglo) =>
        index === arreglo.findIndex(
          item =>
            item.correo?.toLowerCase() ===
            usuario.correo?.toLowerCase()
        )
    );

  } catch (error) {
    console.error('Error al leer usuarios:', error);
    return [];
  }
}

// ==========================================
// GUARDAR USUARIOS LOCALES
// ==========================================

export function guardarUsuarios(usuarios) {
  try {
    localStorage.setItem(
      CLAVE_USUARIOS,
      JSON.stringify(usuarios)
    );

    return true;

  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    return false;
  }
}

// ==========================================
// VALIDAR DOMINIO
// ==========================================

export function validarDominioCorreo(correo) {
  if (!correo) return false;

  const normalizado = correo.trim().toLowerCase();

  return DOMINIOS_PERMITIDOS.some(
    dominio => normalizado.endsWith(dominio)
  );
}

// ==========================================
// NORMALIZAR ROL
// ==========================================

export function normalizarRol(rol) {
  const valor = String(rol || 'cliente')
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

  return 'cliente';
}

// ==========================================
// REGISTRAR USUARIO LOCAL
// COMPATIBILIDAD TEMPORAL
// ==========================================

export function registrarUsuario(usuario) {
  const usuarios = obtenerUsuarios();

  const correoNormalizado = usuario.correo
    .trim()
    .toLowerCase();

  if (
    usuarios.some(
      item =>
        item.correo?.toLowerCase() ===
        correoNormalizado
    )
  ) {
    return {
      exito: false,
      mensaje: 'Ya existe un usuario registrado con ese correo.'
    };
  }

  if (
    usuarios.some(
      item =>
        item.run &&
        usuario.run &&
        item.run.toUpperCase() ===
        usuario.run.toUpperCase()
    )
  ) {
    return {
      exito: false,
      mensaje: 'Ya existe un usuario registrado con ese RUN.'
    };
  }

  const nuevoUsuario = {
    ...usuario,
    id: usuario.id || `USR-${Date.now()}`,
    correo: correoNormalizado,
    rol: normalizarRol(usuario.rol || 'cliente'),
    tipoUsuario: usuario.tipoUsuario || 'Cliente'
  };

  const guardado = guardarUsuarios([
    ...usuarios,
    nuevoUsuario
  ]);

  return guardado
    ? { exito: true, usuario: nuevoUsuario }
    : {
        exito: false,
        mensaje: 'No fue posible registrar al usuario.'
      };
}

// ==========================================
// INICIAR SESIÓN CON SPRING BOOT
// ==========================================

export async function iniciarSesion(correo, password) {
  try {
    const respuesta = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo,
          password
        })
      }
    );

    if (!respuesta.ok) {
      return {
        exito: false,
        mensaje:
          respuesta.status === 401 ||
          respuesta.status === 403
            ? 'Correo o contraseña incorrectos.'
            : 'No fue posible iniciar sesión.'
      };
    }

    const datos = await respuesta.json();

    if (!datos.token) {
      return {
        exito: false,
        mensaje: 'El servidor no entregó un token de acceso.'
      };
    }

    const sesion = {
      id: datos.id,
      nombre: datos.nombre || '',
      apellido: datos.apellido || '',
      correo: datos.correo || correo,
      telefono: datos.telefono || '',
      direccion: datos.direccion || '',
      region: datos.region || '',
      comuna: datos.comuna || '',
      rol: normalizarRol(datos.rol)
    };

    // Guardar token JWT
    localStorage.setItem(
      CLAVE_TOKEN,
      datos.token
    );

    // Guardar datos de sesión
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify(sesion)
    );

    window.dispatchEvent(
      new Event(EVENTO_SESION)
    );

    return {
      exito: true,
      usuario: sesion
    };

  } catch (error) {
    console.error('Error de conexión con Spring Boot:', error);

    return {
      exito: false,
      mensaje:
        'No se pudo conectar con el backend. Verifica que Spring Boot esté ejecutándose.'
    };
  }
}

// ==========================================
// OBTENER TOKEN JWT
// ==========================================

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

    // Conservamos los datos del usuario actual
    const sesionGuardada = sessionStorage.getItem(
      CLAVE_SESION
    );

export function obtenerSesion() {
  try {
    const sesion = JSON.parse(
      localStorage.getItem(CLAVE_SESION)
    );

    // Una sesión antigua sin JWT no es válida
    if (!sesion || !obtenerToken()) {
      return null;
    }

    return sesion;

  } catch (error) {
    console.error('Error al leer la sesión:', error);
    return null;
  }
}

// ==========================================
// CERRAR SESIÓN
// ==========================================

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_TOKEN);

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
// COMPROBAR SESIÓN
// ==========================================

export function estaAutenticado() {
  return obtenerSesion() !== null;
}
