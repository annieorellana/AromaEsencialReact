
import {
  listarProductos,
  buscarProducto,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi,
  listarStockCritico,
  listarOfertas
} from './CatalogoApi';

export const EVENTO_PRODUCTOS =
  'aromaesencial-productos-actualizados';

// Avisar a React que debe actualizar el catálogo
function notificarCambios() {
  window.dispatchEvent(new Event(EVENTO_PRODUCTOS));
}

// READ: Obtener productos desde Spring Boot
export async function obtenerProductos() {
  return await listarProductos();
}

// READ: Obtener producto por ID
export async function obtenerProductoPorId(id) {
  return await buscarProducto(id);
}

// CREATE: Crear producto en la base de datos
export async function crearProducto(producto) {
  const nuevoProducto = await crearProductoApi(producto);

  notificarCambios();

  return nuevoProducto;
}

// UPDATE: Actualizar producto en la base de datos
export async function actualizarProducto(id, cambios) {
  const actualizado = await actualizarProductoApi(id, cambios);

  notificarCambios();

  return actualizado;
}

// DELETE: Eliminar producto de la base de datos
export async function eliminarProducto(id) {
  await eliminarProductoApi(id);

  notificarCambios();

  return true;
}

// Consultar stock crítico desde Spring Boot
export async function obtenerProductosStockCritico() {
  return await listarStockCritico();
}

// Consultar productos en oferta desde Spring Boot
export async function obtenerProductosEnOferta() {
  return await listarOfertas();
}
