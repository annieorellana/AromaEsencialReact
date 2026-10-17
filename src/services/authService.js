const CLAVE_USUARIOS = 'aromaesencial_usuarios';
const CLAVE_USUARIOS_ANTIGUA = 'aromaesencial-users';
const CLAVE_SESION = 'aromaesencial_sesion';

export const EVENTO_SESION =
  'aromaesencial-sesion-actualizada';

// DOMINIOS PERMITIDOS DEL PROYECTO
export const DOMINIOS_PERMITIDOS = [
  '@duoc.cl',
  '@profesor.duoc.cl',
  '@gmail.com'
];

// OBTENER TODOS LOS USUARIOS
export function obtenerUsuarios() {
  try {
    const actuales = JSON.parse(
      localStorage.getItem(CLAVE_USUARIOS) || '[]'
    );

    const antiguos = JSON.parse(
      localStorage.getItem(CLAVE_USUARIOS_ANTIGUA) || '[]'
    );

    const listaActual = Array.isArray(actuales)
      ? actuales
      : [];

    const listaAntigua = Array.isArray(antiguos)
      ? antiguos
      : [];

    const combinados = [
      ...listaActual,
      ...listaAntigua
    ];

    // EVITAR USUARIOS DUPLICADOS POR CORREO
    return combinados.filter(
      (usuario, index, arreglo) =>
        index ===
        arreglo.findIndex(
          (item) =>
            item.correo?.toLowerCase() ===
            usuario.correo?.toLowerCase()
        )
    );

  } catch (error) {
    console.error(
      'Error al leer usuarios:',
      error
    );

    return [];
  }
}

// GUARDAR USUARIOS
export function guardarUsuarios(usuarios) {
  try {
    localStorage.setItem(
      CLAVE_USUARIOS,
      JSON.stringify(usuarios)
    );

    return true;

  } catch (error) {
    console.error(
      'Error al guardar usuarios:',
      error
    );

    return false;
  }
}

// VALIDAR DOMINIO DE CORREO
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

// NORMALIZAR ROLES
export function normalizarRol(rol) {
  const valor =
    String(rol || 'cliente')
      .trim()
      .toLowerCase();

  if (valor === 'administrador') {
    return 'admin';
  }

  if (valor === 'admin') {
    return 'admin';
  }

  return 'cliente';
}

// REGISTRAR USUARIO
export function registrarUsuario(usuario) {
  const usuarios = obtenerUsuarios();

  const correoNormalizado =
    usuario.correo.trim().toLowerCase();

  const existeCorreo = usuarios.some(
    (item) =>
      item.correo?.toLowerCase() ===
      correoNormalizado
  );

  if (existeCorreo) {
    return {
      exito: false,
      mensaje:
        'Ya existe un usuario registrado con ese correo.'
    };
  }

  const existeRun = usuarios.some(
    (item) =>
      item.run &&
      usuario.run &&
      item.run.toUpperCase() ===
        usuario.run.toUpperCase()
  );

  if (existeRun) {
    return {
      exito: false,
      mensaje:
        'Ya existe un usuario registrado con ese RUN.'
    };
  }

  const nuevoUsuario = {
    ...usuario,

    id:
      usuario.id ||
      `USR-${Date.now()}`,

    correo: correoNormalizado,

    rol: normalizarRol(
      usuario.rol || 'cliente'
    ),

    tipoUsuario:
      usuario.tipoUsuario || 'Cliente'
  };

  const guardado = guardarUsuarios([
    ...usuarios,
    nuevoUsuario
  ]);

  if (!guardado) {
    return {
      exito: false,
      mensaje:
        'No fue posible registrar al usuario.'
    };
  }

  return {
    exito: true,
    usuario: nuevoUsuario
  };
}

// INICIAR SESIÓN
export function iniciarSesion(
  correo,
  password
) {
  const usuarios = obtenerUsuarios();

  const correoNormalizado =
    correo.trim().toLowerCase();

  const usuario = usuarios.find(
    (item) =>
      item.correo?.toLowerCase() ===
        correoNormalizado &&
      (item.password ?? item.contrasena) ===
        password
  );

  if (!usuario) {
    return {
      exito: false,
      mensaje:
        'Correo o contraseña incorrectos.'
    };
  }

  const sesion = {
    id: usuario.id,

    nombre:
      usuario.nombre || '',

    apellido:
      usuario.apellido || '',

    correo:
      usuario.correo || '',

    telefono:
      usuario.telefono || '',

    direccion:
      usuario.direccion || '',

    region:
      usuario.region || '',

    comuna:
      usuario.comuna || '',

    rol:
      normalizarRol(usuario.rol)
  };

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
}

// OBTENER SESIÓN ACTUAL
export function obtenerSesion() {
  try {
    const sesion = JSON.parse(
      localStorage.getItem(CLAVE_SESION)
    );

    return sesion || null;

  } catch (error) {
    console.error(
      'Error al leer la sesión:',
      error
    );

    return null;
  }
}

// CERRAR SESIÓN
export function cerrarSesion() {
  localStorage.removeItem(
    CLAVE_SESION
  );

  window.dispatchEvent(
    new Event(EVENTO_SESION)
  );

  return true;
}

// COMPROBAR SI EXISTE SESIÓN
export function estaAutenticado() {
  return obtenerSesion() !== null;
}