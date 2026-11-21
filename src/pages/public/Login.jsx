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
import { Link, useNavigate } from 'react-router-dom';
import {
  validarDominioCorreo,
  iniciarSesion,
  normalizarRol
} from '../../services/authService';

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError('');

    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio) {
      setError('El correo electrónico es obligatorio.');
      return;
    }

    if (correoLimpio.length > 100) {
      setError('El correo no puede superar los 100 caracteres.');
      return;
    }

    if (!validarDominioCorreo(correoLimpio)) {
      setError('Debe utilizar un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      return;
    }

    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    if (password.length > 128) {
      setError('La contraseña es demasiado larga.');
      return;
    }

    setCargando(true);

    try {
      // authService realiza la solicitud de autenticación a Spring Boot.
      const resultado = await iniciarSesion(correoLimpio, password);

      if (!resultado?.exito) {
        setError(resultado?.mensaje || 'Correo o contraseña incorrectos.');
        return;
      }

      const rol = normalizarRol(resultado.usuario?.rol);

      if (rol === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      if (rol === 'vendedor') {
        navigate('/vendedor/productos', { replace: true });
        return;
      }

      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h1 className="h3">Iniciar sesión</h1>
                <p className="text-muted">Ingresa a tu cuenta de AromaEsencial.</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={enviarFormulario}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    maxLength={100}
                    placeholder="ejemplo@gmail.com"
                    autoComplete="username"
                    disabled={cargando}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={cargando}
                    required
                  />
                  <Form.Text className="text-muted">
                    Ingresa la contraseña de tu cuenta.
                  </Form.Text>
                </Form.Group>

                <Button
                  type="submit"
                  variant="dark"
                  className="w-100"
                  disabled={cargando}
                >
                  {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
              </Form>

              <hr />

              <p className="text-center mb-0">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro">Regístrate aquí</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
