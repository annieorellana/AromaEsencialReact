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

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  iniciarSesion,
  validarDominioCorreo
} from '../../services/authService';

function Login() {

  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const enviarFormulario = (e) => {

    e.preventDefault();

    setError('');

    const correoLimpio =
      correo.trim().toLowerCase();

    // VALIDAR CORREO
    if (!correoLimpio) {
      setError(
        'El correo electrónico es obligatorio.'
      );

      return;
    }

    if (correoLimpio.length > 100) {
      setError(
        'El correo no puede superar los 100 caracteres.'
      );

      return;
    }

    if (!validarDominioCorreo(correoLimpio)) {
      setError(
        'Debe utilizar un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
      );

      return;
    }

    // VALIDAR CONTRASEÑA
    if (!password) {
      setError(
        'La contraseña es obligatoria.'
      );

      return;
    }

    if (
      password.length < 4 ||
      password.length > 10
    ) {
      setError(
        'La contraseña debe tener entre 4 y 10 caracteres.'
      );

      return;
    }

    // INICIAR SESIÓN MEDIANTE EL SERVICIO
    const resultado = iniciarSesion(
      correoLimpio,
      password
    );

    if (!resultado.exito) {

      setError(
        resultado.mensaje
      );

      return;
    }

    // REDIRECCIÓN SEGÚN ROL
    const rol =
      resultado.usuario.rol;

    if (rol === 'admin') {
      navigate('/admin');
      return;
    }

    navigate('/');
  };

  return (
    <Container className="py-5">

      <Row className="justify-content-center">

        <Col
          xs={12}
          sm={10}
          md={7}
          lg={5}
        >

          <Card className="shadow-sm">

            <Card.Body className="p-4">

              <div className="text-center mb-4">

                <h1 className="h3">
                  Iniciar sesión
                </h1>

                <p className="text-muted">
                  Ingresa a tu cuenta de AromaEsencial.
                </p>

              </div>

              {error && (

                <Alert variant="danger">
                  {error}
                </Alert>

              )}

              <Form onSubmit={enviarFormulario}>

                {/* CORREO */}
                <Form.Group className="mb-3">

                  <Form.Label>
                    Correo electrónico
                  </Form.Label>

                  <Form.Control
                    type="email"
                    value={correo}
                    onChange={(e) =>
                      setCorreo(e.target.value)
                    }
                    maxLength={100}
                    placeholder="ejemplo@gmail.com"
                    required
                  />

                </Form.Group>

                {/* CONTRASEÑA */}
                <Form.Group className="mb-4">

                  <Form.Label>
                    Contraseña
                  </Form.Label>

                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    minLength={4}
                    maxLength={10}
                    required
                  />

                  <Form.Text className="text-muted">
                    Entre 4 y 10 caracteres.
                  </Form.Text>

                </Form.Group>

                {/* BOTÓN */}
                <Button
                  type="submit"
                  variant="dark"
                  className="w-100"
                >
                  Iniciar sesión
                </Button>

              </Form>

              <hr />

              <p className="text-center mb-0">

                ¿No tienes una cuenta?{' '}

                <Link to="/registro">
                  Regístrate aquí
                </Link>

              </p>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
}

export default Login;