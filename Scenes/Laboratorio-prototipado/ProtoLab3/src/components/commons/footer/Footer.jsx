import React from "react";
import "./Footer.css"; // Asegúrate de tener este archivo CSS

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-content">
        {/* Primera fila - Logos laterales e información central */}
        <div className="footer-row">
          <div className="logo-left">
            <img
              src="./images/TDILogo.png"
              alt="Logo iLabTDI"
              className="logoTDI"
            />
          </div>
          <div className="foter-contacto">
            <div className="contact-info">
              <i class="bi bi-geo-alt-fill"></i>
              <p>
                Centro Universitario de Ciencias Exactas e Ingenierías, Blvd.
                Gral. Marcelino García Barragán 1421, Olímpica, 44430
                Guadalajara, Jal.
              </p>
              <i class="bi bi-envelope-at-fill"></i>
              <p>hector.galvez5325@academicos.udg.mx</p>
              <i class="bi bi-envelope-at-fill"></i>
              <p>jovan.zepeda@academicos.udg.mx</p>
            </div>
            <div className="redes">
              <a
                href="https://www.facebook.com/ILabTDI?mibextid=ZbWKwL"
                target="_blank"
              >
                <i class="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.facebook.com/ILabTDI?mibextid=ZbWKwL"
                target="_blank"
              >
                iLabTDI
              </a>

              <a
                href="https://www.instagram.com/ilab_tdi?igsh=aDJ5YTFubHFhYnE4"
                target="_blank"
              >
                <i class="bi bi-instagram"></i>
              </a>
              <a
                href="https://www.instagram.com/ilab_tdi?igsh=aDJ5YTFubHFhYnE4"
                target="_blank"
              >
                iLabTDI
              </a>
              <a
                href="https://www.facebook.com/people/Prototyping-lab/61565476320207/?mibextid=ZbWKwL"
                target="_blank"
              >
                <i class="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com/ilab_tdi?igsh=aDJ5YTFubHFhYnE4"
                target="_blank"
              >
                Prototyping Lab
              </a>
              <i class="bi bi-telephone-fill"></i>
              <p>+52 33 1328 6565</p>
            </div>
          </div>
          <div className="logoProto">
            <img src="./images/L.png" alt="Logo INCE" className="logoProto" />
          </div>
        </div>

        {/* Segunda fila - Logos institucionales */}
        <div className="footer-row logos-bottom">
          <img
            src="./images/CUCEI2.png"
            alt="Universidad de Guadalajara"
            className="logo-institutional"
          />
          <img
            src="./images/division.png"
            alt="Sello UDG"
            className="logo-division"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
