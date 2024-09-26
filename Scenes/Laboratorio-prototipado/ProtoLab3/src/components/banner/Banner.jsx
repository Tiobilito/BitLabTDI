import React from "react";
import "../banner/banner.css";

export default function Banner() {
  return (
    <section className="banner">
      <div className="banner-content">
        <div className="grupo-logo">
          <img className="banner-logo" src="images/L.png" alt="Logo" />
          <p className="sub-text">Power by iLabTDI</p>
        </div>
        <div className="divider"></div> {/* Barra divisoria */}
        <div className="grupo-info">
          <h1>Donde las ideas se materializan y los prototipos cobran vida</h1>
          <p>
            Nuevo laboratorio de prototipado manejado por iLabTDI. Descubre y
            conoce todos los servicios que manejamos.
          </p>
        </div>
      </div>
    </section>
  );
}
