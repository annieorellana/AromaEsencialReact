import React from 'react';

// Par etiqueta/valor para resúmenes (<dl class="row">).
function FilaDato({ etiqueta, valor, destacado = false }) {
  const extra = destacado ? 'border-top pt-2' : '';
  return (
    <>
      <dt className={`col-6 ${extra}`.trim()}>{etiqueta}</dt>
      <dd className={`col-6 text-end ${destacado ? 'fw-bold' : ''} ${extra}`.trim()}>{valor}</dd>
    </>
  );
}

export default FilaDato;
