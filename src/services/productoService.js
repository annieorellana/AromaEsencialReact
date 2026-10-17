import productosIniciales from '../data/productos';

const CLAVE_PRODUCTOS = 'aromaesencial_productos';

export const EVENTO_PRODUCTOS = 'aromaesencial-productos-actualizados';

// Obtener los productos guardados
export function obtenerProductos() {
  try {
    const guardados = localStorage.getItem(CLAVE_PRODUCTOS);

    if (guardados !== null) {
      const productos = JSON.parse(guardados);

      if (Array.isArray(productos)) {
        return productos;
      }
    }
  } catch (error) {
    console.error('Error al leer productos:', error);
  }

  return [...productosIniciales];
}

// Guardar productos
function guardarProductos(productos) {
  localStorage.setItem(
    CLAVE_PRODUCTOS,
    JSON.stringify(productos)
  );

  window.dispatchEvent(new Event(EVENTO_PRODUCTOS));

  return productos;
}

// CREATE: Agregar un producto
export function crearProducto(producto) {
  const productos = obtenerProductos();

  const nuevoProducto = {
    ...producto,
    id: producto.id || `PROD-${Date.now()}`
  };

  if (productos.some((item) => item.id === nuevoProducto.id)) {
    throw new Error('Ya existe un producto con ese ID.');
  }

  guardarProductos([...productos, nuevoProducto]);

  return nuevoProducto;
}

// READ: Buscar un producto por ID
export function obtenerProductoPorId(id) {
  return obtenerProductos().find(
    (producto) => producto.id === id
  );
}

// UPDATE: Actualizar un producto
export function actualizarProducto(id, cambios) {
  const productos = obtenerProductos();

  if (!productos.some((producto) => producto.id === id)) {
    throw new Error('El producto no existe.');
  }

  const actualizados = productos.map((producto) =>
    producto.id === id
      ? { ...producto, ...cambios, id }
      : producto
  );

  guardarProductos(actualizados);

  return actualizados.find((producto) => producto.id === id);
}

// DELETE: Eliminar un producto
export function eliminarProducto(id) {
  const productos = obtenerProductos();

  if (!productos.some((producto) => producto.id === id)) {
    return false;
  }

  guardarProductos(
    productos.filter((producto) => producto.id !== id)
  );

  return true;
}

// Consultar productos con stock crítico
export function obtenerProductosStockCritico() {
  return obtenerProductos().filter(
    (producto) => producto.stock <= producto.stockCritico
  );
}

// Consultar ofertas
export function obtenerProductosEnOferta() {
  return obtenerProductos().filter(
    (producto) => producto.oferta === true
  );
}