import React from 'react';
import { Card } from 'react-bootstrap';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import FilaDato from '../../components/molecules/admin/FilaDato';
import Button from '../../components/atoms/Button';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function AdminPerfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  if (!usuario) return null;
  return (
    <PlantillaPagina titulo="Mi perfil" descripcion="Datos de la sesión de administrador.">
      <Card body className="mb-3" style={{ maxWidth: 520 }}>
        <dl className="row mb-0">
          <FilaDato etiqueta="Nombre" valor={`${usuario.nombre} ${usuario.apellido}`} />
          <FilaDato etiqueta="Correo" valor={usuario.correo} />
          <FilaDato etiqueta="Rol" valor={usuario.rol} />
          <FilaDato etiqueta="Comuna" valor={usuario.comuna || '—'} />
        </dl>
      </Card>
      <Button variant="outline-danger" onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</Button>
    </PlantillaPagina>
  );
}

export default AdminPerfil;
