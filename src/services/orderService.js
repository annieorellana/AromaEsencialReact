
import {
  obtenerSesion,
  renovarSesion,
  normalizarRol
} from './authService';

import { apiFetch } from './apiFetch';

// ==========================================
// AROMAESENCIAL - SERVICIO DE BOLETAS
// ==========================================

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  'http://localhost:8080/api/v1'
).replace(/\/+$/, '');

const API_BOLETAS = `${API_BASE}/boletas`;
const API_PRODUCTOS = `${API_BASE}/productos`;

export const EVENTO_ORDENES =
  'aromaesencial-ordenes-actualizadas';

// ==========================================
// NOTIFICAR CAMBIOS EN ÓRDENES
// ==========================================

function notificarCambioOrdenes() {
  window.dispatchEvent(
    new Event(EVENTO_ORDENES)
  );
}

// ==========================================
// OBTENER USUARIO AUTENTICADO
// ==========================================

async function obtenerUsuarioActual() {

  let sesion = obtenerSesion();

  if (!sesion) {
    sesion = await renovarSesion();
  }

  const id = Number(sesion?.id);
  const rol = normalizarRol(sesion?.rol);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !rol
  ) {
    throw new Error(
      'Debes iniciar sesión para gestionar boletas.'
    );
  }

  return {
    ...sesion,
    id,
    rol
  };
}

// ==========================================
// INTERPRETAR ERRORES DE SPRING BOOT
// ==========================================

async function leerRespuesta(respuesta) {

  const texto = await respuesta.text();

  let datos = null;

  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = texto;
    }
  }

  if (!respuesta.ok) {

    let mensaje = `Error HTTP ${respuesta.status}`;

    if (typeof datos === 'string') {
      mensaje = datos || mensaje;
    } else if (datos) {
      mensaje =
        datos.mensaje ||
        datos.message ||
        datos.detail ||
        datos.error ||
        mensaje;
    }

    if (respuesta.status === 401) {
      mensaje =
        'La sesión no es válida o ha vencido. Inicia sesión nuevamente.';
    }

    if (respuesta.status === 403) {
      mensaje =
        'No tienes permisos para realizar esta operación.';
    }

    if (respuesta.status === 404) {
      mensaje =
        'El recurso solicitado no fue encontrado.';
    }

    const error = new Error(mensaje);
    error.status = respuesta.status;

    throw error;
  }

  if (
    respuesta.status === 204 ||
    !texto
  ) {
    return null;
  }

  if (typeof datos === 'string') {
    throw new Error(
      'El servidor devolvió una respuesta JSON inválida.'
    );
  }

  return datos;
}

// ==========================================
// OBTENER PRODUCTOS DESDE MYSQL
// ==========================================

async function obtenerProductosBackend() {

  const respuesta = await fetch(
    API_PRODUCTOS,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
  );

  const productos = await leerRespuesta(respuesta);

  if (!Array.isArray(productos)) {
    throw new Error(
      'No se pudo obtener el catálogo desde MySQL.'
    );
  }

  return productos;
}

// ==========================================
// CONVERTIR CARRITO A IDS DE MYSQL
// ==========================================

async function convertirProductos(
  productosFrontend = []
) {

  if (
    !Array.isArray(productosFrontend) ||
    productosFrontend.length === 0
  ) {
    throw new Error(
      'El carrito no contiene productos.'
    );
  }

  const productosBackend =
    await obtenerProductosBackend();

  return productosFrontend.map((item) => {

    const codigo = String(item.codigo ?? '')
      .trim()
      .toUpperCase();

    const producto = productosBackend.find(
      (actual) => {

        if (codigo) {
          return String(actual.codigo ?? '')
            .trim()
            .toUpperCase() === codigo;
        }

        return String(actual.id) ===
          String(item.id);
      }
    );

    if (!producto) {
      throw new Error(
        `No se encontró en MySQL el producto "${item.nombre || codigo || item.id}".`
      );
    }

    const cantidad = Number(item.cantidad);

    if (
      !Number.isSafeInteger(cantidad) ||
      cantidad <= 0
    ) {
      throw new Error(
        `Cantidad inválida para "${producto.nombre}".`
      );
    }

    return {
      productoId: producto.id,
      cantidad
    };
  });
}

// ==========================================
// CREAR BOLETA
// POST /api/v1/boletas
// ==========================================

export async function crearOrden(orden) {

  const usuario = await obtenerUsuarioActual();

  if (
    usuario.rol !== 'cliente' &&
    usuario.rol !== 'admin'
  ) {
    throw new Error(
      'Tu rol no tiene permiso para realizar compras.'
    );
  }

  const items = await convertirProductos(
    orden?.productos || []
  );

  const metodoEnvio =
    orden?.cliente?.envio || 'retiro';

  const partesDireccion = [
    orden?.cliente?.direccion,
    orden?.cliente?.departamento
  ].filter(Boolean);

  let direccionEnvio = null;

  if (metodoEnvio === 'domicilio') {

    direccionEnvio =
      partesDireccion.join(', ');

    if (orden?.cliente?.indicaciones) {
      direccionEnvio +=
        ` - ${orden.cliente.indicaciones}`;
    }
  }

  // ========================================
  // SOLICITUD PARA SPRING BOOT
  // ========================================

  const request = {
    usuarioId: usuario.id,

    items,

    cupon: orden?.cupon
      ? String(orden.cupon)
          .trim()
          .toUpperCase()
      : null,

    metodoPago:
      orden?.metodoPago || null,

    metodoEnvio,

    direccionEnvio,

    region:
      metodoEnvio === 'domicilio'
        ? orden?.cliente?.region || null
        : null,

    comuna:
      metodoEnvio === 'domicilio'
        ? orden?.cliente?.comuna || null
        : null,

    telefono:
      orden?.cliente?.telefono || null
  };

  // ========================================
  // ENVIAR CON JWT
  // ========================================

  const respuesta = await apiFetch(
    API_BOLETAS,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },

      body: JSON.stringify(request)
    }
  );

  const boleta = await leerRespuesta(respuesta);

  if (!boleta?.id) {
    throw new Error(
      'El backend no devolvió una boleta válida.'
    );
  }

  notificarCambioOrdenes();

  return boleta;
}

// ==========================================
// LISTAR BOLETAS
// GET /api/v1/boletas
// ==========================================

export async function obtenerOrdenes(
  usuarioId = null
) {

  const usuario = await obtenerUsuarioActual();

  let filtroId = usuarioId;

  // El cliente solo puede solicitar
  // sus propias boletas.
  if (usuario.rol === 'cliente') {
    filtroId = usuario.id;
  }

  const url = filtroId == null
    ? API_BOLETAS
    : `${API_BOLETAS}?usuarioId=${encodeURIComponent(filtroId)}`;

  const respuesta = await apiFetch(
    url,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
  );

  const ordenes = await leerRespuesta(respuesta);

  if (!Array.isArray(ordenes)) {
    throw new Error(
      'El backend no devolvió una lista válida de boletas.'
    );
  }

  // No ocultar errores devolviendo [].
  // Un arreglo vacío significa que realmente
  // no se recibieron órdenes.
  return ordenes;
}

// ==========================================
// CONSULTAR BOLETA POR ID
// GET /api/v1/boletas/{id}
// ==========================================

export async function obtenerOrdenPorId(id) {

  await obtenerUsuarioActual();

  const boletaId = Number(id);

  if (
    !Number.isSafeInteger(boletaId) ||
    boletaId <= 0
  ) {
    throw new Error(
      'El identificador de la boleta no es válido.'
    );
  }

  const respuesta = await apiFetch(
    `${API_BOLETAS}/${boletaId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
  );

  const boleta = await leerRespuesta(respuesta);

  if (!boleta?.id) {
    throw new Error(
      'No se encontró una boleta válida.'
    );
  }

  return boleta;
}

// ==========================================
// ACTUALIZAR ESTADO DE BOLETA
// PATCH /api/v1/boletas/{id}/estado
// ==========================================

export async function actualizarEstadoOrden(
  id,
  nuevoEstado
) {

  const usuario = await obtenerUsuarioActual();

  if (usuario.rol !== 'admin') {
    throw new Error(
      'Solo el administrador puede modificar estados de boletas.'
    );
  }

  const boletaId = Number(id);

  if (
    !Number.isSafeInteger(boletaId) ||
    boletaId <= 0
  ) {
    throw new Error(
      'El identificador de la boleta no es válido.'
    );
  }

  const estado = String(nuevoEstado || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_');

  const estadosValidos = [
    'CONFIRMADA',
    'EN_PREPARACION',
    'ENVIADA',
    'ENTREGADA',
    'CANCELADA'
  ];

  if (!estadosValidos.includes(estado)) {
    throw new Error(
      'El estado seleccionado no es válido.'
    );
  }

  const respuesta = await apiFetch(
    `${API_BOLETAS}/${boletaId}/estado`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },

      body: JSON.stringify({
        estado
      })
    }
  );

  const boleta = await leerRespuesta(respuesta);

  if (!boleta?.id) {
    throw new Error(
      'El servidor no confirmó el cambio de estado.'
    );
  }

  notificarCambioOrdenes();

  return boleta;
}
