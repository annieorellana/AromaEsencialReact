Pruebas unitarias y cobertura de código

El proyecto **AromaEsencial** incorpora pruebas unitarias para verificar el funcionamiento de diferentes componentes y servicios de la aplicación React.

Herramientas utilizadas

- **Jasmine:** framework utilizado para definir y ejecutar los casos de prueba.
- **Karma:** herramienta encargada de ejecutar las pruebas en el navegador.
- **Chrome Headless:** navegador utilizado para ejecutar las pruebas automáticamente.
- **React Testing Library:** biblioteca utilizada para probar componentes React.

Ejecución de las pruebas

Para ejecutar las pruebas, abrir una terminal en la carpeta principal del proyecto y utilizar el siguiente comando:

```bash
npm test
```

En Windows, si PowerShell bloquea la ejecución de npm, utilizar en cmd:

```bash
npm test
```

### Resultados obtenidos

Las pruebas fueron ejecutadas el 18 de octubre de 2026, obteniendo los siguientes resultados:

| Indicador | Resultado |
|---|---|
| Pruebas ejecutadas | 10 |
| Pruebas aprobadas | 10 |
| Pruebas fallidas | 0 |
| Porcentaje de aprobación | 100 % |

**Resultado de la terminal:**

```text
Chrome Headless: Executed 10 of 10 SUCCESS
TOTAL: 10 SUCCESS
```

Cobertura de código

El reporte generado por Karma presentó los siguientes porcentajes:

| Tipo de cobertura | Porcentaje |
|---|---:|
| Sentencias (Statements) | 71,33 % |
| Ramas (Branches) | 66,66 % |
| Funciones (Functions) | 66,03 % |
| Líneas (Lines) | 71,91 % |

La cobertura de líneas alcanzó un **71,91 %** del código incluido en el reporte.

Áreas evaluadas

Las pruebas implementadas se encuentran organizadas en la carpeta `src/__tests__`:

- `componentesAtomsMolecules.test.js`: pruebas de componentes básicos y moléculas.
- `componentesOrganisms.test.js`: pruebas de componentes organismos.
- `cartServiceComplete.test.js`: pruebas de funcionalidades del carrito.
- `serviciosCore.test.js`: pruebas de autenticación y gestión de productos.

Propuestas de mejora

Aunque las 10 pruebas se ejecutaron correctamente, todavía existen partes del código que no están cubiertas.

Como futuras mejoras se propone ampliar las pruebas de operaciones CRUD de productos, validaciones de formularios, gestión de órdenes y escenarios alternativos de los servicios.

Conclusión

La implementación de pruebas unitarias permitió verificar las funcionalidades evaluadas de AromaEsencial y comprobar que los 10 casos ejecutados finalizaron correctamente.

Los resultados obtenidos representan un avance en el aseguramiento de la calidad del software y permiten identificar oportunidades para mejorar la cobertura en futuras versiones del proyecto.
