
import React, { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner
} from 'react-bootstrap';

import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import BarraFiltros from '../../components/molecules/admin/BarraFiltros';
import CampoFormulario from '../../components/molecules/admin/CampoFormulario';
import TablaUsuarios, {
  ROLES
} from '../../components/organisms/admin/TablaUsuarios';

import { normalizarRol } from '../../services/authService';

import {
  listarUsuariosApi,
  crearUsuarioApi,
  actualizarUsuarioApi,
  eliminarUsuarioApi
} from '../../services/usuariosApi';

const FORMULARIO_INICIAL = {
  run: '',
  nombre: '',
  apellido: '',
  correo: '',
  password: '',
  telefono: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  rol: 'CLIENTE',
  activo: true
};

const ROLES_BACKEND = {
  admin: 'ADMINISTRADOR',
  vendedor: 'VENDEDOR',
  cliente: 'CLIENTE'
};

function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rol, setRol] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    ...FORMULARIO_INICIAL
  });

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError('');

    try {
      const datos = await listarUsuariosApi();

      setUsuarios(
        Array.isArray(datos)
          ? datos
          : []
      );

    } catch (err) {
      setError(
        err.message ||
        'No fue posible cargar los usuarios.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const usuariosNormalizados = usuarios.map((usuario) => ({
    ...usuario,
    rol: normalizarRol(usuario.rol)
  }));

  const visibles = usuariosNormalizados.filter((usuario) => {
    const coincideRol =
      !rol || usuario.rol === rol;

    const texto = `
      ${usuario.run || ''}
      ${usuario.nombre || ''}
      ${usuario.apellido || ''}
      ${usuario.correo || ''}
    `.toLowerCase();

    const coincideTexto = texto.includes(
      filtro.trim().toLowerCase()
    );

    return coincideRol && coincideTexto;
  });

  const abrirNuevo = () => {
    setUsuarioEditando(null);
    setFormulario({ ...FORMULARIO_INICIAL });
    setError('');
    setMostrarModal(true);
  };

  const abrirEditar = (usuario) => {
    setUsuarioEditando(usuario);

    setFormulario({
      run: usuario.run || '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      correo: usuario.correo || '',
      password: '',
      telefono: usuario.telefono || '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      region: usuario.region || '',
      comuna: usuario.comuna || '',
      direccion: usuario.direccion || '',
      rol:
        ROLES_BACKEND[normalizarRol(usuario.rol)] ||
        'CLIENTE',
      activo: usuario.activo !== false
    });

    setError('');
    setMostrarModal(true);
  };

  const cambiarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarUsuario = async (evento) => {
    evento.preventDefault();

    setGuardando(true);
    setError('');
    setMensaje('');

    const datos = {
      ...formulario,
      fechaNacimiento:
        formulario.fechaNacimiento || null
    };

    // Al editar, una contraseña vacía
    // conserva la contraseña anterior.
    if (usuarioEditando && !datos.password.trim()) {
      datos.password = null;
    }

    try {
      if (usuarioEditando) {
        await actualizarUsuarioApi(
          usuarioEditando.id,
          datos
        );

        setMensaje('Usuario actualizado correctamente.');
      } else {
        await crearUsuarioApi(datos);

        setMensaje('Usuario creado correctamente.');
      }

      setMostrarModal(false);
      await cargarUsuarios();

    } catch (err) {
      setError(
        err.message ||
        'No fue posible guardar el usuario.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (usuario) => {

    const confirmar = window.confirm(
      `¿Eliminar definitivamente al usuario "${usuario.nombre} ${usuario.apellido}"?`
    );

    if (!confirmar) {
      return;
    }

    setEliminando(true);
    setError('');
    setMensaje('');

    try {
      await eliminarUsuarioApi(usuario.id);

      setMensaje('Usuario eliminado correctamente.');

      await cargarUsuarios();

    } catch (err) {
      setError(
        err.message ||
        'No fue posible eliminar el usuario.'
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <PlantillaPagina titulo="Usuarios registrados">

      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="dark"
          onClick={abrirNuevo}
        >
          Nuevo usuario
        </Button>
      </div>

      {mensaje && (
        <Alert variant="success">
          {mensaje}
        </Alert>
      )}

      {error && !mostrarModal && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <BarraFiltros
        busqueda={filtro}
        onBusqueda={setFiltro}
        placeholder="Buscar por RUN, nombre o correo"
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

      {cargando ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      ) : (
        <TablaUsuarios
          usuarios={visibles}
          onEditar={abrirEditar}
          onEliminar={eliminarUsuario}
        />
      )}

      {eliminando && (
        <Alert variant="info" className="mt-3">
          Eliminando usuario...
        </Alert>
      )}

      <Modal
        show={mostrarModal}
        onHide={() => {
          if (!guardando) setMostrarModal(false);
        }}
        centered
        size="lg"
      >
        <Form onSubmit={guardarUsuario}>

          <Modal.Header closeButton={!guardando}>
            <Modal.Title>
              {usuarioEditando
                ? 'Editar usuario'
                : 'Nuevo usuario'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            <div className="row g-3">

              {[
                ['run', 'RUN'],
                ['nombre', 'Nombre'],
                ['apellido', 'Apellido'],
                ['correo', 'Correo electrónico']
              ].map(([campo, etiqueta]) => (
                <div className="col-md-6" key={campo}>
                  <Form.Group>
                    <Form.Label>{etiqueta}</Form.Label>

                    <Form.Control
                      name={campo}
                      type={campo === 'correo' ? 'email' : 'text'}
                      value={formulario[campo]}
                      onChange={cambiarCampo}
                      required
                    />
                  </Form.Group>
                </div>
              ))}

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>
                    {usuarioEditando
                      ? 'Nueva contraseña (opcional)'
                      : 'Contraseña'}
                  </Form.Label>

                  <Form.Control
                    type="password"
                    name="password"
                    value={formulario.password}
                    onChange={cambiarCampo}
                    required={!usuarioEditando}
                    autoComplete="new-password"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Teléfono</Form.Label>

                  <Form.Control
                    name="telefono"
                    value={formulario.telefono}
                    onChange={cambiarCampo}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Fecha de nacimiento</Form.Label>

                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formulario.fechaNacimiento}
                    onChange={cambiarCampo}
                  />
                </Form.Group>
              </div>

              {[
                ['region', 'Región'],
                ['comuna', 'Comuna'],
                ['direccion', 'Dirección']
              ].map(([campo, etiqueta]) => (
                <div className="col-md-6" key={campo}>
                  <Form.Group>
                    <Form.Label>{etiqueta}</Form.Label>

                    <Form.Control
                      name={campo}
                      value={formulario[campo]}
                      onChange={cambiarCampo}
                    />
                  </Form.Group>
                </div>
              ))}

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Rol</Form.Label>

                  <Form.Select
                    name="rol"
                    value={formulario.rol}
                    onChange={cambiarCampo}
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="ADMINISTRADOR">
                      Administrador
                    </option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <Form.Check
                  type="checkbox"
                  name="activo"
                  label="Usuario activo"
                  checked={formulario.activo}
                  onChange={cambiarCampo}
                />
              </div>

            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              disabled={guardando}
              onClick={() => setMostrarModal(false)}
            >
              Cancelar
            </Button>

            <Button
              variant="dark"
              type="submit"
              disabled={guardando}
            >
              {guardando
                ? 'Guardando...'
                : 'Guardar usuario'}
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>

    </PlantillaPagina>
  );
}

export default AdminUsuarios;
