
import React, { useState } from 'react';

import {
  Card,
  Alert
} from 'react-bootstrap';

import {
  useNavigate
} from 'react-router-dom';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import FilaDato
  from '../../components/molecules/admin/FilaDato';

import Button
  from '../../components/atoms/Button';

import useAuth
  from '../../hooks/useAuth';

// ==========================================
// AROMAESENCIAL
// PERFIL DEL ADMINISTRADOR
// ==========================================

function AdminPerfil() {

  const navigate = useNavigate();

  const {
    usuario,
    logout
  } = useAuth();

  const [cerrandoSesion, setCerrandoSesion] =
    useState(false);

  const [error, setError] =
    useState('');

  // ========================================
  // CERRAR SESIÓN
  // ========================================

  const manejarCerrarSesion = async () => {

    if (cerrandoSesion) {
      return;
    }

    setError('');
    setCerrandoSesion(true);

    try {

      // Esperar al cierre de sesión.
      // authService solicita revocar
      // el refresh token en Spring Boot.
      await logout();

      // Redirigir después de limpiar
      // la sesión del navegador.
      navigate('/', {
        replace: true
      });

    } catch (err) {

      console.error(
        'Error al cerrar sesión:',
        err
      );

      setError(
        'No fue posible completar el cierre de sesión.'
      );

    } finally {

      setCerrandoSesion(false);

    }
  };

  // ========================================
  // VALIDAR USUARIO
  // ========================================

  if (!usuario) {
    return null;
  }

  const nombreCompleto = [
    usuario.nombre,
    usuario.apellido
  ]
    .filter(Boolean)
    .join(' ') || '—';

  // ========================================
  // VISTA DEL PERFIL
  // ========================================

  return (

    <PlantillaPagina
      titulo="Mi perfil"
      descripcion="Datos de la sesión de administrador."
    >

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Card
        body
        className="mb-3"
        style={{
          maxWidth: 520
        }}
      >

        <dl className="row mb-0">

          <FilaDato
            etiqueta="Nombre"
            valor={nombreCompleto}
          />

          <FilaDato
            etiqueta="Correo"
            valor={usuario.correo || '—'}
          />

          <FilaDato
            etiqueta="Rol"
            valor={
              usuario.rol === 'admin'
                ? 'Administrador'
                : usuario.rol || '—'
            }
          />

          <FilaDato
            etiqueta="Comuna"
            valor={usuario.comuna || '—'}
          />

        </dl>

      </Card>

      <Button
        variant="outline-danger"
        onClick={manejarCerrarSesion}
        disabled={cerrandoSesion}
      >

        {cerrandoSesion
          ? 'Cerrando sesión...'
          : 'Cerrar sesión'}

      </Button>

    </PlantillaPagina>
  );
}

export default AdminPerfil;
