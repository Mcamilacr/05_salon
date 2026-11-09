// Barra de navegación fija: enlaces públicos, login/registro y panel según el rol
import { useState } from "react";

import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Button
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import {
  useAutenticacion
} from "../contexto/ContextoAutenticacion";

import ModalLogin from "./ModalLogin";
import { obtenerRutaPanel } from "../datos/configuracionApi";

import logo from "../multimedia/imagenes/logo.png";

import "../estilos/NavBar.css";

export default function NavBar() {

  const [mostrarLogin, setMostrarLogin] = useState(false);

  const {
    usuario,
    autenticado,
    cerrarSesion
  } = useAutenticacion();

  const navegar = useNavigate();

  // Cerrar sesión
  const manejarCerrarSesion = () => {

    cerrarSesion();

    navegar("/");

  };

  return (

    <>

      <Navbar
        bg="light"
        expand="lg"
        fixed="top"
        className="shadow-sm navbar-personalizada"
      >

        <Container>

          <Navbar.Brand as={Link} to="/">

            <img
              src={logo}
              alt="Logo Salón de Belleza"
              height="40"
              className="d-inline-block align-top me-2"
            />

            Salón de Belleza

          </Navbar.Brand>

          <Navbar.Toggle aria-controls="menu-principal" />

          <Navbar.Collapse id="menu-principal">

            <Nav className="ms-auto align-items-lg-center">

              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>

              <Nav.Link as={Link} to="/contacto">
                Contáctenos
              </Nav.Link>

              <NavDropdown
                title="Servicios"
                id="menu-servicios"
              >

                <NavDropdown.Item as={Link} to="/servicios/manicura">
                  Manicura y pedicura
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/servicios/peluqueria">
                  Peluquería
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/servicios/maquillaje">
                  Maquillaje
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/servicios/spa">
                  Spa
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/servicios/depilacion">
                  Depilación
                </NavDropdown.Item>

              </NavDropdown>

              {!autenticado ? (

                <>

                  <Button
                    variant="outline-dark"
                    className="ms-lg-3 mt-2 mt-lg-0"
                    onClick={() => setMostrarLogin(true)}
                  >

                    Iniciar sesión

                  </Button>

                  <Nav.Link as={Link} to="/registro">
                    Registrarse
                  </Nav.Link>

                </>

              ) : (

                <>

                  <Nav.Link as={Link} to={obtenerRutaPanel(usuario.rol)}>

                    Mi panel

                  </Nav.Link>

                  <span className="mx-lg-2 text-muted">

                    {usuario.nombre}

                  </span>

                  <Button
                    variant="outline-danger"
                    className="ms-lg-3 mt-2 mt-lg-0"
                    onClick={manejarCerrarSesion}
                  >

                    Cerrar sesión

                  </Button>

                </>

              )}

            </Nav>

          </Navbar.Collapse>

        </Container>

      </Navbar>

      <ModalLogin
        show={mostrarLogin}
        onHide={() => setMostrarLogin(false)}
      />

    </>

  );

}