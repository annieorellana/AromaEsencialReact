
import React, { useEffect, useState } from 'react';

import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import BarraFiltros from '../../components/molecules/admin/BarraFiltros';
import CampoFormulario from '../../components/molecules/admin/CampoFormulario';
import TablaUsuarios, { ROLES } from '../../components/organisms/admin/TablaUsuarios';

import { normalizarRol } from '../../services/authService';
import { obtenerUsuariosAPI } from '../../services/usuarioApi';

function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rol, setRol] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarUsuarios() {
      try {
        setCargando(true);
        setError('');


        const resultado = await obtenerUsuariosAPI();

        if (activo) {
          setUsuarios(resultado);
        }

      } catch (err) {
        if (activo) {
          setUsuarios([]);
          setError(
            err.message || 'No se pudieron cargar los usuarios.'
            );


        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarUsuarios();

    return () => {
      activo = false;
    };
  }, []);

  const visibles = usuarios.filter(
    (u) =>
      (!rol || normalizarRol(u.rol) === rol) &&
      `${u.nombre} ${u.apellido} ${u.correo}`
        .toLowerCase()
        .includes(filtro.trim().toLowerCase())
  );

  return (
    <PlantillaPagina titulo="Usuarios registrados">

      {cargando && <p>Cargando usuarios...</p>}

      {error && (
        <p className="text-danger">{error}</p>
      )}

      <BarraFiltros
        busqueda={filtro}
        onBusqueda={setFiltro}
        placeholder="Buscar por nombre o correo"
        etiqueta="Buscar usuarios"
      >
        <CampoFormulario
          id="filtro-rol"
          etiqueta=""
          tipo="select"
          aria-label="Filtrar por rol"
          opciones={ROLES}
          placeholder="Todos los roles"
          valor={rol}
          onCambio={(e) => setRol(e.target.value)}
        />
      </BarraFiltros>

      <TablaUsuarios usuarios={visibles} />

    </PlantillaPagina>
  );
}

export default AdminUsuarios;
