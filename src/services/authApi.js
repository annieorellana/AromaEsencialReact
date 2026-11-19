
const API_URL = 'http://localhost:8080/api/v1/auth';

// Conectar el login de React con Spring Boot
export async function iniciarSesionAPI(correo, password) {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      correo,
      password
    })
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    throw new Error(
      `Error al iniciar sesión: ${respuesta.status}`
    );
  }

  const datos = await respuesta.json();

  if (!datos.token) {
    throw new Error('El servidor no devolvió un token JWT.');
  }

  return datos;
}

 // Conectar el registro de React con Spring Boot
export async function registrarUsuarioAPI(usuario) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });
  } catch (error) {
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que Spring Boot esté iniciado.'
    );
  }

  if (!respuesta.ok) {
    if (respuesta.status === 409) {
      throw new Error(
        'El correo electrónico o RUN ya está registrado.'
      );
    }

    if (respuesta.status === 400) {
      throw new Error(
        'Los datos ingresados no son válidos. Revisa el formulario.'
      );
    }

    throw new Error(
      `Error al registrar el usuario: ${respuesta.status}`
    );
  }

  // Spring Boot devuelve los datos del usuario creado
  return await respuesta.json();
}

//
// ==========================================
// RENOVAR JWT CON COOKIE HTTPONLY
// ==========================================
//

export async function renovarSesionAPI() {

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    });

  } catch (error) {
    throw new Error(
      'No se pudo conectar con el servidor para renovar la sesión.'
    );
  }

  if (respuesta.status === 401) {
    throw new Error(
      'La sesión ha expirado. Debes iniciar sesión nuevamente.'
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al renovar la sesión: ${respuesta.status}`
    );
  }

  const datos = await respuesta.json();

  if (!datos.token) {
    throw new Error(
      'El servidor no devolvió un nuevo JWT.'
    );
  }

  return datos;
}

export async function cerrarSesionAPI() {
  const respuesta = await fetch(
    'http://localhost:8080/api/v1/auth/logout',
    {
      method: 'POST',
      credentials: 'include'
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      `Error al cerrar sesión: ${respuesta.status}`
    );
  }

  return true;
}
