
import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';

// ==========================================
// AROMAESENCIAL
// FORMULARIO DE ESTADO DE ÓRDENES
// ==========================================

// Estados definidos en EstadoBoleta.java.
const ETIQUETAS = {
  CONFIRMADA: 'Confirmada',
  EN_PREPARACION: 'En preparación',
  ENVIADA: 'Enviada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada'
};

// ==========================================
// TRANSICIONES PERMITIDAS POR SPRING BOOT
// ==========================================

const TRANSICIONES = {
  CONFIRMADA: [
    'EN_PREPARACION',
    'CANCELADA'
  ],

  EN_PREPARACION: [
    'ENVIADA',
    'CANCELADA'
  ],

  ENVIADA: [
    'ENTREGADA',
    'CANCELADA'
  ],

  ENTREGADA: [],
  CANCELADA: []
};

// ==========================================
// NORMALIZAR ESTADO
// ==========================================

function normalizarEstado(valor) {

  return String(valor || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_');
}

// ==========================================
// COMPONENTE
// ==========================================

function FormularioEstadoOrden({
  estadoActual,
  onGuardar,
  disabled = false
}) {

  const [nuevoEstado, setNuevoEstado] =
    useState('');

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState('');

  const guardadoEnCurso = useRef(false);

  // ========================================
  // ESTADO ACTUAL REAL
  // ========================================

  const estadoNormalizado =
    normalizarEstado(estadoActual);

  const etiquetaActual =
    ETIQUETAS[estadoNormalizado] ||
    estadoActual ||
    'Desconocido';

  // ========================================
  // OPCIONES PERMITIDAS
  // ========================================

  const opcionesPermitidas =
    TRANSICIONES[estadoNormalizado] || [];

  const estadoFinal =
    estadoNormalizado === 'ENTREGADA' ||
    estadoNormalizado === 'CANCELADA';

  // ========================================
  // SINCRONIZAR CUANDO CAMBIA LA BOLETA
  // ========================================

  useEffect(() => {

    setNuevoEstado('');
    setError('');

  }, [estadoNormalizado]);

  // ========================================
  // GUARDAR ESTADO
  // ========================================

  const guardar = async (evento) => {

    evento.preventDefault();

    if (
      disabled ||
      guardadoEnCurso.current ||
      !nuevoEstado
    ) {
      return;
    }

    // Validar que el backend permita
    // la transición seleccionada.
    if (
      !opcionesPermitidas.includes(nuevoEstado)
    ) {
      setError(
        'El cambio de estado seleccionado no está permitido.'
      );
      return;
    }

    if (typeof onGuardar !== 'function') {
      setError(
        'No está configurada la actualización de estados.'
      );
      return;
    }

    guardadoEnCurso.current = true;

    setGuardando(true);
    setError('');

    try {

      // AdminOrdenDetalle.jsx realiza
      // la petición autenticada a Spring Boot.
      const resultado = await onGuardar(
        nuevoEstado
      );

      // AdminOrdenDetalle muestra los errores
      // del backend. Evitamos duplicar mensajes.
      if (!resultado) {
        return;
      }

      // El estado definitivo se obtiene
      // mediante la respuesta del backend.
      setNuevoEstado('');

    } catch (err) {

      console.error(
        'Error al actualizar estado:',
        err
      );

      setError(
        err.message ||
        'No fue posible actualizar el estado.'
      );

    } finally {

      guardadoEnCurso.current = false;
      setGuardando(false);

    }
  };

  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <Card body className="mb-3">

      <h5 className="mb-3">
        Administrar estado
      </h5>

      {/* =================================
          ESTADO ACTUAL
         ================================= */}

      <p className="mb-3">

        <strong>
          Estado actual:
        </strong>{' '}

        {etiquetaActual}

      </p>

      {/* =================================
          ESTADO FINAL
         ================================= */}

      {estadoFinal ? (

        <Alert
          variant="secondary"
          className="mb-0"
        >

          Esta boleta tiene un estado final.

          No se permiten nuevas modificaciones.

        </Alert>

      ) : (

        <Form onSubmit={guardar}>

          {/* =========================
              SELECCIONAR ESTADO
             ========================= */}

          <Form.Group
            className="mb-3"
            controlId="nuevo-estado-orden"
          >

            <Form.Label>
              Cambiar a:
            </Form.Label>

            <Form.Select

              value={nuevoEstado}

              onChange={(evento) => {

                setNuevoEstado(
                  evento.target.value
                );

                setError('');

              }}

              disabled={
                disabled || guardando
              }

              required
            >

              <option value="">
                Selecciona un nuevo estado
              </option>

              {opcionesPermitidas.map(
                (estado) => (

                  <option
                    key={estado}
                    value={estado}
                  >

                    {ETIQUETAS[estado]}

                  </option>

                )
              )}

            </Form.Select>

          </Form.Group>

          {/* =========================
              MENSAJE DE ERROR
             ========================= */}

          {error && (

            <Alert variant="danger">
              {error}
            </Alert>

          )}

          {/* =========================
              GUARDAR CAMBIO
             ========================= */}

          <Button

            type="submit"

            variant="dark"

            className="w-100"

            disabled={
              disabled ||
              guardando ||
              !nuevoEstado
            }
          >

            {disabled || guardando
              ? 'Actualizando estado...'
              : 'Guardar estado'}

          </Button>

        </Form>

      )}

    </Card>

  );
}

export default FormularioEstadoOrden;
