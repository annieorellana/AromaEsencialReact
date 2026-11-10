// ==========================================
// UTILIDADES DE PRESENTACIÓN
// MÓDULO ADMINISTRADOR
// ==========================================

// FORMATO DE DINERO
export const dinero = (
  valor = 0
) =>
  new Intl.NumberFormat(
    'es-CL',
    {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }
  ).format(
    Number(valor) || 0
  );

// FORMATO DE FECHA Y HORA
export const fechaHora = (
  valor
) =>
  valor
    ? new Date(
        valor
      ).toLocaleString(
        'es-CL'
      )
    : '—';

// CATEGORÍAS DEL CATÁLOGO
export const CATEGORIAS = [
  'Hombre',
  'Mujer',
  'Unisex'
];

// ==========================================
// ESTADOS DE BOLETA / ORDEN
// ==========================================
//
// Estos valores coinciden exactamente con
// los estados manejados por el backend.
//
// CONFIRMADA
// EN_PREPARACION
// ENVIADA
// ENTREGADA
// CANCELADA
//
// ==========================================

export const ESTADOS_ORDEN = [
  'CONFIRMADA',
  'EN_PREPARACION',
  'ENVIADA',
  'ENTREGADA',
  'CANCELADA'
];

// IMAGEN POR DEFECTO
export const IMAGEN_POR_DEFECTO =
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80';

// ==========================================
// GENERAR ID LEGIBLE PARA PRODUCTOS
// ==========================================
//
// Ejemplo:
//
// "Dark Cedar"
//      ↓
// "dark-cedar"
//
// ==========================================

export const generarIdProducto = (
  nombre = ''
) =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /(^-|-$)/g,
      ''
    ) ||
  `prod-${Date.now()}`;