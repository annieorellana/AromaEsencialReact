import {
  validarDominioCorreo,
  normalizarRol,
  registrarUsuario,
  obtenerUsuarios,
  iniciarSesion,
  obtenerSesion,
  cerrarSesion,
  estaAutenticado
} from '../services/authService';

import {
  crearProducto,
  obtenerProductos,
  eliminarProducto
} from '../services/productoService';

describe(
  'Pruebas de Servicios: authService y productoService',
  () => {

    beforeEach(() => {
      localStorage.clear();
    });

    // TEST 9: authService
    it(
      '9. authService - valida dominios y ejecuta correctamente el flujo de autenticación',
      () => {

        // VALIDACIÓN DE DOMINIOS
        expect(
          validarDominioCorreo('usuario@gmail.com')
        ).toBeTrue();

        expect(
          validarDominioCorreo('alumno@duoc.cl')
        ).toBeTrue();

        expect(
          validarDominioCorreo('docente@profesor.duoc.cl')
        ).toBeTrue();

        expect(
          validarDominioCorreo('usuario@hotmail.com')
        ).toBeFalse();

        expect(
          validarDominioCorreo('')
        ).toBeFalse();

        // NORMALIZACIÓN DE ROLES
        expect(
          normalizarRol('Administrador')
        ).toBe('admin');

        expect(
          normalizarRol('admin')
        ).toBe('admin');

        expect(
          normalizarRol('cliente')
        ).toBe('cliente');

        expect(
          normalizarRol()
        ).toBe('cliente');

        // USUARIO DE PRUEBA
        const usuarioPrueba = {
          id: 'USR-TEST-001',
          run: '12345678-5',
          nombre: 'Martina',
          apellido: 'Aedo',
          correo: 'MARTINA.TEST@GMAIL.COM',
          password: '1234',
          telefono: '999999999',
          direccion: 'Dirección de prueba',
          region: 'Metropolitana',
          comuna: 'Santiago',
          rol: 'cliente'
        };

        // REGISTRO
        const registro = registrarUsuario(
          usuarioPrueba
        );

        expect(
          registro.exito
        ).toBeTrue();

        expect(
          registro.usuario.correo
        ).toBe(
          'martina.test@gmail.com'
        );

        expect(
          registro.usuario.rol
        ).toBe('cliente');

        // COMPROBAR USUARIO GUARDADO
        const usuarios =
          obtenerUsuarios();

        expect(
          usuarios.length
        ).toBe(1);

        expect(
          usuarios[0].id
        ).toBe('USR-TEST-001');

        // CORREO DUPLICADO
        const correoDuplicado =
          registrarUsuario({
            ...usuarioPrueba,
            id: 'USR-TEST-002',
            run: '11111111-1'
          });

        expect(
          correoDuplicado.exito
        ).toBeFalse();

        expect(
          correoDuplicado.mensaje
        ).toContain('correo');

        // RUN DUPLICADO
        const runDuplicado =
          registrarUsuario({
            ...usuarioPrueba,
            id: 'USR-TEST-003',
            correo:
              'otro.usuario@gmail.com'
          });

        expect(
          runDuplicado.exito
        ).toBeFalse();

        expect(
          runDuplicado.mensaje
        ).toContain('RUN');

        // LOGIN INCORRECTO
        const loginIncorrecto =
          iniciarSesion(
            'martina.test@gmail.com',
            '9999'
          );

        expect(
          loginIncorrecto.exito
        ).toBeFalse();

        // LOGIN CORRECTO
        const loginCorrecto =
          iniciarSesion(
            'martina.test@gmail.com',
            '1234'
          );

        expect(
          loginCorrecto.exito
        ).toBeTrue();

        expect(
          loginCorrecto.usuario.nombre
        ).toBe('Martina');

        expect(
          loginCorrecto.usuario.rol
        ).toBe('cliente');

        // SESIÓN ACTIVA
        const sesion =
          obtenerSesion();

        expect(
          sesion
        ).toBeDefined();

        expect(
          sesion.correo
        ).toBe(
          'martina.test@gmail.com'
        );

        expect(
          estaAutenticado()
        ).toBeTrue();

        // CERRAR SESIÓN
        const cierre =
          cerrarSesion();

        expect(
          cierre
        ).toBeTrue();

        expect(
          obtenerSesion()
        ).toBeNull();

        expect(
          estaAutenticado()
        ).toBeFalse();
      }
    );

    // TEST 10: productoService
    it(
      '10. productoService - debe crear un producto y dejarlo disponible en el catálogo',
      () => {

        const nuevoProducto = {
          id: 'prod-100',
          codigo: 'PF-100',
          nombre: 'Aroma Test',
          categoria: 'Unisex',
          precio: 45000,
          stock: 15,
          stockCritico: 5,
          descripcion:
            'Producto creado para prueba unitaria.',
          imagen:
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E',
          oferta: false
        };

        const spySetItem =
          spyOn(
            localStorage,
            'setItem'
          ).and.callThrough();

        crearProducto(
          nuevoProducto
        );

        const productos =
          obtenerProductos();

        const productoCreado =
          productos.find(
            (producto) =>
              producto.id ===
              'prod-100'
          );

        expect(
          Array.isArray(productos)
        ).toBeTrue();

        expect(
          productoCreado
        ).toBeDefined();

        expect(
          productoCreado.nombre
        ).toBe('Aroma Test');

        expect(
          productoCreado.precio
        ).toBe(45000);

        expect(
          productoCreado.stock
        ).toBe(15);

        expect(
          spySetItem
        ).toHaveBeenCalled();

        eliminarProducto(
          'prod-100'
        );
      }
    );

  }
);