
import { obtenerToken } from './authService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// ==========================================
// FUNCIÓN GENERAL PARA PETICIONES HTTP
// ==========================================

async function solicitar(ruta, opciones = {}) {

  // Obtener token JWT de la sesión actual
  const token = obtenerToken();

  // Preparar encabezados
  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers
  };

  // Agregar autorización cuando exista token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Realizar petición al backend
  const respuesta = await fetch(
    `${API_BASE_URL}${ruta}`,
    {
      ...opciones,
      headers
    }
  );

  // ==========================================
  // MANEJO DE ERRORES
  // ==========================================

  if (!respuesta.ok) {

    let mensaje = `Error HTTP ${respuesta.status}`;

    try {

      const datos = await respuesta.json();

      mensaje =
        datos.mensaje ||
        datos.message ||
        mensaje;

    } catch {
      // La respuesta no contiene JSON.
    }

    const error = new Error(mensaje);
    error.status = respuesta.status;

    throw error;
  }

  // Respuestas sin contenido
  if (respuesta.status === 204) {
    return null;
  }

  // Convertir respuesta a JSON
  const texto = await respuesta.text();

  return texto ? JSON.parse(texto) : null;
}

// ==========================================
// PRODUCTOS
// ==========================================

// Listar todos los productos
export function listarProductos() {
  return solicitar('/productos');
}

// Buscar producto por ID
export function buscarProducto(id) {
  return solicitar(
    `/productos/${encodeURIComponent(id)}`
  );
}

// Crear producto
export function crearProductoApi(producto) {
  return solicitar('/productos', {
    method: 'POST',
    body: JSON.stringify(producto)
  });
}

// Actualizar producto
export function actualizarProductoApi(id, producto) {
  return solicitar(
    `/productos/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(producto)
    }
  );
}

// Eliminar producto
export function eliminarProductoApi(id) {
  return solicitar(
    `/productos/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    }
  );
}

// Listar productos con stock crítico
export function listarStockCritico() {
  return solicitar('/productos/stock-critico');
}

// Listar productos en oferta
export function listarOfertas() {
  return solicitar('/productos/ofertas');
}

// ==========================================
// CATEGORÍAS
// ==========================================

// Listar categorías
export function listarCategorias() {
  return solicitar('/categorias');
}

// Buscar categoría por ID
export function buscarCategoria(id) {
  return solicitar(
    `/categorias/${encodeURIComponent(id)}`
  );
}

// Crear categoría
export function crearCategoriaApi(categoria) {
  return solicitar('/categorias', {
    method: 'POST',
    body: JSON.stringify(categoria)
  });
}

// Actualizar categoría
export function actualizarCategoriaApi(id, categoria) {
  return solicitar(
    `/categorias/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(categoria)
    }
  );
}

// Eliminar categoría
export function eliminarCategoriaApi(id) {
  return solicitar(
    `/categorias/${encodeURIComponent(id)}`,
    {
      method: 'DELETE'
    }
  );
}
