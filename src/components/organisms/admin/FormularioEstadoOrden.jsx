import React, {
  useEffect,
  useState
} from 'react';

import {
  Card
} from 'react-bootstrap';

import Button
  from '../../atoms/Button';

import Alerta
  from '../../atoms/Alerta';

import CampoFormulario
  from '../../molecules/admin/CampoFormulario';

import {
  ESTADOS_ORDEN
} from '../../../utils/adminFormato';

function FormularioEstadoOrden({
  estadoActual,
  onGuardar,
  disabled = false
}) {
  const [
    nuevo,
    setNuevo
  ] = useState('');

  const [
    aviso,
    setAviso
  ] = useState('');

  const [
    error,
    setError
  ] = useState('');

  // ========================================
  // OPCIONES DE ESTADO
  // ========================================

  const opciones =
    ESTADOS_ORDEN.includes(
      estadoActual
    )
      ? ESTADOS_ORDEN
      : [
          estadoActual,
          ...ESTADOS_ORDEN
        ];

  // ========================================
  // SINCRONIZAR SI CAMBIA LA ORDEN
  // ========================================

  useEffect(() => {
    setNuevo('');
    setAviso('');
    setError('');
  }, [estadoActual]);

  // ========================================
  // GUARDAR NUEVO ESTADO
  // ========================================

  const guardar = async () => {
    if (
      disabled ||
      !nuevo ||
      nuevo === estadoActual
    ) {
      return;
    }

    setAviso('');
    setError('');

    try {
      const actualizado =
        await onGuardar(
          nuevo
        );

      // EL BACKEND RECHAZÓ EL CAMBIO
      if (!actualizado) {
        setError(
          'No fue posible actualizar el estado.'
        );

        return;
      }

      setAviso(
        `Estado actualizado a "${nuevo}".`
      );

      setNuevo('');

    } catch (err) {
      console.error(
        'Error al actualizar estado:',
        err
      );

      setError(
        'No fue posible actualizar el estado.'
      );
    }
  };

  // ========================================
  // VISTA
  // ========================================

  return (
    <Card body>

      <CampoFormulario
        id="estado"
        etiqueta="Actualizar estado"
        tipo="select"
        opciones={
          opciones
        }
        valor={
          nuevo ||
          estadoActual
        }
        onCambio={
          (e) => {
            setNuevo(
              e.target.value
            );

            setAviso('');
            setError('');
          }
        }
        disabled={
          disabled
        }
      />

      <Button
        disabled={
          disabled ||
          !nuevo ||
          nuevo === estadoActual
        }
        onClick={
          guardar
        }
      >
        {disabled
          ? 'Actualizando...'
          : 'Guardar estado'}
      </Button>

      {aviso && (
        <Alerta
          variant="success"
          className="mt-3 mb-0 py-2"
          role="status"
        >
          {aviso}
        </Alerta>
      )}

      {error && (
        <Alerta
          variant="danger"
          className="mt-3 mb-0 py-2"
          role="alert"
        >
          {error}
        </Alerta>
      )}

    </Card>
  );
}

export default FormularioEstadoOrden;