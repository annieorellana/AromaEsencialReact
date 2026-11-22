
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

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

// ==========================================
// ADAPTAR BOLETA REAL DE SPRING BOOT
// ==========================================

function adaptarBoleta(boleta) {
  if (!boleta) return null;

  const detalles = Array.isArray(boleta.detalles)
    ? boleta.detalles
    : [];

  return {
    ...boleta,

    cliente: {
      nombre: boleta.nombreCliente || '',
      apellido: '',
      correo: boleta.correoCliente || '',
      telefono: boleta.telefono || '',
      envio: boleta.metodoEnvio || '',
      direccion: boleta.direccionEnvio || '',
      region: boleta.region || '',
      comuna: boleta.comuna || ''
    },

    productos: detalles.map((detalle) => ({
      id: detalle.productoId,
      detalleId: detalle.id,
      codigo: detalle.codigoProducto,
      nombre: detalle.nombreProducto,
      cantidad: detalle.cantidad,
      precio: detalle.precioUnitario,
      subtotal: detalle.subtotal
    }))
  };
}

// ==========================================
// DETALLE DE ORDEN - ADMINISTRADOR
// ==========================================

function AdminOrdenDetalle() {
  const { id } = useParams();

  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');

  const actualizacionEnCurso = useRef(false);

  // ========================================
  // CONSULTAR BOLETA EN MYSQL
  // ==========================================

  useEffect(() => {
    let activo = true;

    async function cargar() {
      setCargando(true);
      setError('');
      setOrden(null);

      try {
        const boleta = await obtenerOrdenPorId(id);

        if (!activo) return;

        if (!boleta?.id) {
          throw new Error(
            'La boleta no existe o no se pudo consultar.'
          );
        }

        setOrden(adaptarBoleta(boleta));

      } catch (err) {
        if (activo) {
          setError(
            err.message ||
            'No fue posible consultar la boleta.'
          );
        }

      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [id]);

  // ========================================
  // ACTUALIZAR ESTADO CON JWT
  // ==========================================

  const guardarEstado = async (nuevoEstado) => {
    if (!orden?.id || actualizacionEnCurso.current) {
      return false;
    }

    const estado = String(nuevoEstado || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/\s+/g, '_');

    if (estado === orden.estado) {
      return false;
    }

    actualizacionEnCurso.current = true;
    setActualizando(true);
    setError('');

    try {
      const respuesta = await actualizarEstadoOrden(
        orden.id,
        estado
      );

      if (!respuesta?.id) {
        throw new Error(
          'Spring Boot no confirmó el cambio de estado.'
        );
      }

      // Utilizar la respuesta definitiva del backend.
      setOrden(adaptarBoleta(respuesta));
      return true;

    } catch (err) {
      console.error('Error al cambiar estado:', err);

      setError(
        err.message ||
        'No fue posible actualizar el estado.'
      );

      return false;

    } finally {
      actualizacionEnCurso.current = false;
      setActualizando(false);
    }
  };

  // ========================================
  // PANTALLA DE CARGA
  // ==========================================

  if (cargando) {
    return (
      <Alerta variant="info">
        Consultando boleta en MySQL...
      </Alerta>
    );
  }

  // ========================================
  // BOLETA NO DISPONIBLE
  // ==========================================

  if (!orden) {
    return (
      <PlantillaPagina titulo="Detalle de boleta">
        <Alerta variant="warning">
          {error || 'Boleta no encontrada.'}
        </Alerta>

        <Link to="/admin/ordenes">
          Volver a órdenes
        </Link>
      </PlantillaPagina>
    );
  }

  // ========================================
  // VISTA DE ADMINISTRADOR
  // ==========================================

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
          titulo={`Boleta N° ${orden.id}`}
          acciones={
            <EstadoOrdenBadge estado={orden.estado} />
          }
        >
          {error && (
            <Alerta variant="danger">
              {error}
            </Alerta>
          )}

          <Row className="g-3">
            <Col lg={8}>
              <BoletaOrden orden={orden} />
            </Col>

            <Col lg={4}>
              <ResumenPagoOrden orden={orden} />

              <FormularioEstadoOrden
                estadoActual={orden.estado}
                onGuardar={guardarEstado}
                disabled={actualizando}
              />
            </Col>
          </Row>
        </PlantillaPagina>
      </div>
    </>
  );
}

export default AdminOrdenDetalle;
