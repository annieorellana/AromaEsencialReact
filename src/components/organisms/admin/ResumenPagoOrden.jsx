import React from 'react';

import {
  Card
} from 'react-bootstrap';

import FilaDato
  from '../../molecules/admin/FilaDato';

import {
  dinero
} from '../../../utils/adminFormato';

function ResumenPagoOrden({
  orden
}) {

  // ========================================
  // PRODUCTOS
  // ========================================

  const productos =
    Array.isArray(
      orden.productos
    )
      ? orden.productos
      : [];

  // ========================================
  // TOTALES
  // ========================================

  const subtotal =
    orden.subtotal ??
    productos.reduce(
      (total, producto) =>
        total +
        Number(
          producto.precio || 0
        ) *
        Number(
          producto.cantidad || 0
        ),
      0
    );

  const descuento =
    Number(
      orden.descuento ?? 0
    );

  const costoEnvio =
    Number(
      orden.costoEnvio ?? 0
    );

  const total =
    Number(
      orden.total ?? 0
    );

  const metodoPago =
    orden.metodoPago ||
    '—';

  // ========================================
  // ETIQUETA DE DESCUENTO
  // ========================================

  const etiquetaDescuento =
    orden.cupon
      ? (
        <>
          Descuento{' '}
          <span
            style={{
              whiteSpace: 'nowrap'
            }}
          >
            ({orden.cupon})
          </span>
        </>
      )
      : 'Descuento';

  // ========================================
  // VISTA
  // ========================================

  return (
    <Card
      body
      className="mb-3"
    >

      <dl className="row mb-0">

        <FilaDato
          etiqueta="Subtotal"
          valor={
            dinero(
              subtotal
            )
          }
        />

        <FilaDato
          etiqueta={
            etiquetaDescuento
          }
          valor={
            `-${dinero(
              descuento
            )}`
          }
        />

        <FilaDato
          etiqueta="Despacho"
          valor={
            dinero(
              costoEnvio
            )
          }
        />

        <FilaDato
          etiqueta="Total"
          valor={
            dinero(
              total
            )
          }
          destacado
        />

        <FilaDato
          etiqueta="Método de pago"
          valor={
            metodoPago
          }
        />

      </dl>

    </Card>
  );
}

export default ResumenPagoOrden;