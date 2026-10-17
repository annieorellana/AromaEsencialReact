import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import PlantillaPagina from '../../components/templates/admin/PlantillaPagina';
import Alerta from '../../components/atoms/Alerta';
import EstadoOrdenBadge from '../../components/molecules/admin/EstadoOrdenBadge';
import BoletaOrden from '../../components/organisms/admin/BoletaOrden';
import ResumenPagoOrden from '../../components/organisms/admin/ResumenPagoOrden';
import FormularioEstadoOrden from '../../components/organisms/admin/FormularioEstadoOrden';
import useOrdenes from '../../hooks/useOrdenes';
import { actualizarEstadoOrden } from '../../services/orderService';

function AdminOrdenDetalle() {
  const { id } = useParams();
  const ordenes = useOrdenes();
  const orden = ordenes.find((o) => o.id === id);

  if (!orden) return <Alerta variant="warning">Orden no encontrada. <Link to="/admin/ordenes">Volver a órdenes</Link></Alerta>;
  return (
    <>
      <Link to="/admin/ordenes" className="small">← Volver a órdenes</Link>
      <div className="mt-3">
        <PlantillaPagina titulo={`Boleta ${orden.id}`} acciones={<EstadoOrdenBadge estado={orden.estado} />}>
          <Row className="g-3">
            <Col lg={8}><BoletaOrden orden={orden} /></Col>
            <Col lg={4}>
              <ResumenPagoOrden orden={orden} />
              <FormularioEstadoOrden estadoActual={orden.estado} onGuardar={(estado) => actualizarEstadoOrden(orden.id, estado)} />
            </Col>
          </Row>
        </PlantillaPagina>
      </div>
    </>
  );
}

export default AdminOrdenDetalle;
