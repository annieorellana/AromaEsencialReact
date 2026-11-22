
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

import useAuth from '../../hooks/useAuth';
import { normalizarRol } from '../../services/authService';

import {
  listarUsuariosApi,
  crearUsuarioApi,
  actualizarUsuarioApi,
  eliminarUsuarioApi
} from '../../services/usuariosApi';

// ==========================================
// FORMULARIO INICIAL
// ==========================================

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

const textoLimpio = (valor) =>
  String(valor ?? '').trim();

// ==========================================
// ADMINISTRACIÓN DE USUARIOS
// ==========================================

function AdminUsuarios() {

  const { usuario: administradorActual } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rol, setRol] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);

  const [usuarioEditando, setUsuarioEditando] =
    useState(null);

  const [formulario, setFormulario] = useState({
    ...FORMULARIO_INICIAL
  });

  // ========================================
  // CARGAR USUARIOS DESDE MYSQL
  // ========================================

  const cargarUsuarios = useCallback(async () => {

    setCargando(true);

    try {

      const resultado = await listarUsuariosApi();

      if (!Array.isArray(resultado)) {
        throw new Error(
          'El servidor no devolvió una lista válida de usuarios.'
        );
      }

      setUsuarios(resultado);

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

  // ========================================
  // NORMALIZAR ROLES PARA FILTROS
  // ========================================

  const usuariosNormalizados = usuarios.map(
    (usuario) => ({
      ...usuario,
      rol: normalizarRol(usuario.rol)
    })
  );

  const visibles = usuariosNormalizados.filter(
    (usuario) => {

      const coincideRol =
        !rol || usuario.rol === rol;

      const texto = [
        usuario.run,
        usuario.nombre,
        usuario.apellido,
        usuario.correo
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        coincideRol &&
        texto.includes(
          filtro.trim().toLowerCase()
        )
      );
    }
  );

  // ========================================
  // ABRIR FORMULARIO NUEVO
  // ========================================

  const abrirNuevo = () => {

    setUsuarioEditando(null);

    setFormulario({
      ...FORMULARIO_INICIAL
    });

    setError('');
    setMensaje('');
    setMostrarModal(true);
  };

  // ========================================
  // ABRIR FORMULARIO EDITAR
  // ========================================

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
        ROLES_BACKEND[
          normalizarRol(usuario.rol)
        ] || 'CLIENTE',
      activo: usuario.activo !== false
    });

    setError('');
    setMensaje('');
    setMostrarModal(true);
  };

  // ========================================
  // ACTUALIZAR CAMPOS
  // ========================================

  const cambiarCampo = (evento) => {

    const {
      name,
      value,
      type,
      checked
    } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }));
  };

  // ========================================
  // GUARDAR USUARIO
  // ========================================

  const guardarUsuario = async (evento) => {

    evento.preventDefault();

    if (guardando || eliminando) {
      return;
    }

    // Normalizar datos igual que el registro
    // público de Spring Boot.

    const datos = {
      ...formulario,

      run: textoLimpio(formulario.run)
        .replace(/[.\-\s]/g, '')
        .toUpperCase(),

      nombre: textoLimpio(formulario.nombre),

      apellido: textoLimpio(formulario.apellido),

      correo: textoLimpio(formulario.correo)
        .toLowerCase(),

      password: formulario.password,

      telefono:
        textoLimpio(formulario.telefono) || null,

      fechaNacimiento:
        formulario.fechaNacimiento || null,

      region:
        textoLimpio(formulario.region) || null,

      comuna:
        textoLimpio(formulario.comuna) || null,

      direccion:
        textoLimpio(formulario.direccion) || null
    };

    // ======================================
    // VALIDACIONES
    // ======================================

    if (
      !datos.run ||
      !datos.nombre ||
      !datos.apellido ||
      !datos.correo
    ) {
      setError(
        'Completa RUN, nombre, apellido y correo.'
      );
      return;
    }

    if (
      !usuarioEditando &&
      !datos.password.trim()
    ) {
      setError(
        'La contraseña es obligatoria para un usuario nuevo.'
      );
      return;
    }

    // Evitar que el administrador actual
    // se quite su propio acceso.

    const editaSuCuenta =
      usuarioEditando &&
      Number(usuarioEditando.id) ===
      Number(administradorActual?.id);

    if (
      editaSuCuenta &&
      (
        !datos.activo ||
        datos.rol !== 'ADMINISTRADOR'
      )
    ) {
      setError(
        'No puedes desactivar tu propia cuenta ni quitarte el rol administrador desde este formulario.'
      );
      return;
    }

    // Al editar, una contraseña vacía
    // conserva la contraseña existente.

    if (
      usuarioEditando &&
      !datos.password.trim()
    ) {
      datos.password = null;
    }

    setGuardando(true);
    setError('');
    setMensaje('');

    // ======================================
    // ENVIAR A SPRING BOOT
    // ======================================

    try {

      if (usuarioEditando) {

        await actualizarUsuarioApi(
          usuarioEditando.id,
          datos
        );

        setMensaje(
          'Usuario actualizado correctamente.'
        );

      } else {

        await crearUsuarioApi(datos);

        setMensaje(
          'Usuario creado correctamente.'
        );
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

  // ========================================
  // ELIMINAR USUARIO
  // ========================================

  const eliminarUsuario = async (usuario) => {

    if (eliminando || guardando) {
      return;
    }

    // No eliminar la cuenta que está
    // utilizando el administrador.

    if (
      Number(usuario.id) ===
      Number(administradorActual?.id)
    ) {
      setError(
        'No puedes eliminar la cuenta de administrador con la que estás trabajando.'
      );
      return;
    }

    const nombre = [
      usuario.nombre,
      usuario.apellido
    ]
      .filter(Boolean)
      .join(' ');

    const confirmar = window.confirm(
      `¿Eliminar definitivamente a "${nombre}"?\n\n` +
      'Esta acción no se puede deshacer. ' +
      'Si el usuario tiene boletas, es preferible ' +
      'editarlo y desmarcar "Usuario activo" ' +
      'para conservar el historial.'
    );

    if (!confirmar) {
      return;
    }

    setEliminando(true);
    setError('');
    setMensaje('');

    try {

      await eliminarUsuarioApi(usuario.id);

      setMensaje(
        'Usuario eliminado correctamente.'
      );

      await cargarUsuarios();

    } catch (err) {

      setError(
        (
          err.message ||
          'No fue posible eliminar el usuario.'
        ) +
        ' Si tiene compras asociadas, puedes desactivarlo en lugar de eliminarlo.'
      );

    } finally {
      setEliminando(false);
    }
  };

  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <PlantillaPagina titulo="Usuarios registrados">

      <div className="d-flex justify-content-end mb-3">

        <Button
          variant="dark"
          onClick={abrirNuevo}
          disabled={
            cargando ||
            guardando ||
            eliminando
          }
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

      {/* =================================
          FILTROS
         ================================= */}

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
          onCambio={
            (e) => setRol(e.target.value)
          }
        />

      </BarraFiltros>

      {/* =================================
          TABLA DE USUARIOS
         ================================= */}

      {cargando ? (

        <div className="text-center py-4">

          <Spinner animation="border" />

          <p className="mt-2">
            Cargando usuarios...
          </p>

        </div>

      ) : (

        <TablaUsuarios
          usuarios={visibles}
          onEditar={
            guardando || eliminando
              ? undefined
              : abrirEditar
          }
          onEliminar={
            guardando || eliminando
              ? undefined
              : eliminarUsuario
          }
        />

      )}

      {eliminando && (
        <Alert
          variant="info"
          className="mt-3"
        >
          Eliminando usuario...
        </Alert>
      )}

      {/* =================================
          MODAL CREAR / EDITAR
         ================================= */}

      <Modal
        show={mostrarModal}
        onHide={() => {
          if (!guardando) {
            setMostrarModal(false);
          }
        }}
        centered
        size="lg"
      >

        <Form onSubmit={guardarUsuario}>

          <Modal.Header
            closeButton={!guardando}
          >

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

              {/* =========================
                  CAMPOS PRINCIPALES
                 ========================= */}

              {[
                ['run', 'RUN', 12],
                ['nombre', 'Nombre', 60],
                ['apellido', 'Apellido', 60],
                ['correo', 'Correo electrónico', 120]
              ].map(([campo, etiqueta, maximo]) => (

                <div
                  className="col-md-6"
                  key={campo}
                >

                  <Form.Group>

                    <Form.Label>
                      {etiqueta}
                    </Form.Label>

                    <Form.Control
                      name={campo}
                      type={
                        campo === 'correo'
                          ? 'email'
                          : 'text'
                      }
                      value={formulario[campo]}
                      onChange={cambiarCampo}
                      maxLength={maximo}
                      disabled={guardando}
                      required
                    />

                  </Form.Group>

                </div>
              ))}

              {/* =========================
                  CONTRASEÑA
                 ========================= */}

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
                    disabled={guardando}
                    required={!usuarioEditando}
                    autoComplete="new-password"
                  />

                </Form.Group>

              </div>

              {/* =========================
                  TELÉFONO
                 ========================= */}

              <div className="col-md-6">

                <Form.Group>

                  <Form.Label>
                    Teléfono
                  </Form.Label>

                  <Form.Control
                    name="telefono"
                    value={formulario.telefono}
                    onChange={cambiarCampo}
                    maxLength={20}
                    disabled={guardando}
                  />

                </Form.Group>

              </div>

              {/* =========================
                  FECHA DE NACIMIENTO
                 ========================= */}

              <div className="col-md-6">

                <Form.Group>

                  <Form.Label>
                    Fecha de nacimiento
                  </Form.Label>

                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formulario.fechaNacimiento}
                    onChange={cambiarCampo}
                    disabled={guardando}
                  />

                </Form.Group>

              </div>

              {/* =========================
                  UBICACIÓN
                 ========================= */}

              {[
                ['region', 'Región', 80],
                ['comuna', 'Comuna', 80],
                ['direccion', 'Dirección', 200]
              ].map(([campo, etiqueta, maximo]) => (

                <div
                  className="col-md-6"
                  key={campo}
                >

                  <Form.Group>

                    <Form.Label>
                      {etiqueta}
                    </Form.Label>

                    <Form.Control
                      name={campo}
                      value={formulario[campo]}
                      onChange={cambiarCampo}
                      maxLength={maximo}
                      disabled={guardando}
                    />

                  </Form.Group>

                </div>
              ))}

              {/* =========================
                  ROL
                 ========================= */}

              <div className="col-md-6">

                <Form.Group>

                  <Form.Label>
                    Rol
                  </Form.Label>

                  <Form.Select
                    name="rol"
                    value={formulario.rol}
                    onChange={cambiarCampo}
                    disabled={guardando}
                  >

                    <option value="CLIENTE">
                      Cliente
                    </option>

                    <option value="VENDEDOR">
                      Vendedor
                    </option>

                    <option value="ADMINISTRADOR">
                      Administrador
                    </option>

                  </Form.Select>

                </Form.Group>

              </div>

              {/* =========================
                  ESTADO
                 ========================= */}

              <div className="col-md-6 d-flex align-items-end">

                <Form.Check
                  type="checkbox"
                  name="activo"
                  label="Usuario activo"
                  checked={formulario.activo}
                  onChange={cambiarCampo}
                  disabled={guardando}
                />

              </div>

            </div>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="secondary"
              disabled={guardando}
              onClick={() =>
                setMostrarModal(false)
              }
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
