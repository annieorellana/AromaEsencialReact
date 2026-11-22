
import React from 'react';

// ESTILOS CORPORATIVOS AROMAESENCIAL
import './App.css';

import {
  Container
} from 'react-bootstrap';

import {
  Routes,
  Route,
  Link
} from 'react-router-dom';

// ==========================================
// PAGINAS PUBLICAS
// ==========================================

import Home from './pages/public/Home';
import Productos from './pages/public/Productos';
import ProductoDetalle from './pages/public/ProductoDetalle';
import Categorias from './pages/public/Categorias';
import CategoriaDetalle from './pages/public/CategoriaDetalle';
import Ofertas from './pages/public/Ofertas';
import Nosotros from './pages/public/Nosotros';
import Blogs from './pages/public/Blogs';
import BlogDetalle from './pages/public/BlogDetalle';
import Contacto from './pages/public/Contacto';
import Carrito from './pages/public/Carrito';
import Checkout from './pages/public/Checkout';
import CompraExitosa from './pages/public/CompraExitosa';
import CompraError from './pages/public/CompraError';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';

// ==========================================
// MODULO ADMINISTRADOR
// ==========================================

import {
  adminRoutes
} from './routes/AdminRoutes';

// ==========================================
// MODULO VENDEDOR
// ==========================================

import {
  sellerRoutes
} from './routes/SellerRoutes';

// ==========================================
// TEMPLATE PRINCIPAL
// ==========================================

import MainLayout
  from './components/templates/MainLayout';

// ==========================================
// SERVICIO DE ORDENES
// ==========================================

import {
  crearOrden
} from './services/orderService';

// ==========================================
// HOOK DEL CARRITO
// ==========================================

import useCart
  from './hooks/useCart';

// ==========================================
// COMPONENTE PRINCIPAL APP
// ==========================================

function App() {

  // ========================================
  // FUNCIONES DEL CARRITO
  // ========================================

  const {
    carrito,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarProducto,
    limpiarCarrito,
    cantidadCarrito
  } = useCart();

  // ========================================
  // FINALIZAR COMPRA CON SPRING BOOT
  // ========================================

  const finalizarCompra = async (orden) => {

    // Crear la boleta mediante orderService.js.
    // El backend realiza los cálculos definitivos,
    // valida el stock y registra la compra en MySQL.

    const nuevaOrden = await crearOrden(orden);

    // Verificar que Spring Boot confirmó
    // la creación de una boleta real.

    if (!nuevaOrden?.id) {
      throw new Error(
        'No fue posible registrar la compra en el servidor.'
      );
    }

    // Vaciar el carrito solamente después
    // de recibir la boleta creada correctamente.

    limpiarCarrito();

    // Devolver los datos reales de la boleta
    // para mostrarlos en CompraExitosa.

    return nuevaOrden;
  };

  // ========================================
  // RUTAS DE LA APLICACION
  // ========================================

  return (

    <MainLayout
      cantidadCarrito={
        cantidadCarrito
      }
    >

      <Routes>

        {/* =================================
            PAGINA PRINCIPAL
           ================================= */}

        <Route
          path="/"
          element={
            <Home />
          }
        />

        {/* =================================
            PRODUCTOS
           ================================= */}

        <Route
          path="/productos"
          element={
            <Productos
              onAgregar={
                agregarAlCarrito
              }
            />
          }
        />

        <Route
          path="/productos/:id"
          element={
            <ProductoDetalle
              onAgregar={
                agregarAlCarrito
              }
            />
          }
        />

        {/* =================================
            CATEGORIAS
           ================================= */}

        <Route
          path="/categorias"
          element={
            <Categorias />
          }
        />

        <Route
          path="/categorias/:categoria"
          element={
            <CategoriaDetalle
              onAgregar={
                agregarAlCarrito
              }
            />
          }
        />

        {/* =================================
            OFERTAS
           ================================= */}

        <Route
          path="/ofertas"
          element={
            <Ofertas
              onAgregar={
                agregarAlCarrito
              }
            />
          }
        />

        {/* =================================
            NOSOTROS
           ================================= */}

        <Route
          path="/nosotros"
          element={
            <Nosotros />
          }
        />

        {/* =================================
            BLOG
           ================================= */}

        <Route
          path="/blogs"
          element={
            <Blogs />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <BlogDetalle />
          }
        />

        {/* =================================
            CONTACTO
           ================================= */}

        <Route
          path="/contacto"
          element={
            <Contacto />
          }
        />

        {/* =================================
            CARRITO DE COMPRAS
           ================================= */}

        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={
                carrito
              }
              cambiarCantidad={
                cambiarCantidad
              }
              eliminarProducto={
                eliminarProducto
              }
            />
          }
        />

        {/* =================================
            PROCESO DE COMPRA
           ================================= */}

        <Route
          path="/checkout"
          element={
            <Checkout
              carrito={
                carrito
              }
              finalizarCompra={
                finalizarCompra
              }
            />
          }
        />

        {/* =================================
            RESULTADOS DE LA COMPRA
           ================================= */}

        <Route
          path="/compra-exitosa"
          element={
            <CompraExitosa />
          }
        />

        <Route
          path="/compra-error"
          element={
            <CompraError />
          }
        />

        {/* =================================
            AUTENTICACION
           ================================= */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/registro"
          element={
            <Registro />
          }
        />

        {/* =================================
            MODULO ADMINISTRADOR
           ================================= */}

        {adminRoutes}

        {/* =================================
            MODULO VENDEDOR
           ================================= */}

        {sellerRoutes}

        {/* =================================
            PAGINA NO ENCONTRADA
           ================================= */}

        <Route
          path="*"
          element={
            <Container
              className="text-center py-5"
            >

              <h2>
                Página no encontrada
              </h2>

              <p>
                La página que buscas no existe.
              </p>

              <Link to="/">
                Volver al inicio
              </Link>

            </Container>
          }
        />

      </Routes>

    </MainLayout>

  );
}

export default App;
