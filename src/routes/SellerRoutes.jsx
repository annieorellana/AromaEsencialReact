import React from 'react';

import {
  Route
} from 'react-router-dom';

import RutaProtegida
  from '../components/RutaProtegida';

import PlantillaSeller
  from '../components/templates/seller/PlantillaSeller';

import SellerProductos
  from '../pages/seller/SellerProductos';

import SellerProductoDetalle
  from '../pages/seller/SellerProductoDetalle';

import SellerOrdenes
  from '../pages/seller/SellerOrdenes';

import SellerOrdenDetalle
  from '../pages/seller/SellerOrdenDetalle';

import {
  sembrarVendedorDemo
} from '../utils/sembrarVendedor';

// ==========================================
// CREAR VENDEDOR DEMO SI NO EXISTE
// ==========================================

sembrarVendedorDemo();

// ==========================================
// RUTAS DEL VENDEDOR
// ==========================================

export const sellerRoutes = (

  <Route
    path="/vendedor"
    element={
      <RutaProtegida
        rolesPermitidos={[
          'vendedor'
        ]}
      >
        <PlantillaSeller />
      </RutaProtegida>
    }
  >

    {/* =====================================
        PRODUCTOS
       ===================================== */}

    <Route
      index
      element={
        <SellerProductos />
      }
    />

    <Route
      path="productos"
      element={
        <SellerProductos />
      }
    />

    <Route
      path="productos/:id"
      element={
        <SellerProductoDetalle />
      }
    />

    {/* =====================================
        ÓRDENES
       ===================================== */}

    <Route
      path="ordenes"
      element={
        <SellerOrdenes />
      }
    />

    <Route
      path="ordenes/:id"
      element={
        <SellerOrdenDetalle />
      }
    />

  </Route>

);