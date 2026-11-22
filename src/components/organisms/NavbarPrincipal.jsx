
import React, { useState } from 'react';

import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Alert
} from 'react-bootstrap';

import {
  Link,
  useNavigate
} from 'react-router-dom';

// ==========================================
// AROMAESENCIAL
// BARRA DE NAVEGACIÓN PRINCIPAL
// ==========================================

function NavbarPrincipal({
  usuario,
  autenticado,
  rol,
  logout,
  onCerrarSesion,
  cantidadCarrito = 0,
  totalItems
}) {

  const navigate = useNavigate();

  // ========================================
  // ESTADO DEL CIERRE DE SESIÓN
  // ========================================

  const [cerrandoSesion, setCerrandoSesion] =
    useState(false);

  const [errorSesion, setErrorSesion] =
    useState('');

  // ========================================
  // DATOS DE SESIÓN
  // ========================================

  const haySesion =
    autenticado ?? Boolean(usuario);

  const rolActual =
    rol || usuario?.rol;

  const cantidad =
    totalItems ?? cantidadCarrito;

  const esVendedor =
    rolActual === 'vendedor';

  const esAdmin =
    rolActual === 'admin';

  // ========================================
  // CERRAR SESIÓN CORRECTAMENTE
  // ========================================

  const manejarCerrarSesion = async () => {

    // Evitar varios cierres simultáneos.
    if (cerrandoSesion) {
      return;
    }

    setErrorSesion('');
    setCerrandoSesion(true);

    try {

      // Compatibilidad con ambas propiedades.
      const accionCerrarSesion =
        typeof onCerrarSesion === 'function'
          ? onCerrarSesion
          : logout;

      if (
        typeof accionCerrarSesion !==
        'function'
      ) {
        throw new Error(
          'No está configurada la función de cierre de sesión.'
        );
      }

      // Esperar a que authService complete
      // el cierre de sesión.
      //
      // Esto permite solicitar al backend
      // la revocación del refresh token
      // y limpiar la sesión de React.
      await accionCerrarSesion();

      // Redirigir cuando termine el proceso.
      navigate('/', {
        replace: true
      });

    } catch (error) {

      console.error(
        'Error al cerrar sesión:',
        error
      );

      setErrorSesion(
        'No fue posible completar el cierre de sesión.'
      );

    } finally {

      setCerrandoSesion(false);

    }
  };

  // ========================================
  // INTERFAZ DE NAVEGACIÓN
  // ========================================

  return (

    <Navbar
      expand="lg"
      className="navbar-aroma py-2"
    >

      <Container>

        {/* =================================
            LOGO
           ================================= */}

        <Navbar.Brand
          as={Link}
          to={
            esVendedor
              ? '/vendedor/productos'
              : '/'
          }
          className="marca-aroma"
        >

          <img
            src="/images/logo-aroma.png"
            alt="AromaEsencial Perfumería"
            className="logo-aroma"
          />

        </Navbar.Brand>

        {/* =================================
            BOTÓN MENÚ RESPONSIVO
           ================================= */}

        <Navbar.Toggle
          aria-controls="menu-aroma"
        />

        <Navbar.Collapse
          id="menu-aroma"
        >

          {/* =================================
              MENÚ VENDEDOR
             ================================= */}

          {esVendedor ? (

            <Nav className="me-auto">

              <Nav.Link
                as={Link}
                to="/vendedor/productos"
              >
                Productos
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/vendedor/ordenes"
              >
                Órdenes
              </Nav.Link>

            </Nav>

          ) : (

            /* ===============================
               MENÚ PÚBLICO
               =============================== */

            <Nav className="me-auto">

              <Nav.Link
                as={Link}
                to="/"
              >
                Inicio
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/productos"
              >
                Productos
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/categorias"
              >
                Categorías
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/ofertas"
              >
                Ofertas
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/nosotros"
              >
                Nosotros
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/blogs"
              >
                Blog
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/contacto"
              >
                Contacto
              </Nav.Link>

            </Nav>

          )}

          {/* =================================
              SESIÓN Y CARRITO
             ================================= */}

          <Nav className="align-items-lg-center">

            {/* =================================
                CARRITO
               ================================= */}

            {!esVendedor && (

              <Nav.Link
                as={Link}
                to="/carrito"
              >

                🛒 Carrito{' '}

                <Badge bg="secondary">
                  {cantidad}
                </Badge>

              </Nav.Link>

            )}

            {/* =================================
                USUARIO SIN SESIÓN
               ================================= */}

            {!haySesion && (

              <>

                <Nav.Link
                  as={Link}
                  to="/login"
                >
                  Iniciar sesión
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/registro"
                >
                  Registrarse
                </Nav.Link>

              </>

            )}

            {/* =================================
                USUARIO AUTENTICADO
               ================================= */}

            {haySesion && (

              <>

                <Navbar.Text className="ms-lg-2">

                  Hola,{' '}

                  {usuario?.nombre || 'Usuario'}

                </Navbar.Text>

                {/* =========================
                    ADMINISTRADOR
                   ========================= */}

                {esAdmin && (

                  <Nav.Link
                    as={Link}
                    to="/admin"
                  >
                    Administración
                  </Nav.Link>

                )}

                {/* =========================
                    VENDEDOR
                   ========================= */}

                {esVendedor && (

                  <Nav.Link
                    as={Link}
                    to="/vendedor/productos"
                  >
                    Panel vendedor
                  </Nav.Link>

                )}

                {/* =========================
                    CERRAR SESIÓN
                   ========================= */}

                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  className="ms-lg-2 mt-2 mt-lg-0"
                  onClick={manejarCerrarSesion}
                  disabled={cerrandoSesion}
                >

                  {cerrandoSesion
                    ? 'Cerrando sesión...'
                    : 'Cerrar sesión'}

                </Button>

              </>

            )}

            {/* =================================
                MENSAJES DE ERROR
               ================================= */}

            {errorSesion && (

              <Alert
                variant="danger"
                className="mb-0 ms-lg-2 mt-2"
              >
                {errorSesion}
              </Alert>

            )}

          </Nav>

        </Navbar.Collapse>

      </Container>

    </Navbar>
  );
}

export default NavbarPrincipal;
