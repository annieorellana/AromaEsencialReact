import React from 'react';
import { Table } from 'react-bootstrap';

// Tabla Bootstrap con scroll horizontal en móvil y fila de "sin datos".
function TablaResponsiva({ encabezados, vacio = false, mensajeVacio = 'No hay datos para mostrar.', hover = true, children }) {
  return (
    <Table responsive hover={hover} className="align-middle bg-white border">
      <thead>
        <tr>{encabezados.map((h, i) => { const t = typeof h === 'string' ? { texto: h } : h; return <th key={i} className={t.className}>{t.texto}</th>; })}</tr>
      </thead>
      <tbody>
        {children}
        {vacio && <tr><td colSpan={encabezados.length} className="text-center text-muted py-4">{mensajeVacio}</td></tr>}
      </tbody>
    </Table>
  );
}

export default TablaResponsiva;
