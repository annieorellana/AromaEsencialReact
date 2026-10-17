import React from 'react';
import TablaResponsiva from '../../molecules/admin/TablaResponsiva';
import Badge from '../../atoms/Badge';

const COLOR_ROL = { admin: 'dark', vendedor: 'primary', cliente: 'secondary' };
export const ROLES = ['admin', 'vendedor', 'cliente'];

function TablaUsuarios({ usuarios }) {
  return (
    <TablaResponsiva encabezados={['RUN', 'Nombre', 'Correo', 'Rol', 'Comuna']}
      vacio={usuarios.length === 0} mensajeVacio="No hay usuarios que coincidan.">
      {usuarios.map((u) => (
        <tr key={u.correo}>
          <td>{u.run || '—'}</td><td>{u.nombre} {u.apellido}</td><td>{u.correo}</td>
          <td><Badge bg={COLOR_ROL[u.rol] || 'secondary'}>{u.tipoUsuario || u.rol || 'Cliente'}</Badge></td>
          <td>{u.comuna || '—'}</td>
        </tr>
      ))}
    </TablaResponsiva>
  );
}

export default TablaUsuarios;
