import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from '../../atoms/Button';
import CampoFormulario from '../../molecules/admin/CampoFormulario';
import { validarProducto } from '../../../utils/validarProducto';
import { CATEGORIAS, IMAGEN_POR_DEFECTO } from '../../../utils/adminFormato';

const VACIO = { codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockCritico: '5', categoria: '', imagen: '', oferta: false };

// Formulario reutilizado en "Nuevo" y "Editar". `codigosEnUso` evita códigos duplicados.
function ProductoForm({ inicial, codigosEnUso = [], onSubmit, onCancel, submitLabel = 'Guardar producto' }) {
  const [valores, setValores] = useState({ ...VACIO, ...(inicial || {}) });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (ev) => {
    const valor = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
    const siguiente = { ...valores, [campo]: valor };
    setValores(siguiente);
    if (errores[campo]) setErrores({ ...errores, [campo]: validarProducto(siguiente, codigosEnUso)[campo] });
  };

  const enviar = (ev) => {
    ev.preventDefault();
    const errs = validarProducto(valores, codigosEnUso);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      codigo: valores.codigo.trim(),
      nombre: valores.nombre.trim(),
      descripcion: (valores.descripcion || '').trim(),
      categoria: valores.categoria,
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      stockCritico: Number(valores.stockCritico),
      imagen: (valores.imagen || '').trim() || IMAGEN_POR_DEFECTO,
      oferta: !!valores.oferta,
    });
  };

  const campo = (id, etiqueta, extra = {}) => (
    <CampoFormulario id={id} etiqueta={etiqueta} valor={valores[id]} onCambio={cambiar(id)} error={errores[id]} {...extra} />
  );

  return (
    <form onSubmit={enviar} noValidate aria-label="Formulario de producto">
      <Row>
        <Col md={6}>{campo('codigo', 'Código')}</Col>
        <Col md={6}>{campo('nombre', 'Nombre')}</Col>
      </Row>
      {campo('descripcion', 'Descripción', { tipo: 'textarea', rows: 3 })}
      <Row>
        <Col md={4}>{campo('precio', 'Precio (CLP)', { tipo: 'number', min: 0 })}</Col>
        <Col md={4}>{campo('stock', 'Stock', { tipo: 'number', min: 0 })}</Col>
        <Col md={4}>{campo('stockCritico', 'Stock crítico', { tipo: 'number', min: 0 })}</Col>
      </Row>
      <Row>
        <Col md={6}>{campo('categoria', 'Categoría', { tipo: 'select', opciones: CATEGORIAS, placeholder: 'Selecciona una categoría' })}</Col>
        <Col md={6}>{campo('imagen', 'URL de imagen (opcional)')}</Col>
      </Row>
      {campo('oferta', 'Mostrar en Ofertas', { tipo: 'switch' })}
      <div className="d-flex gap-2 justify-content-end">
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export default ProductoForm;
