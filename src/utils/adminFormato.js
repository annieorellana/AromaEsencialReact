// Utilidades de presentación del módulo administrador (sin lógica de negocio).
export const dinero = (valor = 0) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(valor) || 0);

export const fechaHora = (valor) => (valor ? new Date(valor).toLocaleString('es-CL') : '—');

export const CATEGORIAS = ['Hombre', 'Mujer', 'Unisex'];

// "Confirmada" es el estado con el que el Checkout público crea cada orden.
export const ESTADOS_ORDEN = ['Confirmada', 'En preparación', 'Enviada', 'Entregada', 'Cancelada'];

export const IMAGEN_POR_DEFECTO =
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80';

// Id legible para la URL pública (/productos/:id), p. ej. "Dark Cedar" -> "dark-cedar".
export const generarIdProducto = (nombre = '') =>
  nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
