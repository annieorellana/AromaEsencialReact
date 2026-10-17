import React from 'react';

import {
  render,
  screen
} from '@testing-library/react';

import {
  MemoryRouter
} from 'react-router-dom';

import ProductList
  from '../components/organisms/ProductList';

describe(
  'Pruebas de Componentes: ProductList',
  () => {

    // Test 2: ProductList - lista completa
    it(
      '2. ProductList - debe renderizar todos los productos recibidos',
      () => {

        const listaProductos = [
          {
            id: 'dark-cedar',
            nombre: 'Dark Cedar',
            precio: 96000,
            categoria: 'Hombre',
            imagen:
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3C/svg%3E',
            stock: 10
          },

          {
            id: 'velvet-bloom',
            nombre: 'Velvet Bloom',
            precio: 54000,
            categoria: 'Mujer',
            imagen:
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3C/svg%3E',
            stock: 12
          },

          {
            id: 'citrus-muse',
            nombre: 'Citrus Muse',
            precio: 49000,
            categoria: 'Unisex',
            imagen:
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3C/svg%3E',
            stock: 8
          }
        ];

        render(
          <MemoryRouter>
            <ProductList
              productos={
                listaProductos
              }
            />
          </MemoryRouter>
        );

        expect(
          screen.getByText(
            'Dark Cedar'
          )
        ).toBeDefined();

        expect(
          screen.getByText(
            'Velvet Bloom'
          )
        ).toBeDefined();

        expect(
          screen.getByText(
            'Citrus Muse'
          )
        ).toBeDefined();
      }
    );

    // Test 3: ProductList - lista vacía
    it(
      '3. ProductList - debe mostrar mensaje cuando no existen productos',
      () => {

        render(
          <MemoryRouter>
            <ProductList
              productos={[]}
            />
          </MemoryRouter>
        );

        const mensaje =
          screen.getByText(
            /no se encontraron productos disponibles/i
          );

        expect(
          mensaje
        ).toBeDefined();
      }
    );

  }
);