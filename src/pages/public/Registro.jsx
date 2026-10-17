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
  registrarUsuario,
  validarDominioCorreo
} from '../../services/authService';

// REGIONES Y COMUNAS
const regionesComunas = {
  'Región Metropolitana de Santiago': [
    'Santiago',
    'Providencia',
    'Las Condes',
    'Ñuñoa',
    'Puente Alto',
    'Maipú',
    'La Florida',
    'San Bernardo',
    'Peñalolén'
  ],

  'Región de la Araucanía': [
    'Temuco',
    'Villarrica',
    'Pucón',
    'Angol',
    'Victoria',
    'Padre Las Casas'
  ],

  'Región de Ñuble': [
    'Chillán',
    'Chillán Viejo',
    'San Carlos',
    'Bulnes',
    'Coihueco'
  ]
};

// VALIDAR RUN
function validarRun(run) {
  const limpio = run
    .replace(/\./g, '')
    .replace(/-/g, '')
    .toUpperCase()
    .trim();

  if (!/^[0-9]{6,8}[0-9K]$/.test(limpio)) {
    return false;
  }

  const cuerpo = limpio.slice(0, -1);
  const digito = limpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;

    multiplicador =
      multiplicador === 7
        ? 2
        : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);

  const digitoCalculado =
    resto === 11
      ? '0'
      : resto === 10
      ? 'K'
      : String(resto);

  return digito === digitoCalculado;
}

function Registro() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    run: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const comunasDisponibles =
    regionesComunas[datos.region] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDatos((anterior) => ({
      ...anterior,

      [name]: value,

      ...(name === 'region'
        ? { comuna: '' }
        : {})
    }));
  };

  const enviarFormulario = (e) => {
    e.preventDefault();

    setError('');
    setExito('');

    // RUN
    if (!datos.run.trim()) {
      setError(
        'El RUN es obligatorio.'
      );

      return;
    }

    if (!validarRun(datos.run)) {
      setError(
        'El RUN ingresado no es válido.'
      );

      return;
    }

    // NOMBRE
    if (!datos.nombre.trim()) {
      setError(
        'El nombre es obligatorio.'
      );

      return;
    }

    // APELLIDO
    if (!datos.apellido.trim()) {
      setError(
        'El apellido es obligatorio.'
      );

      return;
    }

    // CORREO
    const correoLimpio =
      datos.correo.trim().toLowerCase();

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

    const formatoCorreo =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio)) {
      setError(
        'Debe ingresar un correo electrónico válido.'
      );

      return;
    }

    if (!validarDominioCorreo(correoLimpio)) {
      setError(
        'Debe utilizar un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
      );

      return;
    }

    // CONTRASEÑA
    if (!datos.password) {
      setError(
        'La contraseña es obligatoria.'
      );

      return;
    }

    if (
      datos.password.length < 4 ||
      datos.password.length > 10
    ) {
      setError(
        'La contraseña debe tener entre 4 y 10 caracteres.'
      );

      return;
    }

    // CONFIRMACIÓN DE CONTRASEÑA
    if (
      datos.password !==
      datos.confirmarPassword
    ) {
      setError(
        'Las contraseñas no coinciden.'
      );

      return;
    }

    // TELÉFONO
    if (
      datos.telefono &&
      datos.telefono.length > 15
    ) {
      setError(
        'El teléfono no puede superar los 15 caracteres.'
      );

      return;
    }

    // REGIÓN
    if (!datos.region) {
      setError(
        'Debe seleccionar una región.'
      );

      return;
    }

    // COMUNA
    if (!datos.comuna) {
      setError(
        'Debe seleccionar una comuna.'
      );

      return;
    }

    if (
      !comunasDisponibles.includes(
        datos.comuna
      )
    ) {
      setError(
        'La comuna seleccionada no pertenece a la región indicada.'
      );

      return;
    }

    // DIRECCIÓN
    if (!datos.direccion.trim()) {
      setError(
        'La dirección es obligatoria.'
      );

      return;
    }

    // REGISTRAR CON AUTHSERVICE
    const resultado =
      registrarUsuario({
        run: datos.run
          .replace(/\./g, '')
          .replace(/-/g, '')
          .toUpperCase()
          .trim(),

        nombre:
          datos.nombre.trim(),

        apellido:
          datos.apellido.trim(),

        correo:
          correoLimpio,

        password:
          datos.password,

        telefono:
          datos.telefono.trim(),

        fechaNacimiento:
          datos.fechaNacimiento,

        region:
          datos.region,

        comuna:
          datos.comuna,

        direccion:
          datos.direccion.trim(),

        rol:
          'cliente',

        tipoUsuario:
          'Cliente'
      });

    if (!resultado.exito) {
      setError(
        resultado.mensaje
      );

      return;
    }

    setExito(
      'Usuario registrado correctamente. Ahora puedes iniciar sesión.'
    );

    setDatos({
      run: '',
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      confirmarPassword: '',
      telefono: '',
      fechaNacimiento: '',
      region: '',
      comuna: '',
      direccion: ''
    });

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <Container className="py-5">

      <Row className="justify-content-center">

        <Col
          xs={12}
          md={10}
          lg={8}
        >

          <Card className="shadow-sm">

            <Card.Body className="p-4">

              <div className="text-center mb-4">

                <h1 className="h3">
                  Crear cuenta
                </h1>

                <p className="text-muted">
                  Regístrate en AromaEsencial.
                </p>

              </div>

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

                <Row className="g-3">

                  {/* RUN */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        RUN *
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="run"
                        value={datos.run}
                        onChange={handleChange}
                        placeholder="12345678K"
                        required
                      />

                    </Form.Group>
                  </Col>

                  {/* NOMBRE */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Nombre *
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="nombre"
                        value={datos.nombre}
                        onChange={handleChange}
                        required
                      />

                    </Form.Group>
                  </Col>

                  {/* APELLIDO */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Apellido *
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="apellido"
                        value={datos.apellido}
                        onChange={handleChange}
                        required
                      />

                    </Form.Group>
                  </Col>

                  {/* CORREO */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Correo electrónico *
                      </Form.Label>

                      <Form.Control
                        type="email"
                        name="correo"
                        value={datos.correo}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="ejemplo@gmail.com"
                        required
                      />

                      <Form.Text className="text-muted">
                        Se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.
                      </Form.Text>

                    </Form.Group>
                  </Col>

                  {/* CONTRASEÑA */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Contraseña *
                      </Form.Label>

                      <Form.Control
                        type="password"
                        name="password"
                        value={datos.password}
                        onChange={handleChange}
                        minLength={4}
                        maxLength={10}
                        required
                      />

                      <Form.Text className="text-muted">
                        Entre 4 y 10 caracteres.
                      </Form.Text>

                    </Form.Group>
                  </Col>

                  {/* CONFIRMAR CONTRASEÑA */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Confirmar contraseña *
                      </Form.Label>

                      <Form.Control
                        type="password"
                        name="confirmarPassword"
                        value={datos.confirmarPassword}
                        onChange={handleChange}
                        minLength={4}
                        maxLength={10}
                        required
                      />

                    </Form.Group>
                  </Col>

                  {/* TELÉFONO */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Teléfono
                      </Form.Label>

                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={datos.telefono}
                        onChange={handleChange}
                        maxLength={15}
                        placeholder="+56 9 1234 5678"
                      />

                      <Form.Text className="text-muted">
                        Opcional.
                      </Form.Text>

                    </Form.Group>
                  </Col>

                  {/* FECHA NACIMIENTO */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Fecha de nacimiento
                      </Form.Label>

                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={datos.fechaNacimiento}
                        onChange={handleChange}
                      />

                      <Form.Text className="text-muted">
                        Opcional.
                      </Form.Text>

                    </Form.Group>
                  </Col>

                  {/* REGIÓN */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Región *
                      </Form.Label>

                      <Form.Select
                        name="region"
                        value={datos.region}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Seleccione una región
                        </option>

                        {Object.keys(
                          regionesComunas
                        ).map((region) => (

                          <option
                            key={region}
                            value={region}
                          >
                            {region}
                          </option>

                        ))}

                      </Form.Select>

                    </Form.Group>
                  </Col>

                  {/* COMUNA */}
                  <Col md={6}>
                    <Form.Group>

                      <Form.Label>
                        Comuna *
                      </Form.Label>

                      <Form.Select
                        name="comuna"
                        value={
                          comunasDisponibles.includes(
                            datos.comuna
                          )
                            ? datos.comuna
                            : ''
                        }
                        onChange={handleChange}
                        disabled={
                          comunasDisponibles.length === 0
                        }
                        required
                      >

                        <option value="">
                          {comunasDisponibles.length === 0
                            ? 'Primero seleccione una región'
                            : 'Seleccione una comuna'}
                        </option>

                        {comunasDisponibles.map(
                          (comuna) => (

                            <option
                              key={comuna}
                              value={comuna}
                            >
                              {comuna}
                            </option>

                          )
                        )}

                      </Form.Select>

                    </Form.Group>
                  </Col>

                  {/* DIRECCIÓN */}
                  <Col xs={12}>
                    <Form.Group>

                      <Form.Label>
                        Dirección *
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="direccion"
                        value={datos.direccion}
                        onChange={handleChange}
                        placeholder="Calle, número, villa o población"
                        required
                      />

                    </Form.Group>
                  </Col>

                </Row>

                <Button
                  type="submit"
                  variant="dark"
                  className="w-100 mt-4"
                >
                  Crear cuenta
                </Button>

              </Form>

              <hr />

              <p className="text-center mb-0">

                ¿Ya tienes una cuenta?{' '}

                <Link to="/login">
                  Iniciar sesión
                </Link>

              </p>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
}

export default Registro;