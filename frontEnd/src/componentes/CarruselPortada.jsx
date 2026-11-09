import { Carousel } from "react-bootstrap";
import imagen1 from "../multimedia/imagenes/carrusel1.jpg";
import imagen2 from "../multimedia/imagenes/carrusel2.jpg";
import imagen3 from "../multimedia/imagenes/carrusel3.jpg";

export default function CarruselPortada() {
  const estiloImagen = { maxHeight: "480px", objectFit: "cover" };

  return (
    <Carousel fade>
      <Carousel.Item>
        <img className="d-block w-100" src={imagen1} alt="Transforma tu look" style={estiloImagen} />
        <Carousel.Caption>
          <h3>Transforma tu look, transforma tu vida</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={imagen2} alt="Servicios de belleza" style={estiloImagen} />
        <Carousel.Caption>
          <h3>Servicios de manicure, peluquería y spa</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={imagen3} alt="Agenda tu cita" style={estiloImagen} />
        <Carousel.Caption>
          <h3>Agenda tu cita en línea</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
