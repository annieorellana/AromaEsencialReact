import React from 'react';

import {
  render,
  screen,
  fireEvent
} from '@testing-library/react';

import {
  MemoryRouter
} from 'react-router-dom';

import ProductCard
  from '../components/molecules/ProductCard';

import Button
  from '../components/atoms/Button';

describe(
  'Pruebas de Componentes: ProductCard y Button',
  () => {

    // Test 1: ProductCard - renderizado
    it(
      '1. ProductCard - debe renderizar correctamente nombre, precio y categoría',
      () => {

        const productoSimulado = {
          id: 'dark-cedar',
          nombre: 'Dark Cedar',
          precio: 96000,
          categoria: 'Hombre',
          descripcion: 'Fragancia masculina.',
          imagen:
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3C/svg%3E',
          stock: 10,
          oferta: false
        };

        const onAgregarSpy =
          jasmine.createSpy(
            'onAgregar'
          );

        render(
          <MemoryRouter>
            <ProductCard
              producto={productoSimulado}
              onAgregar={onAgregarSpy}
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
            'Hombre'
          )
        ).toBeDefined();

        expect(
          screen.getByText(
            /\$96\.000/
          )
        ).toBeDefined();
      }
    );

    // Test 4: Button - props
    it(
      '4. Button - debe recibir correctamente children, variant y type',
      () => {

        render(
          <Button
            variant="primary"
            type="submit"
          >
            Añadir al Carrito
          </Button>
        );

        const boton =
          screen.getByRole(
            'button',
            {
              name:
                /añadir al carrito/i
            }
          );

        expect(
          boton
        ).toBeDefined();

        expect(
          boton.getAttribute(
            'type'
          )
        ).toBe('submit');

        expect(
          boton.classList.contains(
            'btn-primary'
          )
        ).toBeTrue();
      }
    );

    // Test 5: Button - evento
    it(
      '5. Button - debe ejecutar la función onClick mediante un Spy de Jasmine',
      () => {

        const handleClickSpy =
          jasmine.createSpy(
            'onClickHandler'
          );

        render(
          <Button
            onClick={
              handleClickSpy
            }
          >
            Comprar
          </Button>
        );

        const boton =
          screen.getByRole(
            'button',
            {
              name: /comprar/i
            }
          );

        fireEvent.click(
          boton
        );

        expect(
          handleClickSpy
        ).toHaveBeenCalled();

        expect(
          handleClickSpy
            .calls
            .count()
        ).toBe(1);
      }
    );

  }
);