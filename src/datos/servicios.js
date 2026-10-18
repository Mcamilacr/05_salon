// Datos de cada servicio título, imagen, descripcion y precios

import manicuraImg from "../multimedia/imagenes/servicios/manicura.jpg";
import peluqueriaImg from "../multimedia/imagenes/servicios/peluqueria.jpg";
import maquillajeImg from "../multimedia/imagenes/servicios/maquillaje.jpg";
import spaImg from "../multimedia/imagenes/servicios/spa.jpg";
import depilacionImg from "../multimedia/imagenes/servicios/depilacion.jpg";

export const servicios = {
  manicura: {
    titulo: "Servicio de manicura y pedicura",
    imagen: manicuraImg,
    parrafos: [
      "Los siguientes servicios se encuentran a su disposición, ejecutados por profesionales en el campo.",
      "Los precios para los servicios de uñas están sujetos a posibles ajustes o cargos adicionales que se pueden aplicar durante la cita. Estos ajustes dependerán de factores como la complejidad del diseño solicitado, el tipo de productos utilizados, y el estado de las uñas naturales. A pesar de estas variaciones, los precios se mantendrán dentro de los rangos indicados, brindando al cliente una opción clara y accesible.",
    ],
    tabla: [
      ["Manicure", "Cuidado de uñas, limpieza, corte y esmaltado", "$15,000 - $30,000"],
      ["Pedicure", "Cuidado y esmaltado de uñas de los pies", "$20,000 - $40,000"],
      ["Esmaltado Semipermanente", "Esmalte de larga duración para manos o pies", "$40,000 - $80,000"],
      ["Uñas Acrílicas", "Extensiones y diseño en acrílico", "$80,000 - $150,000"],
      ["Uñas en Gel", "Uñas esculpidas en gel para mayor duración", "$70,000 - $120,000"],
      ["Diseños de Arte en Uñas", "Decoración personalizada (dibujos, pedrería)", "$5,000 - $30,000"],
      ["Retoque de Uñas", "Mantenimiento de uñas acrílicas o en gel", "$40,000 - $70,000"],
    ],
  },
  peluqueria: {
    titulo: "Servicio de peluquería - tratamiento del cabello",
    imagen: peluqueriaImg,
    parrafos: [
      "Los siguientes servicios se encuentran a su disposición, ejecutados por profesionales en el campo del manejo capilar.",
      "Los precios para los servicios de cabello mencionados están sujetos a ajustes o cargos adicionales que pueden aplicarse durante la cita, en función de factores como el tipo y estado del cabello, la longitud, o la complejidad del tratamiento solicitado. Sin embargo, todos los servicios se mantendrán dentro de los rangos de precios indicados, garantizando claridad y accesibilidad para el cliente.",
    ],
    tabla: [
      ["Corte de Cabello", "Corte para damas, caballeros y niños", "$10,000 - $60,000"],
      ["Peinados", "Recogidos, semirecogidos, ondas, trenzas", "$40,000 - $150,000"],
      ["Alisado Permanente", "Keratina, alisado japonés o brasileño", "$150,000 - $500,000"],
      ["Tintura y Coloración", "Tinte completo, balayage, ombré, mechas", "$40,000 - $500,000"],
      ["Secado y Cepillado", "Secado con estilo liso, volumen u ondas", "$20,000 - $50,000"],
      ["Tratamientos Capilares", "Hidratación, nutrición, reconstrucción", "$40,000 - $120,000"],
      ["Extensiones de Cabello", "Aplicación de extensiones", "$200,000 - $700,000"],
      ["Permanente Rizada", "Rizos permanentes", "$120,000 - $300,000"],
    ],
  },
  maquillaje: {
    titulo: "Servicio de maquillaje",
    imagen: maquillajeImg,
    parrafos: [
      "Los siguientes servicios se encuentran a su disposición, ejecutados por profesionales en el campo.",
      "Los precios para servicios de maquillaje pueden variar de acuerdo con varios factores específicos del evento y las necesidades del cliente. La complejidad del maquillaje solicitado, el uso de productos especializados, y el tiempo de aplicación requerido pueden influir en el precio. Sin embargo, cada servicio se mantendrá dentro de los rangos de precios indicados para asegurar transparencia y flexibilidad en el costo final.",
    ],
    tabla: [
      ["Maquillaje Social", "Maquillaje para eventos casuales o de día", "$50,000 - $100,000"],
      ["Maquillaje de Noche", "Maquillaje más elaborado para eventos de noche", "$80,000 - $150,000"],
      ["Maquillaje para Novias", "Maquillaje especial para bodas", "$150,000 - $300,000"],
      ["Maquillaje Artístico", "Diseños creativos para eventos especiales", "$100,000 - $200,000"],
      ["Maquillaje de Fotografía", "Maquillaje para sesiones fotográficas", "$80,000 - $150,000"],
    ],
  },
  spa: {
    titulo: "Servicio de spa",
    imagen: spaImg,
    parrafos: [
      "Los siguientes servicios se encuentran a su disposición, ejecutados por profesionales en el campo.",
      "Los precios de los servicios de spa pueden ajustarse según las necesidades individuales de cada cliente. Factores como el tipo de productos utilizados, la duración del tratamiento y la intensidad o personalización del servicio pueden influir en el costo final. Sin embargo, todos los servicios se mantendrán dentro de los rangos indicados, asegurando claridad y accesibilidad en el costo para cada cliente.",
    ],
    tabla: [
      ["Masaje Relajante", "Masaje para reducir el estrés y la tensión muscular", "$50,000 - $120,000"],
      ["Masaje Descontracturante", "Masaje profundo para aliviar contracturas y dolores", "$80,000 - $150,000"],
      ["Facial", "Limpieza y tratamiento facial personalizado", "$60,000 - $120,000"],
      ["Exfoliación Corporal", "Exfoliación completa para suavizar la piel", "$70,000 - $150,000"],
      ["Spa de Manos y Pies", "Hidratación, masajes y cuidado de manos y pies", "$50,000 - $100,000"],
    ],
  },
  depilacion: {
    titulo: "Servicio de depilación",
    imagen: depilacionImg,
    parrafos: [
      "Los siguientes servicios se encuentran a su disposición, ejecutados por profesionales en el campo.",
      "Los precios de los servicios de depilación están sujetos a ajustes según la zona a depilar, el método seleccionado y la cantidad o densidad del vello en el área tratada; lo cual, puede afectar el precio final. A pesar de estas variaciones, los precios se mantendrán dentro de los rangos indicados, brindando a los clientes transparencia y opciones accesibles.",
    ],
    tabla: [
      ["Depilación Facial", "Eliminación de vello en áreas faciales", "$20,000 - $40,000"],
      ["Depilación de Piernas", "Depilación completa o media pierna", "$30,000 - $80,000"],
      ["Depilación de Brazos", "Eliminación de vello en brazos", "$20,000 - $50,000"],
      ["Depilación de Axilas", "Depilación en la zona de las axilas", "$15,000 - $30,000"],
      ["Depilación Brasileña", "Depilación de área de bikini", "$40,000 - $70,000"],
      ["Depilación con Cera Corporal", "Depilación de varias zonas corporales", "$80,000 - $150,000"],
    ],
  },
};
