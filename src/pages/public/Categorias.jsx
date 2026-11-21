
import React, { useEffect, useState } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { listarCategorias } from '../../services/CatalogoApi';

function Categorias() {

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    let activo = true;

    async function cargarCategorias() {

      try {

        const datos = await listarCategorias();

        if (activo) {
          setCategorias(
            Array.isArray(datos) ? datos : []
          );
        }

      } catch (err) {

        console.error(
          'Error al cargar categorías:',
          err
        );

        if (activo) {
          setError(
            err.message ||
            'No fue posible cargar las categorías.'
          );
        }

      } finally {

        if (activo) {
          setCargando(false);
        }

      }
    }

    cargarCategorias();

    return () => {
      activo = false;
    };

  }, []);

  return (
    <Container className="py-5">

      <h1 className="text-center mb-4">
        Categorías
      </h1>

      {cargando && (
        <div className="text-center py-5">

          <Spinner animation="border" />

          <p className="mt-3">
            Cargando categorías...
          </p>

        </div>
      )}

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!cargando && !error && categorias.length === 0 && (
        <Alert variant="info">
          No hay categorías disponibles.
        </Alert>
      )}

      {!cargando && !error && (
        <Row className="g-4">

          {categorias.map((categoria) => (

            <Col md={4} key={categoria.id}>

              <Card className="text-center shadow-sm h-100">

                <Card.Body className="py-5">

                  <Card.Title className="fs-3">
                    {categoria.nombre}
                  </Card.Title>

                  <Card.Text>
                    {categoria.descripcion ||
                      `Descubre nuestros perfumes ${categoria.nombre.toLowerCase()}.`}
                  </Card.Text>

                  <Button
                    as={Link}
                    to={`/categorias/${encodeURIComponent(
                      categoria.nombre.toLowerCase()
                    )}`}
                    variant="primary"
                  >
                    Ver perfumes
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>
      )}

    </Container>
  );
}

export default Categorias;
