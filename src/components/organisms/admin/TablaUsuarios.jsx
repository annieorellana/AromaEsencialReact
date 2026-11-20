
import React from 'react';
import { Button } from 'react-bootstrap';

import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import Badge from '../../atoms/Badge';

// Colores según el rol del usuario
const COLOR_ROL = {
  admin: 'dark',
  vendedor: 'primary',
  cliente: 'secondary'
};

// Roles utilizados en los filtros
export const ROLES = [
  'admin',
  'vendedor',
  'cliente'
];

// Convierte los roles del backend al formato del frontend
function obtenerRol(rol) {
  const valor = String(rol || 'CLIENTE').toUpperCase();

  if (valor === 'ADMINISTRADOR' || valor === 'ADMIN') {
    return 'admin';
  }

  if (valor === 'VENDEDOR') {
    return 'vendedor';
  }

  return 'cliente';
}

function TablaUsuarios({
  usuarios = [],
  onEditar,
  onEliminar
}) {

  return (
    <TablaResponsiva
      encabezados={[
        'RUN',
        'Nombre',
        'Correo',
        'Rol',
        'Comuna',
        'Acciones'
      ]}
      vacio={usuarios.length === 0}
      mensajeVacio="No hay usuarios que coincidan."
    >

      {usuarios.map((usuario) => {

        const rol = obtenerRol(usuario.rol);

        return (
          <tr key={usuario.id ?? usuario.correo}>

            <td>
              {usuario.run || '—'}
            </td>

            <td>
              {usuario.nombre || ''}{' '}
              {usuario.apellido || ''}
            </td>

            <td>
              {usuario.correo || '—'}
            </td>

            <td>
              <Badge
                bg={COLOR_ROL[rol] || 'secondary'}
              >
                {rol === 'admin'
                  ? 'Administrador'
                  : rol === 'vendedor'
                    ? 'Vendedor'
                    : 'Cliente'}
              </Badge>
            </td>

            <td>
              {usuario.comuna || '—'}
            </td>

            <td>
              <div className="d-flex gap-2">

                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={!onEditar}
                  onClick={() => onEditar?.(usuario)}
                >
                  Editar
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  disabled={!onEliminar}
                  onClick={() => onEliminar?.(usuario)}
                >
                  Eliminar
                </Button>

              </div>
            </td>

          </tr>
        );
      })}

    </TablaResponsiva>
  );
}

export default TablaUsuarios;
