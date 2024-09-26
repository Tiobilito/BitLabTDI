import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Offcanvas,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../Header/header.css"; // Archivo CSS para estilos

const Header = () => {
  const [open, setOpen] = useState(false); // Estado para controlar el menú Offcanvas

  const toggleMenu = () => {
    setOpen(!open); // Cambia el estado de "open" para mostrar/ocultar el menú
  };

  useEffect(() => {
    // Agregar el evento scroll para hacer el header sticky
    window.addEventListener("scroll", isSticky);
    return () => {
      // Remover el evento scroll cuando el componente se desmonte
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  // Función que añade la clase 'is-sticky' cuando se hace scroll
  const isSticky = (e) => {
    const header = document.querySelector(".header-section");
    const scrollTop = window.scrollY;
    scrollTop >= 120
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
  };

  return (
    <header className="header-section">
      <Container>
        <Navbar expand="lg" className="p-0">
          {/* Logo que redirige al home */}
          <Navbar.Brand className="logoIT">
            <NavLink to="/">
              <img src="images/L.png" alt="Logo" className="logo-img" />
            </NavLink>
            <h1 className="title">
              Laboratorio de <br /> Prototipado
            </h1>
          </Navbar.Brand>

          {/* Offcanvas para navegación en dispositivos móviles */}
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="start"
            show={open}
          >
            <Offcanvas.Body>
              {/* Navegación principal */}
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {/* Opción Solicitar servicio */}
                <NavLink className="nav-link" to="/solicitar-servicio">
                  Solicitar Prototipo
                </NavLink>

                {/* Dropdown para descargar los archivos PDF */}
                <NavDropdown
                  title="Documentos"
                  id={`offcanvasNavbarDropdown-expand-lg`}
                >
                  <NavDropdown.Item
                    href="./documents/altium_gerber.pdf"
                    download
                  >
                    Altium gerber
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="./documents/generar_archivos_gerber_con_eagle.pdf"
                    download
                  >
                    Generar archivos gerber con eagle
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="./documents/kicad_gerber.pdf"
                    download
                  >
                    Kicad gerber
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="./documents/manual_gerber_proteus.pdf"
                    download
                  >
                    Manual gerber proteus
                  </NavDropdown.Item>
                  <NavDropdown.Item href="./documents/orcad_gerber" download>
                    Orcad gerber
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="./documents/procedimiento_de_fabricacion_lab_de_prototipado"
                    download
                  >
                    Procedimiento de fabricacion de prototipado
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="./documents/reglamento_del_laboratorio_de_prototipado"
                    download
                  >
                    Reglamento del laboratorio de prototipado
                  </NavDropdown.Item>
                </NavDropdown>
                {/* Opción Maquinaria */}
                <NavLink className="nav-link" to="/maquinaria">
                  Contactanos
                </NavLink>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          {/* Botón del menú Offcanvas para pantallas pequeñas */}
          <li className="d-inline-block d-lg-none ms-3 toggle_btn">
            <i
              className={open ? "bi bi-x-lg" : "bi bi-list"}
              onClick={toggleMenu}
            ></i>
          </li>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
