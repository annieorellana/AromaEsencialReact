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
  validarDominioCorreo,
  iniciarSesion
} from '../../services/authService';

function Login() {

  const navigate = useNavigate();

  // ======================================
  // ESTADOS DEL FORMULARIO
  // ======================================

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // ======================================
  // ENVIAR FORMULARIO
  // ======================================

  const enviarFormulario = async (e) => {

    e.preventDefault();
    setError('');

    const correoLimpio = correo.trim().toLowerCase();

    // ======================================
    // VALIDAR CORREO
    // ======================================

    if (!correoLimpio) {
      setError('El correo electrónico es obligatorio.');
      return;
    }

    if (correoLimpio.length > 100) {
      setError('El correo no puede superar los 100 caracteres.');
      return;
    }

    if (!validarDominioCorreo(correoLimpio)) {
      setError(
        'Debe utilizar un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
      );
      return;
    }

    // ======================================
    // VALIDAR CONTRASEÑA
    // ======================================

    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    if (password.length > 128) {
      setError('La contraseña es demasiado larga.');
      return;
    }

    // ======================================
    // INICIAR SESIÓN CON SPRING BOOT
    // ======================================

    setCargando(true);

    try {

      // Esta función llama a authApi.js,
      // consulta Spring Boot y guarda el JWT.
      const resultado = await iniciarSesion(
        correoLimpio,
        password
      );

      // Verificar si el login fue exitoso
      if (!resultado.exito) {
        setError(
          resultado.mensaje ||
          'Correo o contraseña incorrectos.'
        );
        return;
      }

      // Obtener rol del usuario autenticado
      const rol = resultado.usuario.rol;

      // ======================================
      // REDIRECCIÓN SEGÚN ROL
      // ======================================

      if (rol === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      if (rol === 'vendedor') {
        navigate('/vendedor/productos', {
          replace: true
        });
        return;
      }

      // CLIENTE
      navigate('/', { replace: true });

    } catch (err) {

      setError(
        err.message ||
        'Ocurrió un error al iniciar sesión.'
      );

    } finally {

      setCargando(false);

    }
  };

  // ======================================
  // DISEÑO DEL LOGIN
  // ======================================

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

              {/* MOSTRAR ERRORES */}

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {/* FORMULARIO */}

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
                    autoComplete="username"
                    disabled={cargando}
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
                    autoComplete="current-password"
                    disabled={cargando}
                    required
                  />

                  <Form.Text className="text-muted">
                    Ingresa la contraseña de tu cuenta.
                  </Form.Text>

                </Form.Group>

                {/* BOTÓN INICIAR SESIÓN */}

                <Button
                  type="submit"
                  variant="dark"
                  className="w-100"
                  disabled={cargando}
                >
                  {cargando
                    ? 'Iniciando sesión...'
                    : 'Iniciar sesión'}
                </Button>

              </Form>

              <hr />

              {/* REGISTRO */}

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
