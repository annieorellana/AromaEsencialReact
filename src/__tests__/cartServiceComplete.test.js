import {
  agregarProductoAlCarrito,
  cambiarCantidadProducto
} from '../services/cartService';

describe('Pruebas de Servicio: cartService', () => {

  // Test 6
  it('6. cartService - un producto nuevo debe entrar al carrito con cantidad 1', () => {
    const carritoInicial = [];

    const productoNuevo = {
      id: 'p1',
      nombre: 'Dark Cedar',
      precio: 96000,
      stock: 10
    };

    const resultado = agregarProductoAlCarrito(
      carritoInicial,
      productoNuevo
    );

    expect(resultado.length).toBe(1);
    expect(resultado[0].id).toBe('p1');
    expect(resultado[0].nombre).toBe('Dark Cedar');
    expect(resultado[0].cantidad).toBe(1);
  });

  // Test 7
  it('7. cartService - al re-agregar un producto existente aumenta la cantidad sin superar el stock', () => {
    const producto = {
      id: 'p2',
      nombre: 'Classic Wood',
      precio: 58000,
      stock: 3
    };

    let carrito = [];

    carrito = agregarProductoAlCarrito(
      carrito,
      producto
    );

    carrito = agregarProductoAlCarrito(
      carrito,
      producto
    );

    carrito = agregarProductoAlCarrito(
      carrito,
      producto
    );

    carrito = agregarProductoAlCarrito(
      carrito,
      producto
    );

    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(3);
  });

  // Test 8
  it('8. cartService - la cantidad no debe bajar de 1 ni superar el stock disponible', () => {
    const carritoInicial = [
      {
        id: 'p3',
        nombre: 'Urban Edge',
        precio: 62000,
        stock: 5,
        cantidad: 3
      }
    ];

    const carritoMinimo = cambiarCantidadProducto(
      carritoInicial,
      'p3',
      -10
    );

    expect(carritoMinimo[0].cantidad).toBe(1);

    const carritoMaximo = cambiarCantidadProducto(
      carritoInicial,
      'p3',
      10
    );

    expect(carritoMaximo[0].cantidad).toBe(5);
  });

});