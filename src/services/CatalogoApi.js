
const API_BASE_URL = 'http://localhost:8080/api/v1';

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers
    }
  });

  if (!respuesta.ok) {
    let mensaje = `Error HTTP ${respuesta.status}`;

    try {
      const datos = await respuesta.json();
      mensaje = datos.mensaje || datos.message || mensaje;
    } catch {
      // La respuesta no contiene JSON.
    }

    throw new Error(mensaje);
  }

  if (respuesta.status === 204) {
    return null;
  }

  const texto = await respuesta.text();

  return texto ? JSON.parse(texto) : null;
}

// PRODUCTOS

export function listarProductos() {
  return solicitar('/productos');
}

export function buscarProducto(id) {
  return solicitar(`/productos/${encodeURIComponent(id)}`);
}

export function crearProductoApi(producto) {
  return solicitar('/productos', {
    method: 'POST',
    body: JSON.stringify(producto)
  });
}

export function actualizarProductoApi(id, producto) {
  return solicitar(`/productos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(producto)
  });
}

export function eliminarProductoApi(id) {
  return solicitar(`/productos/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}

export function listarStockCritico() {
  return solicitar('/productos/stock-critico');
}

export function listarOfertas() {
  return solicitar('/productos/ofertas');
}

// CATEGORÍAS

export function listarCategorias() {
  return solicitar('/categorias');
}

export function buscarCategoria(id) {
  return solicitar(`/categorias/${encodeURIComponent(id)}`);
}

export function crearCategoriaApi(categoria) {
  return solicitar('/categorias', {
    method: 'POST',
    body: JSON.stringify(categoria)
  });
}

export function actualizarCategoriaApi(id, categoria) {
  return solicitar(`/categorias/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(categoria)
  });
}

export function eliminarCategoriaApi(id) {
  return solicitar(`/categorias/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}
