import React from 'react';

import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge
} from 'react-bootstrap';

import {
  Link,
  useNavigate
} from 'react-router-dom';

function NavbarPrincipal({
  usuario,
  autenticado,
  rol,
  logout,
  onCerrarSesion,
  cantidadCarrito = 0,
  totalItems
}) {

  const navigate =
    useNavigate();

  const haySesion =
    autenticado ??
    Boolean(usuario);

  const rolActual =
    rol ||
    usuario?.rol;

  const cantidad =
    totalItems ??
    cantidadCarrito;

  const esVendedor =
    rolActual === 'vendedor';

  const esAdmin =
    rolActual === 'admin';

  // ========================================
  // CERRAR SESIÓN
  // ========================================

  const manejarCerrarSesion = () => {

    if (
      typeof onCerrarSesion ===
      'function'
    ) {

      onCerrarSesion();

    } else if (
      typeof logout ===
      'function'
    ) {

      logout();

    }

    navigate('/');
  };

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
              USUARIO / CARRITO
             ================================= */}

          <Nav className="align-items-lg-center">

            {/* CARRITO SOLO PARA NO VENDEDORES */}

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

            {/* SIN SESIÓN */}

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

            {/* CON SESIÓN */}

            {haySesion && (

              <>

                <Navbar.Text className="ms-lg-2">

                  Hola,{' '}

                  {usuario?.nombre ||
                    'Usuario'}

                </Navbar.Text>

                {/* ADMINISTRADOR */}

                {esAdmin && (

                  <Nav.Link
                    as={Link}
                    to="/admin"
                  >
                    Administración
                  </Nav.Link>

                )}

                {/* VENDEDOR */}

                {esVendedor && (

                  <Nav.Link
                    as={Link}
                    to="/vendedor/productos"
                  >
                    Panel vendedor
                  </Nav.Link>

                )}

                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ms-lg-2 mt-2 mt-lg-0"
                  onClick={
                    manejarCerrarSesion
                  }
                >
                  Cerrar sesión
                </Button>

              </>

            )}

          </Nav>

        </Navbar.Collapse>

      </Container>

    </Navbar>

  );
}

export default NavbarPrincipal;