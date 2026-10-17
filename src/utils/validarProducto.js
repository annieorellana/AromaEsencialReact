// Reglas de validación del mantenedor de productos (mismas de la Evaluación 1 + código único).
export function validarProducto(v, codigosEnUso = []) {
  const e = {};
  const codigo = (v.codigo || '').trim();
  const nombre = (v.nombre || '').trim();
  if (!codigo) e.codigo = 'El código es obligatorio.';
  else if (codigo.length < 3) e.codigo = 'Mínimo 3 caracteres.';
  else if (codigosEnUso.some((c) => String(c).toLowerCase() === codigo.toLowerCase())) e.codigo = 'Ya existe un producto con ese código.';
  if (!nombre) e.nombre = 'El nombre es obligatorio.';
  else if (nombre.length > 100) e.nombre = 'Máximo 100 caracteres.';
  if ((v.descripcion || '').length > 500) e.descripcion = 'Máximo 500 caracteres.';
  if (v.precio === '' || v.precio === undefined || Number.isNaN(Number(v.precio))) e.precio = 'El precio es obligatorio.';
  else if (Number(v.precio) < 0) e.precio = 'El precio no puede ser negativo.';
  if (v.stock === '' || v.stock === undefined || !Number.isInteger(Number(v.stock)) || Number(v.stock) < 0)
    e.stock = 'El stock debe ser un entero mayor o igual a 0.';
  if (v.stockCritico === '' || v.stockCritico === undefined || !Number.isInteger(Number(v.stockCritico)) || Number(v.stockCritico) < 0)
    e.stockCritico = 'El stock crítico debe ser un entero mayor o igual a 0.';
  if (!v.categoria) e.categoria = 'Selecciona una categoría.';
  return e;
}
