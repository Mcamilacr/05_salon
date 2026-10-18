import { Container, Row, Col, Ratio } from "react-bootstrap";
import CarruselPortada from "../componentes/CarruselPortada";
import AcordeonServicios from "../componentes/AcordeonServicios";
import IntroEstilizada from "../componentes/IntroEstilizada";
import videoIntroduccion from "../multimedia/video/intro.mp4";
import audioBienvenida from "../multimedia/audio/bienvenida.mp3";

export default function Home() {
  return (
    <>
      <CarruselPortada />

      <Container className="my-5">
        <IntroEstilizada />

        <Row className="my-4 g-4">
          <Col xs={12} md={4}>
            <h4>Reserva fácil</h4>
            <p>Consulta disponibilidad y agenda tu cita en minutos.</p>
          </Col>
          <Col xs={12} md={4}>
            <h4>Profesionales certificados</h4>
            <p>Estilistas con experiencia en cada servicio.</p>
          </Col>
          <Col xs={12} md={4}>
            <h4>Confirmaciones claras</h4>
            <p>Control de horarios y recordatorios dentro del sitio.</p>
          </Col>
        </Row>

        <h3 id="servicios" className="mt-5 mb-3">Nuestros servicios</h3>
        <AcordeonServicios />

        <Row className="my-5 g-4 align-items-center">
          <Col xs={12} md={6}>
            <h4>Conócenos</h4>
            <Ratio aspectRatio="16x9">
              <video controls>
                <source src={videoIntroduccion} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </Ratio>
          </Col>
          <Col xs={12} md={6}>
            <h4>Bienvenida</h4>
            <audio controls className="w-100">
              <source src={audioBienvenida} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </Col>
        </Row>
      </Container>
    </>
  );
}
