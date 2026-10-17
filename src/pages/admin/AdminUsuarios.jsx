import React, { useState } from 'react';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import BarraFiltros from '../../components/molecules/admin/BarraFiltros';
import CampoFormulario from '../../components/molecules/admin/CampoFormulario';
import TablaUsuarios, { ROLES } from '../../components/organisms/admin/TablaUsuarios';
import { obtenerUsuarios, normalizarRol } from '../../services/authService';

function AdminUsuarios() {
  const [usuarios] = useState(obtenerUsuarios);
  const [filtro, setFiltro] = useState('');
  const [rol, setRol] = useState('');
  const visibles = usuarios.filter((u) => (!rol || normalizarRol(u.rol) === rol) &&
    `${u.nombre} ${u.apellido} ${u.correo}`.toLowerCase().includes(filtro.trim().toLowerCase()));
  return (
    <PlantillaPagina titulo="Usuarios registrados">
      <BarraFiltros busqueda={filtro} onBusqueda={setFiltro} placeholder="Buscar por nombre o correo" etiqueta="Buscar usuarios">
        <CampoFormulario id="filtro-rol" etiqueta="" tipo="select" aria-label="Filtrar por rol" opciones={ROLES}
          placeholder="Todos los roles" valor={rol} onCambio={(e) => setRol(e.target.value)} />
      </BarraFiltros>
      <TablaUsuarios usuarios={visibles} />
    </PlantillaPagina>
  );
}

export default AdminUsuarios;
