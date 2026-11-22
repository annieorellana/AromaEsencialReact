
import React, { useEffect, useState } from 'react';

import { Row, Col } from 'react-bootstrap';

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

import {
  obtenerOrdenPorId
} from '../../services/orderService';

// ==========================================
// ADAPTAR RESPUESTA REAL DE SPRING BOOT
// ==========================================

function adaptarOrden(boleta) {

  if (!boleta) {
    return null;
  }

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
// DETALLE DE ORDEN - VENDEDOR
// ==========================================

function SellerOrdenDetalle() {

  const { id } = useParams();

  const [orden, setOrden] = useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState('');

  // ========================================
  // CONSULTAR BOLETA EN MYSQL
  // ==========================================

  useEffect(() => {

    let activo = true;

    const cargarOrden = async () => {

      setCargando(true);
      setError('');
      setOrden(null);

      try {

        const boletaId = Number(id);

        if (
          !Number.isSafeInteger(boletaId) ||
          boletaId <= 0
        ) {
          throw new Error(
            'El número de boleta no es válido.'
          );
        }

        // orderService utiliza apiFetch,
        // que incorpora el JWT del vendedor.
        const respuesta =
          await obtenerOrdenPorId(boletaId);

        if (!activo) {
          return;
        }

        if (!respuesta?.id) {
          throw new Error(
            'El servidor no devolvió una boleta válida.'
          );
        }

        setOrden(
          adaptarOrden(respuesta)
        );

      } catch (err) {

        console.error(
          'Error al consultar boleta:',
          err
        );

        if (activo) {

          setError(
            err.message ||
            'No fue posible consultar la boleta.'
          );

          setOrden(null);
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
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <PlantillaPagina titulo="Detalle de boleta">

        <Alerta variant="info">
          Consultando boleta en MySQL...
        </Alerta>

      </PlantillaPagina>
    );
  }

  // ========================================
  // ERROR O BOLETA NO ENCONTRADA
  // ==========================================

  if (!orden) {

    return (
      <PlantillaPagina titulo="Detalle de boleta">

        <Alerta variant="warning">
          {error || 'Boleta no encontrada.'}
        </Alerta>

        <Link to="/vendedor/ordenes">
          Volver a órdenes
        </Link>

      </PlantillaPagina>
    );
  }

  // ========================================
  // VISTA SOLO LECTURA
  // ==========================================

  return (
    <PlantillaPagina
      titulo={`Boleta N° ${orden.id}`}
      acciones={
        <EstadoOrdenBadge
          estado={orden.estado}
        />
      }
    >

      <Link
        to="/vendedor/ordenes"
        className="d-inline-block mb-3"
      >
        ← Volver a órdenes
      </Link>

      <Row className="g-3">

        <Col lg={8}>

          <BoletaOrden orden={orden} />

        </Col>

        <Col lg={4}>

          <ResumenPagoOrden orden={orden} />

          <Alerta variant="info">

            <strong>
              Vista del vendedor
            </strong>

            <p className="mb-0 mt-2">
              Puedes consultar los datos
              de esta boleta, pero no
              modificar su estado.
            </p>

          </Alerta>

        </Col>

      </Row>

    </PlantillaPagina>
  );
}

export default SellerOrdenDetalle;
