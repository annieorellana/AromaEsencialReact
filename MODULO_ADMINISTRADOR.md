# Módulo administrador — AromaEsencial React

Este módulo se integró sobre el proyecto base `AromaEsencialReact`, conservando las páginas públicas, hooks y servicios compartidos.

## Acceso de demostración

- URL: `/login`
- Correo: `admin@duoc.cl`
- Contraseña: `admin123`

El proyecto crea automáticamente el usuario administrador de demostración si todavía no existe un usuario con rol administrador. Es una cuenta local para demostración académica, no para producción.

## Rutas incluidas

- `/admin` — resumen general
- `/admin/productos` — listado, búsqueda, filtros y eliminación de productos
- `/admin/productos/nuevo` — crear producto
- `/admin/productos/:id/editar` — editar producto
- `/admin/stock-critico` — productos bajo stock crítico
- `/admin/ordenes` — consultar y filtrar órdenes
- `/admin/ordenes/:id` — detalle de orden y actualización de estado
- `/admin/usuarios` — consultar y filtrar usuarios registrados
- `/admin/reportes` — resumen de ventas y órdenes
- `/admin/perfil` — datos de la sesión administrativa

## Estructura (Atomic Design)

- `components/atoms`: elementos pequeños reutilizables, como `Alerta`.
- `components/molecules/admin`: filtros, campos, filas y tarjetas reutilizables.
- `components/organisms/admin`: tablas, formularios, menú lateral, estadísticas y resúmenes.
- `components/templates/admin`: estructura común del panel y sus páginas.
- `pages/admin`: vistas completas del administrador.
- `routes/AdminRoutes.jsx`: rutas protegidas por sesión y rol.
- `utils`: validación de productos y formato de precios/fechas.

## Integración de datos

El módulo reutiliza los servicios y hooks del proyecto base (`productoService`, `orderService`, `authService`, `useProductos` y `useOrdenes`). Los productos se comparten con la tienda pública mediante el mismo almacenamiento local y eventos de actualización. No se creó una segunda fuente de datos para productos u órdenes.

## Ejecutar

Desde esta carpeta, ejecutar `npm install` y luego `npm start`.
