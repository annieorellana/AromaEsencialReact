import {
  obtenerUsuarios,
  registrarUsuario
} from '../services/authService';

export const VENDEDOR_DEMO = {
  correo: 'vendedor@duoc.cl',
  password: 'vend1234'
};

export function sembrarVendedorDemo() {
  try {
    const usuarios =
      obtenerUsuarios();

    const yaExiste =
      usuarios.some(
        (usuario) =>
          usuario.rol === 'vendedor' ||
          usuario.correo
            ?.toLowerCase() ===
            VENDEDOR_DEMO.correo
              .toLowerCase()
      );

    if (yaExiste) {
      return false;
    }

    return registrarUsuario({
      run: '22222222-2',

      nombre:
        'Vendedor',

      apellido:
        'AromaEsencial',

      correo:
        VENDEDOR_DEMO.correo,

      password:
        VENDEDOR_DEMO.password,

      region:
        'Región Metropolitana de Santiago',

      comuna:
        'Santiago',

      direccion:
        'Tienda AromaEsencial',

      rol:
        'vendedor',

      tipoUsuario:
        'Vendedor'
    }).exito;

  } catch (error) {

    console.error(
      'Error al crear vendedor demo:',
      error
    );

    return false;
  }
}