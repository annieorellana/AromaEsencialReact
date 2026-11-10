import React from 'react';

import {
  Row,
  Col,
  Card,
  Alert
} from 'react-bootstrap';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// ==========================================
// COLORES DEL GRÁFICO DE ESTADOS
// ==========================================

const COLORES_ESTADOS = [
  '#d67f5f',
  '#e8a87c',
  '#c38d9e',
  '#85b79d',
  '#d95d65',
  '#b8a89a'
];

// ==========================================
// COLORES DE PRODUCTOS
// ==========================================

const COLORES_BARRAS = [
  '#c9825d',
  '#d89b74',
  '#e5b394',
  '#b8755e',
  '#d6a184',
  '#a96854',
  '#efc6aa',
  '#bf8068'
];

// ==========================================
// NORMALIZAR ESTADO
// ==========================================

function normalizarEstado(
  estado
) {
  return String(
    estado || ''
  )
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
}

// ==========================================
// NOMBRE AMIGABLE DEL ESTADO
// ==========================================

function nombreEstado(
  estado
) {

  const nombres = {

    CONFIRMADA:
      'Confirmadas',

    EN_PREPARACION:
      'En preparación',

    ENVIADA:
      'Enviadas',

    ENTREGADA:
      'Entregadas',

    CANCELADA:
      'Canceladas',

    RECHAZADA:
      'Rechazadas'
  };

  return (
    nombres[estado] ||
    estado
  );
}

function GraficosDashboard({
  ordenes = []
}) {

  // ========================================
  // TORTA:
  // ÓRDENES REALES POR ESTADO
  // ========================================

  const cantidadesEstados =
    ordenes.reduce(
      (
        acumulado,
        orden
      ) => {

        const estado =
          normalizarEstado(
            orden.estado
          );

        if (!estado) {
          return acumulado;
        }

        acumulado[estado] =
          (
            acumulado[estado] ||
            0
          ) + 1;

        return acumulado;

      },
      {}
    );

  const datosEstados =
    Object.entries(
      cantidadesEstados
    ).map(
      ([
        estado,
        cantidad
      ]) => ({

        estado:
          nombreEstado(
            estado
          ),

        cantidad
      })
    );

  // ========================================
  // BARRAS:
  // PRODUCTOS REALMENTE VENDIDOS
  // ========================================

  const productosVendidos = {};

  ordenes
    .filter(
      (orden) => {

        const estado =
          normalizarEstado(
            orden.estado
          );

        return ![
          'CANCELADA',
          'RECHAZADA'
        ].includes(
          estado
        );
      }
    )
    .forEach(
      (orden) => {

        const detalles =
          Array.isArray(
            orden.detalles
          )
            ? orden.detalles
            : Array.isArray(
                orden.productos
              )
              ? orden.productos
              : [];

        detalles.forEach(
          (detalle) => {

            const nombre =
              detalle.nombreProducto ||
              detalle.nombre ||
              `Producto ${detalle.productoId || ''}`;

            const codigo =
              detalle.codigoProducto ||
              detalle.codigo ||
              '';

            const cantidad =
              Number(
                detalle.cantidad ||
                0
              );

            const clave =
              codigo ||
              nombre;

            if (
              !productosVendidos[
                clave
              ]
            ) {

              productosVendidos[
                clave
              ] = {

                producto:
                  nombre,

                codigo,

                cantidad: 0
              };
            }

            productosVendidos[
              clave
            ].cantidad +=
              cantidad;
          }
        );
      }
    );

  const datosProductos =
    Object.values(
      productosVendidos
    )
      .sort(
        (a, b) =>
          b.cantidad -
          a.cantidad
      )
      .slice(
        0,
        8
      );

  // ========================================
  // VISTA
  // ========================================

  return (

    <Row className="g-3 mb-4">

      {/* ===================================
          PRODUCTOS VENDIDOS
         =================================== */}

      <Col
        xs={12}
        xl={7}
      >

        <Card className="h-100 shadow-sm border-0">

          <Card.Body>

            <h2 className="h5 mb-1">
              Productos vendidos
            </h2>

            <p className="text-muted small">
              Unidades vendidas según las órdenes registradas en el backend.
            </p>

            {datosProductos.length === 0
              ? (

                <Alert
                  variant="light"
                >
                  No existen productos vendidos para graficar.
                </Alert>

              )
              : (

                <div
                  style={{
                    width: '100%',
                    height: 340
                  }}
                >

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={
                        datosProductos
                      }
                      layout="vertical"
                      margin={{
                        top: 10,
                        right: 30,
                        left: 40,
                        bottom: 10
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#eadbd2"
                      />

                      <XAxis
                        type="number"
                        allowDecimals={
                          false
                        }
                      />

                      <YAxis
                        type="category"
                        dataKey="producto"
                        width={120}
                      />

                      <Tooltip
                        formatter={
                          (
                            valor
                          ) => [
                            `${valor} unidad(es)`,
                            'Vendidas'
                          ]
                        }
                        labelFormatter={
                          (
                            nombre
                          ) =>
                            `Producto: ${nombre}`
                        }
                      />

                      <Bar
                        dataKey="cantidad"
                        name="Unidades vendidas"
                        radius={[
                          0,
                          10,
                          10,
                          0
                        ]}
                      >

                        {datosProductos.map(
                          (
                            producto,
                            index
                          ) => (

                            <Cell
                              key={
                                `${producto.codigo || producto.producto}-${index}`
                              }
                              fill={
                                COLORES_BARRAS[
                                  index %
                                  COLORES_BARRAS.length
                                ]
                              }
                            />

                          )
                        )}

                      </Bar>

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              )}

          </Card.Body>

        </Card>

      </Col>

      {/* ===================================
          ÓRDENES POR ESTADO
         =================================== */}

      <Col
        xs={12}
        xl={5}
      >

        <Card className="h-100 shadow-sm border-0">

          <Card.Body>

            <h2 className="h5 mb-1">
              Órdenes por estado
            </h2>

            <p className="text-muted small">
              Distribución actual de las órdenes registradas.
            </p>

            {datosEstados.length === 0
              ? (

                <Alert
                  variant="light"
                >
                  No existen órdenes para graficar.
                </Alert>

              )
              : (

                <div
                  style={{
                    width: '100%',
                    height: 340
                  }}
                >

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={
                          datosEstados
                        }
                        dataKey="cantidad"
                        nameKey="estado"
                        cx="50%"
                        cy="43%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                      >

                        {datosEstados.map(
                          (
                            entrada,
                            index
                          ) => (

                            <Cell
                              key={
                                entrada.estado
                              }
                              fill={
                                COLORES_ESTADOS[
                                  index %
                                  COLORES_ESTADOS.length
                                ]
                              }
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip
                        formatter={
                          (
                            valor
                          ) => [
                            `${valor} orden(es)`,
                            'Cantidad'
                          ]
                        }
                      />

                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              )}

          </Card.Body>

        </Card>

      </Col>

    </Row>

  );
}

export default GraficosDashboard;