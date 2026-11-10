import React, {
  useEffect,
  useState
} from 'react';

import {
  Row,
  Col
} from 'react-bootstrap';

import {
  Link,
  useParams
} from 'react-router-dom';

import PlantillaPagina
  from '../../components/templates/admin/PlantillaPagina';

import Alerta
  from '../../components/atoms/Alerta';

import EstadoOrdenBadge
  from '../../components/molecules/admin/EstadoOrdenBadge';

import BoletaOrden
  from '../../components/organisms/admin/BoletaOrden';

import ResumenPagoOrden
  from '../../components/organisms/admin/ResumenPagoOrden';

import FormularioEstadoOrden
  from '../../components/organisms/admin/FormularioEstadoOrden';

import {
  obtenerOrdenPorId,
  actualizarEstadoOrden
} from '../../services/orderService';

function AdminOrdenDetalle() {
  const { id } = useParams();

  const [
    orden,
    setOrden
  ] = useState(null);

  const [
    cargando,
    setCargando
  ] = useState(true);

  const [
    error,
    setError
  ] = useState('');

  const [
    actualizando,
    setActualizando
  ] = useState(false);

  // ========================================
  // ADAPTAR RESPUESTA DEL BACKEND
  // ========================================

  const adaptarOrden = (
    ordenBackend
  ) => {
    if (!ordenBackend) {
      return null;
    }

    const detalles =
      Array.isArray(
        ordenBackend.detalles
      )
        ? ordenBackend.detalles
        : [];

    return {
      ...ordenBackend,

      // COMPATIBILIDAD CON
      // COMPONENTES ANTIGUOS
      cliente: {
        nombre:
          ordenBackend.nombreCliente ||
          '',

        apellido:
          '',

        correo:
          ordenBackend.correoCliente ||
          '',

        telefono:
          ordenBackend.telefono ||
          '',

        envio:
          ordenBackend.metodoEnvio ||
          '',

        direccion:
          ordenBackend.direccionEnvio ||
          '',

        region:
          ordenBackend.region ||
          '',

        comuna:
          ordenBackend.comuna ||
          ''
      },

      productos:
        detalles.map(
          (detalle) => ({
            id:
              detalle.productoId,

            detalleId:
              detalle.id,

            codigo:
              detalle.codigoProducto,

            nombre:
              detalle.nombreProducto,

            cantidad:
              detalle.cantidad,

            precio:
              detalle.precioUnitario,

            subtotal:
              detalle.subtotal
          })
        )
    };
  };

  // ========================================
  // CARGAR DETALLE DE LA BOLETA
  // ========================================

  useEffect(() => {
    let activo = true;

    const cargarOrden = async () => {
      try {
        setCargando(true);
        setError('');

        const respuesta =
          await obtenerOrdenPorId(
            id
          );

        if (!activo) {
          return;
        }

        if (!respuesta) {
          setOrden(null);

          setError(
            'No fue posible encontrar la orden.'
          );

          return;
        }

        setOrden(
          adaptarOrden(
            respuesta
          )
        );

      } catch (err) {
        console.error(
          'Error al cargar la orden:',
          err
        );

        if (activo) {
          setError(
            'No fue posible cargar la orden.'
          );
        }

      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarOrden();

    return () => {
      activo = false;
    };
  }, [id]);

  // ========================================
  // CAMBIAR ESTADO
  // ========================================

  const guardarEstado =
    async (nuevoEstado) => {

      if (
        !orden ||
        actualizando
      ) {
        return false;
      }

      try {
        setActualizando(true);
        setError('');

        const actualizada =
          await actualizarEstadoOrden(
            orden.id,
            nuevoEstado
          );

        if (!actualizada) {
          setError(
            'No fue posible actualizar el estado de la orden.'
          );

          return false;
        }

        setOrden(
          adaptarOrden(
            actualizada
          )
        );

        return true;

      } catch (err) {
        console.error(
          'Error al cambiar estado:',
          err
        );

        setError(
          'No fue posible actualizar el estado de la orden.'
        );

        return false;

      } finally {
        setActualizando(false);
      }
    };

  // ========================================
  // CARGANDO
  // ========================================

  if (cargando) {
    return (
      <Alerta variant="info">
        Cargando orden...
      </Alerta>
    );
  }

  // ========================================
  // ERROR / ORDEN NO ENCONTRADA
  // ========================================

  if (!orden) {
    return (
      <Alerta variant="warning">

        {error ||
          'Orden no encontrada.'}

        {' '}

        <Link to="/admin/ordenes">
          Volver a órdenes
        </Link>

      </Alerta>
    );
  }

  // ========================================
  // VISTA
  // ========================================

  return (
    <>

      <Link
        to="/admin/ordenes"
        className="small"
      >
        ← Volver a órdenes
      </Link>

      <div className="mt-3">

        <PlantillaPagina
          titulo={
            `Boleta ${orden.id}`
          }
          acciones={
            <EstadoOrdenBadge
              estado={
                orden.estado
              }
            />
          }
        >

          {error && (
            <Alerta variant="danger">
              {error}
            </Alerta>
          )}

          <Row className="g-3">

            <Col lg={8}>

              <BoletaOrden
                orden={orden}
              />

            </Col>

            <Col lg={4}>

              <ResumenPagoOrden
                orden={orden}
              />

              <FormularioEstadoOrden
                estadoActual={
                  orden.estado
                }
                onGuardar={
                  guardarEstado
                }
                disabled={
                  actualizando
                }
              />

            </Col>

          </Row>

        </PlantillaPagina>

      </div>

    </>
  );
}

export default AdminOrdenDetalle;