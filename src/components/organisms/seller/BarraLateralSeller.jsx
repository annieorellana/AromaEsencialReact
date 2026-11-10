import React from 'react';

import {
  NavLink,
  useNavigate
} from 'react-router-dom';

import {
  Nav,
  Button
} from 'react-bootstrap';

import useAuth
  from '../../../hooks/useAuth';

function BarraLateralSeller({
  enlaces
}) {

  const navigate =
    useNavigate();

  const {
    logout
  } = useAuth();

  const cerrarSesion = () => {

    if (
      typeof logout === 'function'
    ) {
      logout();
    }

    navigate('/');
  };

  return (
    <aside
      className="bg-light border rounded p-3 mb-3 mb-md-0"
    >

      <p className="text-uppercase text-muted small fw-semibold mb-2">
        Vendedor
      </p>

      <Nav
        className="flex-row flex-md-column gap-1"
        as="nav"
        aria-label="Navegación vendedor"
      >

        {enlaces.map(
          ({
            to,
            texto,
            end
          }) => (

            <NavLink
              key={to}
              to={to}
              end={end}
              className={({
                isActive
              }) =>
                `nav-link px-2 rounded ${
                  isActive
                    ? 'active bg-dark text-white'
                    : 'text-dark'
                }`
              }
            >
              {texto}
            </NavLink>

          )
        )}

      </Nav>

      <hr />

      <Button
        variant="outline-secondary"
        size="sm"
        className="w-100"
        onClick={
          cerrarSesion
        }
      >
        Cerrar sesión
      </Button>

    </aside>
  );
}

export default BarraLateralSeller;