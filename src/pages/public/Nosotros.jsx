
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Imágenes del catálogo AromaEsencial
const perfumes = [
  {
    nombre: 'Dark Cedar',
    imagen: '/images/perfumes/dark-cedar.png'
  },
  {
    nombre: 'Urban Edge',
    imagen: '/images/perfumes/urban-edge.png'
  },
  {
    nombre: 'Classic Wood',
    imagen: '/images/perfumes/classic-wood.png'
  },
  {
    nombre: 'Silver Musk',
    imagen: '/images/perfumes/silver-mush.png'
  }
];

function Nosotros() {
  const equipo = [
    {
      nombre: 'Martina Aedo',
      cargo: 'Cofundadora & encargada de curaduría de fragancias.',
      imagen:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    },
    {
      nombre: 'Natalia Yáñez',
      cargo: 'Cofundadora & encargada de experiencia de cliente.',
      imagen:
        'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80'
    },
    {
      nombre: 'Anastasia Orellana',
      cargo: 'Cofundadora & encargada de operaciones y logística.',
      imagen:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    {
      nombre: 'Tamara',
      cargo: 'Cofundadora & encargada de comunicación y documentación.',
      imagen:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <Container className="py-5">

      {/* ENCABEZADO */}
      <div className="text-center mb-5">
        <p className="text-muted">Nuestra historia</p>
        <h1 className="fw-bold">Sobre AromaEsencial</h1>
      </div>

      {/* HISTORIA DE AROMAESENCIAL */}
      <Row className="align-items-center g-4 mb-5">

        <Col lg={6}>

          <div
            style={{
              background:
                'linear-gradient(135deg, #f8e8df, #fff9f5, #ead2c3)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
            }}
          >

            <h4
              className="text-center mb-3"
              style={{ color: '#8b563e' }}
            >
              Nuestra colección
            </h4>

            <Row className="g-3">

              {perfumes.map((perfume) => (
                <Col xs={6} key={perfume.nombre}>

                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '10px',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow:
                        '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                  >

                    <img
                      src={perfume.imagen}
                      alt={perfume.nombre}
                      style={{
                        width: '100%',
                        height: '175px',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        borderRadius: '8px'
                      }}
                    />

                    <p
                      className="mt-2 mb-1 fw-semibold"
                      style={{
                        fontSize: '14px',
                        color: '#59392e'
                      }}
                    >
                      {perfume.nombre}
                    </p>

                  </div>

                </Col>
              ))}

            </Row>

            <p
              className="text-center mt-3 mb-0"
              style={{
                color: '#8b563e',
                fontSize: '13px'
              }}
            >
              Fragancias únicas para cada personalidad
            </p>

          </div>

        </Col>

        <Col lg={6}>

          <p className="text-muted">
            Quiénes somos
          </p>

          <h2 className="mb-4">
            Perfumes que cuentan una historia
          </h2>

          <p>
            AromaEsencial nació de la pasión de cuatro
            amigas por la perfumería fina. Buscamos
            acercar fragancias de alta calidad, a precios
            justos, a quienes quieren expresar su
            identidad a través de un aroma único.
          </p>

          <p>
            Seleccionamos cuidadosamente cada esencia,
            trabajando con proveedores responsables,
            para ofrecer perfumes de hombre, mujer
            y unisex con notas florales, amaderadas,
            cítricas y orientales para cada ocasión.
          </p>

        </Col>

      </Row>

      {/* MISIÓN, VISIÓN Y VALORES */}
      <Row className="g-4 mb-5">

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-4">

              <p className="text-muted">Misión</p>

              <h3>Nuestra misión</h3>

              <p>
                Ofrecer fragancias de calidad premium
                que permitan a cada persona expresar
                su esencia y personalidad, brindando
                una experiencia de compra cercana,
                honesta y memorable.
              </p>

            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-4">

              <p className="text-muted">Visión</p>

              <h3>Nuestra visión</h3>

              <p>
                Ser la tienda online de perfumes de
                referencia en Chile, reconocida por
                la calidad de sus productos, la
                atención personalizada y su
                compromiso con la sostenibilidad.
              </p>

            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-4">

              <p className="text-muted">Valores</p>

              <h3>Lo que nos guía</h3>

              <p>
                Autenticidad, calidad, cercanía con
                el cliente y pasión por la perfumería
                en cada detalle de nuestra tienda.
              </p>

            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* EQUIPO FUNDADOR */}
      <div className="text-center mb-4">

        <p className="text-muted">
          Equipo fundador
        </p>

        <h2>
          Las dueñas de AromaEsencial
        </h2>

      </div>

      <Row className="g-4">

        {equipo.map((persona) => (

          <Col md={6} lg={3} key={persona.nombre}>

            <Card className="h-100 shadow-sm text-center">

              <Card.Img
                variant="top"
                src={persona.imagen}
                alt={persona.nombre}
                style={{
                  height: '280px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />

              <Card.Body>

                <Card.Title>
                  {persona.nombre}
                </Card.Title>

                <Card.Text className="text-muted">
                  {persona.cargo}
                </Card.Text>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

    </Container>
  );
}

export default Nosotros;
