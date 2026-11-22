
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Alert,
  Button,
  Form,
  Modal,
  Spinner,
  Table
} from 'react-bootstrap';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import {
  listarCategorias,
  crearCategoriaApi,
  actualizarCategoriaApi,
  eliminarCategoriaApi
} from '../../services/CatalogoApi';

// ==========================================
// FORMULARIO INICIAL
// ==========================================

const FORMULARIO_INICIAL = {
  nombre: '',
  descripcion: ''
};

// ==========================================
// ADMINISTRACIÓN DE CATEGORÍAS
// ==========================================

function AdminCategorias() {

  const [categorias, setCategorias] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [eliminandoId, setEliminandoId] =
    useState(null);

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [categoriaEditando, setCategoriaEditando] =
    useState(null);

  const [formulario, setFormulario] =
    useState(FORMULARIO_INICIAL);

  const [error, setError] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const [busqueda, setBusqueda] =
    useState('');

  const guardadoEnCurso = useRef(false);
  const eliminacionEnCurso = useRef(false);

  // ========================================
  // OBTENER CATEGORÍAS DESDE MYSQL
  // ========================================

  const cargarCategorias = useCallback(async () => {

    setCargando(true);

    try {

      const resultado = await listarCategorias();

      if (!Array.isArray(resultado)) {
        throw new Error(
          'El backend no devolvió una lista de categorías.'
        );
      }

      setCategorias(resultado);

    } catch (err) {

      setError(
        err.message ||
        'No fue posible consultar las categorías.'
      );

    } finally {
      setCargando(false);
    }

  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  // ========================================
  // CREAR NUEVA CATEGORÍA
  // ========================================

  const abrirNueva = () => {

    setCategoriaEditando(null);

    setFormulario({
      ...FORMULARIO_INICIAL
    });

    setError('');
    setMensaje('');
    setMostrarModal(true);
  };

  // ========================================
  // EDITAR CATEGORÍA
  // ========================================

  const abrirEditar = (categoria) => {

    setCategoriaEditando(categoria);

    setFormulario({
      nombre: categoria.nombre || '',
      descripcion: categoria.descripcion || ''
    });

    setError('');
    setMensaje('');
    setMostrarModal(true);
  };

  // ========================================
  // GUARDAR EN SPRING BOOT
  // ========================================

  const guardar = async (evento) => {

    evento.preventDefault();

    if (
      guardadoEnCurso.current ||
      eliminacionEnCurso.current
    ) {
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim()
    };

    // ======================================
    // VALIDAR NOMBRE
    // ======================================

    if (
      !datos.nombre ||
      datos.nombre.length > 60
    ) {
      setError(
        'El nombre es obligatorio y puede tener máximo 60 caracteres.'
      );
      return;
    }

    // ======================================
    // VALIDAR DESCRIPCIÓN
    // ======================================

    if (datos.descripcion.length > 255) {
      setError(
        'La descripción puede tener máximo 255 caracteres.'
      );
      return;
    }

    // ======================================
    // EVITAR NOMBRES DUPLICADOS
    // ======================================

    const nombreDuplicado = categorias.some(
      (categoria) =>

        Number(categoria.id) !==
        Number(categoriaEditando?.id)

        &&

        categoria.nombre
          .trim()
          .toLocaleLowerCase('es-CL') ===
        datos.nombre.toLocaleLowerCase('es-CL')
    );

    if (nombreDuplicado) {
      setError(
        'Ya existe una categoría con ese nombre.'
      );
      return;
    }

    // ======================================
    // ENVIAR PETICIÓN
    // ======================================

    guardadoEnCurso.current = true;
    setGuardando(true);
    setError('');

    try {

      if (categoriaEditando) {

        await actualizarCategoriaApi(
          categoriaEditando.id,
          datos
        );

      } else {

        await crearCategoriaApi(datos);

      }

      setMostrarModal(false);

      setMensaje(
        categoriaEditando
          ? 'Categoría actualizada correctamente.'
          : 'Categoría creada correctamente.'
      );

      await cargarCategorias();

    } catch (err) {

      setError(
        err.message ||
        'No fue posible guardar la categoría.'
      );

    } finally {

      guardadoEnCurso.current = false;
      setGuardando(false);

    }
  };

  // ========================================
  // ELIMINAR CATEGORÍA
  // ========================================

  const eliminar = async (categoria) => {

    if (
      guardadoEnCurso.current ||
      eliminacionEnCurso.current
    ) {
      return;
    }

    const confirmado = window.confirm(
      `¿Eliminar la categoría "${categoria.nombre}"?\n\n` +
      'Solo se puede eliminar si no contiene productos.'
    );

    if (!confirmado) {
      return;
    }

    eliminacionEnCurso.current = true;

    setEliminandoId(categoria.id);
    setError('');
    setMensaje('');

    try {

      await eliminarCategoriaApi(
        categoria.id
      );

      setMensaje(
        `La categoría "${categoria.nombre}" fue eliminada.`
      );

      await cargarCategorias();

    } catch (err) {

      setError(
        err.status === 409
          ? 'No se puede eliminar esta categoría porque tiene productos asociados.'
          : (
              err.message ||
              'No fue posible eliminar la categoría.'
            )
      );

    } finally {

      eliminacionEnCurso.current = false;
      setEliminandoId(null);

    }
  };

  // ========================================
  // FILTRAR CATEGORÍAS
  // ========================================

  const visibles = categorias.filter(
    (categoria) =>

      `${categoria.nombre || ''} ${categoria.descripcion || ''}`

        .toLocaleLowerCase('es-CL')

        .includes(
          busqueda
            .trim()
            .toLocaleLowerCase('es-CL')
        )
  );

  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <PlantillaPagina
      titulo="Categorías"
      descripcion="Administrar las categorías del catálogo de perfumes."

      acciones={

        <Button
          variant="dark"
          onClick={abrirNueva}
          disabled={
            guardando ||
            eliminandoId !== null
          }
        >
          Nueva categoría
        </Button>

      }
    >

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
          BUSCADOR
         ================================= */}

      <Form.Group
        className="mb-3"
        controlId="buscar-categorias"
      >

        <Form.Label>
          Buscar categoría
        </Form.Label>

        <Form.Control
          value={busqueda}

          onChange={
            (evento) =>
              setBusqueda(evento.target.value)
          }

          placeholder="Nombre o descripción"
        />

      </Form.Group>

      {/* =================================
          LISTADO DE CATEGORÍAS
         ================================= */}

      {cargando ? (

        <div className="py-4 text-center">

          <Spinner
            animation="border"
            role="status"
          />

          <p className="mt-2">
            Cargando categorías...
          </p>

        </div>

      ) : (

        <Table responsive hover bordered>

          <thead>

            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {visibles.length === 0 ? (

              <tr>
                <td
                  colSpan={4}
                  className="text-center text-muted"
                >
                  No se encontraron categorías.
                </td>
              </tr>

            ) : (

              visibles.map((categoria) => (

                <tr key={categoria.id}>

                  <td>
                    {categoria.id}
                  </td>

                  <td>
                    {categoria.nombre}
                  </td>

                  <td>
                    {categoria.descripcion || '—'}
                  </td>

                  <td>

                    <div className="d-flex flex-wrap gap-2">

                      <Button
                        size="sm"
                        variant="outline-primary"
                        disabled={
                          guardando ||
                          eliminandoId !== null
                        }

                        onClick={() =>
                          abrirEditar(categoria)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={
                          guardando ||
                          eliminandoId !== null
                        }

                        onClick={() =>
                          eliminar(categoria)
                        }
                      >

                        {eliminandoId === categoria.id
                          ? 'Eliminando...'
                          : 'Eliminar'}

                      </Button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </Table>

      )}

      {/* =================================
          MODAL DE CREACIÓN Y EDICIÓN
         ================================= */}

      <Modal
        show={mostrarModal}

        onHide={() => {
          if (!guardando) {
            setMostrarModal(false);
          }
        }}

        centered
      >

        <Form onSubmit={guardar}>

          <Modal.Header
            closeButton={!guardando}
          >

            <Modal.Title>

              {categoriaEditando
                ? 'Editar categoría'
                : 'Nueva categoría'}

            </Modal.Title>

          </Modal.Header>

          <Modal.Body>

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            {/* =========================
                NOMBRE
               ========================= */}

            <Form.Group
              className="mb-3"
              controlId="categoria-nombre"
            >

              <Form.Label>
                Nombre *
              </Form.Label>

              <Form.Control
                value={formulario.nombre}

                onChange={(evento) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    nombre: evento.target.value
                  }))
                }

                maxLength={60}
                disabled={guardando}
                required
              />

            </Form.Group>

            {/* =========================
                DESCRIPCIÓN
               ========================= */}

            <Form.Group
              className="mb-3"
              controlId="categoria-descripcion"
            >

              <Form.Label>
                Descripción (opcional)
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={3}

                value={formulario.descripcion}

                onChange={(evento) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    descripcion: evento.target.value
                  }))
                }

                maxLength={255}
                disabled={guardando}
              />

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="outline-secondary"
              onClick={() =>
                setMostrarModal(false)
              }
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="dark"
              disabled={guardando}
            >

              {guardando
                ? 'Guardando...'
                : 'Guardar categoría'}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </PlantillaPagina>

  );
}

export default AdminCategorias;
