
import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Row,
  Col,
  Alert,
  Spinner
} from 'react-bootstrap';

import Button from '../../atoms/Button';

import CampoFormulario
  from '../../molecules/admin/CampoFormulario';

import {
  validarProducto
} from '../../../utils/validarProducto';

import {
  IMAGEN_POR_DEFECTO
} from '../../../utils/adminFormato';

import {
  listarCategorias
} from '../../../services/CatalogoApi';

// ==========================================
// AROMAESENCIAL
// FORMULARIO DE PRODUCTOS
// CREAR Y EDITAR
// ==========================================

const VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  stockCritico: '5',
  categoria: '',
  imagen: '',
  oferta: false
};

// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(valor) {
  return String(valor ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// ==========================================
// PREPARAR DATOS INICIALES
// ==========================================

function prepararInicial(inicial) {
  return {
    ...VACIO,
    ...(inicial || {}),
    categoria:
      inicial?.categoria ||
      inicial?.categoriaNombre ||
      ''
  };
}

// ==========================================
// COMPONENTE
// ==========================================

function ProductoForm({
  inicial,
  codigosEnUso = [],
  onSubmit,
  onCancel,
  submitLabel = 'Guardar producto'
}) {

  // ========================================
  // DATOS DEL FORMULARIO
  // ========================================

  const [valores, setValores] = useState(
    () => prepararInicial(inicial)
  );

  const [errores, setErrores] = useState({});

  const [errorEnvio, setErrorEnvio] =
    useState('');

  const [enviando, setEnviando] =
    useState(false);

  const enviandoRef = useRef(false);

  // ========================================
  // CATEGORÍAS DESDE MYSQL
  // ========================================

  const [categorias, setCategorias] =
    useState([]);

  const [
    cargandoCategorias,
    setCargandoCategorias
  ] = useState(true);

  const [
    errorCategorias,
    setErrorCategorias
  ] = useState('');

  const [intentoCarga, setIntentoCarga] =
    useState(0);

  // ========================================
  // CONSULTAR CATEGORÍAS REALES
  // ========================================

  useEffect(() => {

    let activo = true;

    const cargarCategorias = async () => {

      setCargandoCategorias(true);
      setErrorCategorias('');

      try {

        const resultado =
          await listarCategorias();

        if (!Array.isArray(resultado)) {
          throw new Error(
            'El servidor no devolvió una lista válida de categorías.'
          );
        }

        const validas = resultado.filter(
          (categoria) =>
            Number.isSafeInteger(
              Number(categoria.id)
            ) &&
            Number(categoria.id) > 0 &&
            String(categoria.nombre || '').trim()
        );

        if (!activo) {
          return;
        }

        setCategorias(validas);

        if (validas.length === 0) {
          setErrorCategorias(
            'No hay categorías registradas. Crea una categoría antes de guardar productos.'
          );
        }

      } catch (error) {

        if (!activo) {
          return;
        }

        setCategorias([]);

        setErrorCategorias(
          error.message ||
          'No fue posible cargar las categorías.'
        );

      } finally {

        if (activo) {
          setCargandoCategorias(false);
        }

      }
    };

    cargarCategorias();

    return () => {
      activo = false;
    };

  }, [intentoCarga]);

  // ========================================
  // RECUPERAR CATEGORÍA DEL PRODUCTO
  // ========================================

  // Al editar, Spring Boot puede entregar
  // categoriaId y categoriaNombre.
  //
  // Seleccionamos la categoría real de MySQL
  // cuando termina de cargarse el listado.

  useEffect(() => {

    if (
      !inicial?.categoriaId ||
      categorias.length === 0
    ) {
      return;
    }

    const encontrada = categorias.find(
      (categoria) =>
        Number(categoria.id) ===
        Number(inicial.categoriaId)
    );

    if (!encontrada) {
      return;
    }

    setValores((anterior) => {

      if (
        anterior.categoria === encontrada.nombre
      ) {
        return anterior;
      }

      // No reemplazar una categoría que
      // el usuario ya cambió manualmente.
      const categoriaInicial =
        inicial.categoria ||
        inicial.categoriaNombre ||
        '';

      if (
        anterior.categoria &&
        normalizarTexto(anterior.categoria) !==
        normalizarTexto(categoriaInicial)
      ) {
        return anterior;
      }

      return {
        ...anterior,
        categoria: encontrada.nombre
      };
    });

  }, [
    categorias,
    inicial?.categoriaId,
    inicial?.categoria,
    inicial?.categoriaNombre
  ]);

  // ========================================
  // CAMBIAR CAMPOS
  // ========================================

  const cambiar = (campo) => (evento) => {

    const valor =
      evento.target.type === 'checkbox'
        ? evento.target.checked
        : evento.target.value;

    const siguientesValores = {
      ...valores,
      [campo]: valor
    };

    setValores(siguientesValores);
    setErrorEnvio('');

    // Actualizar los errores del campo
    // mientras el usuario lo corrige.

    if (errores[campo]) {

      const erroresActualizados =
        validarProducto(
          siguientesValores,
          codigosEnUso
        );

      setErrores((anteriores) => ({
        ...anteriores,
        [campo]:
          erroresActualizados[campo] || ''
      }));
    }
  };

  // ========================================
  // VALIDAR PRODUCTO
  // ========================================

  const validarFormulario = () => {

    const nuevosErrores = validarProducto(
      valores,
      codigosEnUso
    );

    const codigo = String(
      valores.codigo || ''
    ).trim();

    const nombre = String(
      valores.nombre || ''
    ).trim();

    const precio = Number(valores.precio);
    const stock = Number(valores.stock);

    const stockCritico = Number(
      valores.stockCritico
    );

    const imagen = String(
      valores.imagen || ''
    ).trim();

    // ======================================
    // REGLAS DEL BACKEND
    // ======================================

    if (codigo.length > 20) {
      nuevosErrores.codigo =
        'El código no puede superar los 20 caracteres.';
    }

    if (nombre.length > 120) {
      nuevosErrores.nombre =
        'El nombre no puede superar los 120 caracteres.';
    }

    if (
      !Number.isSafeInteger(precio) ||
      precio <= 0
    ) {
      nuevosErrores.precio =
        'El precio debe ser un entero mayor a cero.';
    }

    if (
      !Number.isSafeInteger(stock) ||
      stock < 0
    ) {
      nuevosErrores.stock =
        'El stock debe ser un entero mayor o igual a cero.';
    }

    if (
      !Number.isSafeInteger(stockCritico) ||
      stockCritico < 0
    ) {
      nuevosErrores.stockCritico =
        'El stock crítico debe ser un entero mayor o igual a cero.';
    }

    if (imagen.length > 500) {
      nuevosErrores.imagen =
        'La URL de la imagen no puede superar los 500 caracteres.';
    }

    // ======================================
    // VALIDAR CATEGORÍA REAL
    // ======================================

    const categoriaEncontrada = categorias.find(
      (categoria) =>
        normalizarTexto(categoria.nombre) ===
        normalizarTexto(valores.categoria)
    );

    if (!categoriaEncontrada) {
      nuevosErrores.categoria =
        'Selecciona una categoría registrada en MySQL.';
    }

    return {
      errores: nuevosErrores,
      categoriaEncontrada
    };
  };

  // ========================================
  // ENVIAR FORMULARIO
  // ========================================

  const enviar = async (evento) => {

    evento.preventDefault();

    if (enviandoRef.current) {
      return;
    }

    setErrorEnvio('');

    if (
      cargandoCategorias ||
      categorias.length === 0
    ) {
      setErrorEnvio(
        'Debes esperar a que se carguen las categorías.'
      );
      return;
    }

    const resultado = validarFormulario();

    setErrores(resultado.errores);

    if (
      Object.values(resultado.errores)
        .some(Boolean)
    ) {
      return;
    }

    if (typeof onSubmit !== 'function') {
      setErrorEnvio(
        'No está configurada la acción para guardar el producto.'
      );
      return;
    }

    // ======================================
    // PREPARAR DATOS PARA SPRING BOOT
    // ======================================

    const datosProducto = {

      codigo:
        valores.codigo.trim(),

      nombre:
        valores.nombre.trim(),

      descripcion:
        String(valores.descripcion || '')
          .trim(),

      precio:
        Number(valores.precio),

      stock:
        Number(valores.stock),

      stockCritico:
        Number(valores.stockCritico),

      // Compatibilidad con las pantallas
      // actuales de Crear y Editar.
      categoria:
        resultado.categoriaEncontrada.nombre,

      // Identificador real de MySQL.
      categoriaId:
        Number(resultado.categoriaEncontrada.id),

      imagen:
        String(valores.imagen || '')
          .trim() ||
        IMAGEN_POR_DEFECTO,

      oferta:
        Boolean(valores.oferta)
    };

    // ======================================
    // GUARDAR SIN DUPLICAR SOLICITUDES
    // ======================================

    enviandoRef.current = true;
    setEnviando(true);

    try {

      await onSubmit(datosProducto);

    } catch (error) {

      console.error(
        'Error al guardar producto:',
        error
      );

      setErrorEnvio(
        error.message ||
        'No fue posible guardar el producto.'
      );

    } finally {

      enviandoRef.current = false;
      setEnviando(false);

    }
  };

  // ========================================
  // COMPONENTE DE CAMPO
  // ========================================

  const campo = (
    id,
    etiqueta,
    extra = {}
  ) => (

    <CampoFormulario

      id={id}
      etiqueta={etiqueta}

      valor={valores[id]}
      onCambio={cambiar(id)}

      error={errores[id]}

      disabled={enviando}

      {...extra}

    />

  );

  // ========================================
  // INTERFAZ DEL FORMULARIO
  // ========================================

  return (

    <form
      onSubmit={enviar}
      noValidate
      aria-label="Formulario de producto"
    >

      {/* =================================
          ERRORES GENERALES
         ================================= */}

      {errorEnvio && (

        <Alert variant="danger">
          {errorEnvio}
        </Alert>

      )}

      {/* =================================
          CARGANDO CATEGORÍAS
         ================================= */}

      {cargandoCategorias && (

        <Alert variant="info">

          <Spinner
            animation="border"
            size="sm"
            className="me-2"
          />

          Cargando categorías desde MySQL...

        </Alert>

      )}

      {/* =================================
          ERROR DE CATEGORÍAS
         ================================= */}

      {errorCategorias && (

        <Alert variant="warning">

          {errorCategorias}

          <div className="mt-2">

            <Button
              type="button"
              variant="outline-secondary"
              onClick={() =>
                setIntentoCarga(
                  (anterior) => anterior + 1
                )
              }
            >
              Reintentar carga
            </Button>

          </div>

        </Alert>

      )}

      {/* =================================
          CÓDIGO Y NOMBRE
         ================================= */}

      <Row>

        <Col md={6}>

          {campo(
            'codigo',
            'Código',
            {
              maxLength: 20
            }
          )}

        </Col>

        <Col md={6}>

          {campo(
            'nombre',
            'Nombre',
            {
              maxLength: 120
            }
          )}

        </Col>

      </Row>

      {/* =================================
          DESCRIPCIÓN
         ================================= */}

      {campo(
        'descripcion',
        'Descripción',
        {
          tipo: 'textarea',
          rows: 3,
          maxLength: 500
        }
      )}

      {/* =================================
          PRECIO Y STOCK
         ================================= */}

      <Row>

        <Col md={4}>

          {campo(
            'precio',
            'Precio (CLP)',
            {
              tipo: 'number',
              min: 1,
              step: 1
            }
          )}

        </Col>

        <Col md={4}>

          {campo(
            'stock',
            'Stock',
            {
              tipo: 'number',
              min: 0,
              step: 1
            }
          )}

        </Col>

        <Col md={4}>

          {campo(
            'stockCritico',
            'Stock crítico',
            {
              tipo: 'number',
              min: 0,
              step: 1
            }
          )}

        </Col>

      </Row>

      {/* =================================
          CATEGORÍA DESDE MYSQL
         ================================= */}

      <Row>

        <Col md={6}>

          {campo(
            'categoria',
            'Categoría',
            {
              tipo: 'select',

              opciones: categorias.map(
                (categoria) =>
                  categoria.nombre
              ),

              placeholder:
                cargandoCategorias
                  ? 'Cargando categorías...'
                  : 'Selecciona una categoría',

              disabled:
                enviando ||
                cargandoCategorias ||
                categorias.length === 0
            }
          )}

        </Col>

        <Col md={6}>

          {campo(
            'imagen',
            'URL de imagen (opcional)',
            {
              maxLength: 500
            }
          )}

        </Col>

      </Row>

      {/* =================================
          PRODUCTO EN OFERTA
         ================================= */}

      {campo(
        'oferta',
        'Mostrar en Ofertas',
        {
          tipo: 'switch'
        }
      )}

      {/* =================================
          BOTONES
         ================================= */}

      <div className="d-flex gap-2 justify-content-end">

        <Button
          type="button"
          variant="outline-secondary"
          onClick={onCancel}
          disabled={enviando}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={
            enviando ||
            cargandoCategorias ||
            categorias.length === 0
          }
        >

          {enviando
            ? 'Guardando...'
            : submitLabel}

        </Button>

      </div>

    </form>

  );
}

export default ProductoForm;
