import React from 'react';

// Encabezado común de cada vista: título, descripción opcional y acciones.
function PlantillaPagina({ titulo, descripcion, acciones, children }) {
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0">{titulo}</h1>
          {descripcion && <p className="text-muted mb-0">{descripcion}</p>}
        </div>
        {acciones}
      </div>
      {children}
    </>
  );
}

export default PlantillaPagina;
