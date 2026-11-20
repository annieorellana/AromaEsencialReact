
import {
  validarDominioCorreo,
  normalizarRol,
  iniciarSesion,
  obtenerSesion,
  obtenerToken,
  cerrarSesion,
  estaAutenticado
} from '../services/authService';

import {
  crearProducto,
  obtenerProductos,
  eliminarProducto
} from '../services/productoService';

describe('Pruebas de Servicios: autenticación JWT y productos', () => {

  let fetchOriginal;

  beforeEach(() => {
    localStorage.clear();

    fetchOriginal = window.fetch;
  });

  afterEach(() => {
    window.fetch = fetchOriginal;

    localStorage.clear();
  });

  // ==========================================
  // TEST 9: AUTENTICACIÓN CON JWT
  // ==========================================

  it(
    '9. authService - valida dominios e inicia y cierra sesión con JWT',
    async () => {

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
        normalizarRol('Vendedor')
      ).toBe('vendedor');

      expect(
        normalizarRol('cliente')
      ).toBe('cliente');

      expect(
        normalizarRol()
      ).toBe('cliente');

      // SIMULAR RESPUESTA DEL BACKEND

      const respuestaLogin = {
        token: 'jwt-token-de-prueba',
        id: 1,
        nombre: 'Martina',
        apellido: 'Aedo',
        correo: 'martina.test@gmail.com',
        rol: 'ADMINISTRADOR'
      };

      const fetchSimulado = jasmine
        .createSpy('fetch')
        .and.returnValue(
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => respuestaLogin
          })
        );

      window.fetch = fetchSimulado;

      // INICIAR SESIÓN

      const resultado = await iniciarSesion(
        'martina.test@gmail.com',
        '1234'
      );

      expect(resultado.exito).toBeTrue();

      expect(resultado.usuario.nombre).toBe('Martina');

      expect(resultado.usuario.rol).toBe('admin');

      // VERIFICAR SOLICITUD A SPRING BOOT

      expect(fetchSimulado).toHaveBeenCalled();

      const [url, opciones] =
        fetchSimulado.calls.mostRecent().args;

      expect(url).toBe(
        'http://localhost:8080/api/v1/auth/login'
      );

      expect(opciones.method).toBe('POST');

      expect(
        JSON.parse(opciones.body)
      ).toEqual({
        correo: 'martina.test@gmail.com',
        password: '1234'
      });

      // VERIFICAR TOKEN

      expect(obtenerToken()).toBe(
        'jwt-token-de-prueba'
      );

      // VERIFICAR SESIÓN

      const sesion = obtenerSesion();

      expect(sesion).not.toBeNull();

      expect(sesion.correo).toBe(
        'martina.test@gmail.com'
      );

      expect(estaAutenticado()).toBeTrue();

      // CERRAR SESIÓN

      const cierre = cerrarSesion();

      expect(cierre).toBeTrue();

      expect(obtenerToken()).toBeNull();

      expect(obtenerSesion()).toBeNull();

      expect(estaAutenticado()).toBeFalse();
    }
  );

  // ==========================================
  // TEST 10: PRODUCTOS CON SPRING BOOT
  // ==========================================

  it(
    '10. productoService - crea, consulta y elimina un producto mediante la API',
    async () => {

      const nuevoProducto = {
        id: 'prod-100',
        codigo: 'PF-100',
        nombre: 'Aroma Test',
        categoria: 'Unisex',
        precio: 45000,
        stock: 15,
        stockCritico: 5,
        descripcion: 'Producto de prueba',
        oferta: false
      };

      let productosSimulados = [];

      // SIMULAR LA API DE SPRING BOOT

      const fetchSimulado = jasmine
        .createSpy('fetch')
        .and.callFake(async (url, opciones = {}) => {

          const metodo = opciones.method || 'GET';

          if (
            url.endsWith('/productos') &&
            metodo === 'POST'
          ) {
            const producto = JSON.parse(opciones.body);

            productosSimulados.push(producto);

            return {
              ok: true,
              status: 201,
              text: async () => JSON.stringify(producto)
            };
          }

          if (
            url.endsWith('/productos') &&
            metodo === 'GET'
          ) {
            return {
              ok: true,
              status: 200,
              text: async () =>
                JSON.stringify(productosSimulados)
            };
          }

          if (
            url.endsWith('/productos/prod-100') &&
            metodo === 'DELETE'
          ) {
            productosSimulados = productosSimulados.filter(
              producto => producto.id !== 'prod-100'
            );

            return {
              ok: true,
              status: 204
            };
          }

          throw new Error(
            `Solicitud inesperada: ${metodo} ${url}`
          );
        });

      window.fetch = fetchSimulado;

      // CREAR PRODUCTO

      const productoCreado = await crearProducto(
        nuevoProducto
      );

      expect(productoCreado).toBeDefined();

      expect(productoCreado.nombre).toBe('Aroma Test');

      // CONSULTAR PRODUCTOS

      const productos = await obtenerProductos();

      expect(Array.isArray(productos)).toBeTrue();

      const productoEncontrado = productos.find(
        producto => producto.id === 'prod-100'
      );

      expect(productoEncontrado).toBeDefined();

      expect(productoEncontrado.precio).toBe(45000);

      expect(productoEncontrado.stock).toBe(15);

      // ELIMINAR PRODUCTO

      const eliminado = await eliminarProducto(
        'prod-100'
      );

      expect(eliminado).toBeTrue();

      // COMPROBAR ELIMINACIÓN

      const productosRestantes =
        await obtenerProductos();

      expect(
        productosRestantes.some(
          producto => producto.id === 'prod-100'
        )
      ).toBeFalse();

      expect(fetchSimulado).toHaveBeenCalled();
    }
  );

});
