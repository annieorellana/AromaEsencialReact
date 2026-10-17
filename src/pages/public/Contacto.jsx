import React, { useState } from 'react';

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';

function Contacto() {
  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDatos((anterior) => ({
      ...anterior,
      [name]: value
    }));
  };

  const validarCorreo = (correo) => {
    if (!correo.trim()) {
      return true;
    }

    const dominiosPermitidos = [
      '@duoc.cl',
      '@profesor.duoc.cl',
      '@gmail.com'
    ];

    const correoNormalizado = correo.trim().toLowerCase();

    return dominiosPermitidos.some((dominio) =>
      correoNormalizado.endsWith(dominio)
    );
  };

  const enviarFormulario = (e) => {
    e.preventDefault();

    setError('');
    setExito('');

    if (!datos.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (datos.nombre.trim().length > 100) {
      setError('El nombre no puede superar 100 caracteres.');
      return;
    }

    if (
      datos.correo.trim() &&
      !validarCorreo(datos.correo)
    ) {
      setError(
        'Debe usar un correo válido: @duoc.cl, @profesor.duoc.cl o @gmail.com.'
      );
      return;
    }

    if (datos.correo.length > 100) {
      setError('El correo no puede superar 100 caracteres.');
      return;
    }

    if (!datos.comentario.trim()) {
      setError('El comentario es obligatorio.');
      return;
    }

    if (datos.comentario.trim().length > 500) {
      setError('El comentario no puede superar 500 caracteres.');
      return;
    }

    setExito(
      'Mensaje enviado correctamente. Te responderemos a la brevedad.'
    );

    setDatos({
      nombre: '',
      correo: '',
      comentario: ''
    });
  };

  return (
    <Container className="py-5">

      <Row className="g-4">

        <Col lg={5}>

          <h1>Contáctanos</h1>

          <p className="text-muted">
            ¿Tienes dudas sobre nuestros perfumes, un pedido
            o quieres dejarnos tus comentarios?
          </p>

          <ul>
            <li>
              Respuesta dentro de 24 a 48 horas hábiles.
            </li>

            <li>
              Atención personalizada para cada consulta.
            </li>

            <li>
              contacto@aromaesencial.cl
            </li>

            <li>
              +56 9 1234 5678
            </li>
          </ul>

        </Col>

        <Col lg={7}>

          <Card className="shadow-sm">

            <Card.Body className="p-4">

              <h4 className="mb-4">
                Enviar mensaje
              </h4>

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {exito && (
                <Alert variant="success">
                  {exito}
                </Alert>
              )}

              <Form onSubmit={enviarFormulario}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Nombre completo *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="nombre"
                    value={datos.nombre}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />

                </Form.Group>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Correo electrónico
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="ejemplo@gmail.com"
                  />

                  <Form.Text className="text-muted">
                    El correo es opcional.
                  </Form.Text>

                </Form.Group>

                <Form.Group className="mb-4">

                  <Form.Label>
                    Comentario *
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="comentario"
                    value={datos.comentario}
                    onChange={handleChange}
                    maxLength={500}
                    required
                  />

                  <Form.Text className="text-muted">
                    Máximo 500 caracteres.
                  </Form.Text>

                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                >
                  Enviar mensaje
                </Button>

              </Form>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
}

export default Contacto;