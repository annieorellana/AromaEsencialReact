import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

function BarraLateralAdmin({ enlaces }) {
  return (
    <aside className="bg-light border rounded p-3 mb-3 mb-md-0">
      <p className="text-uppercase text-muted small fw-semibold mb-2">Administración</p>
      <Nav className="flex-row flex-md-column gap-1" as="nav" aria-label="Navegación administrador">
        {enlaces.map(({ to, texto, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link px-2 rounded ${isActive ? 'active bg-dark text-white' : 'text-dark'}`}>{texto}</NavLink>
        ))}
      </Nav>
      <hr />
      <Link to="/" className="btn btn-sm btn-outline-dark w-100">← Volver a la tienda</Link>
    </aside>
  );
}

export default BarraLateralAdmin;
