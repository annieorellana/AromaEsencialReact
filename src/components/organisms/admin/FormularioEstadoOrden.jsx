import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from '../../atoms/Button';
import Alerta from '../../atoms/Alerta';
import CampoFormulario from '../../molecules/admin/CampoFormulario';
import { ESTADOS_ORDEN } from '../../../utils/adminFormato';

function FormularioEstadoOrden({ estadoActual, onGuardar }) {
  const [nuevo, setNuevo] = useState('');
  const [aviso, setAviso] = useState('');
  const opciones = ESTADOS_ORDEN.includes(estadoActual) ? ESTADOS_ORDEN : [estadoActual, ...ESTADOS_ORDEN];
  const guardar = () => { onGuardar(nuevo); setAviso(`Estado actualizado a "${nuevo}".`); };
  return (
    <Card body>
      <CampoFormulario id="estado" etiqueta="Actualizar estado" tipo="select" opciones={opciones}
        valor={nuevo || estadoActual} onCambio={(e) => { setNuevo(e.target.value); setAviso(''); }} />
      <Button disabled={!nuevo || nuevo === estadoActual} onClick={guardar}>Guardar estado</Button>
      {aviso && <Alerta variant="success" className="mt-3 mb-0 py-2" role="status">{aviso}</Alerta>}
    </Card>
  );
}

export default FormularioEstadoOrden;
