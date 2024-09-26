import React from "react";
import "../servicios/servicios.css";

export default function Servicios() {
  return (
    <div>
      <section className="servicios">
        <div className="servicios-content">
          <h2 className="titulo-servicios">Servicios que ofrecemos</h2>
          <div className="info-container">
            <div>
              <img className="lab" src="./images/Lab.jpg" alt="Lab" />
            </div>
            <div className="info-servicios">
              <p>El laboratorio de prototipado pone a su servicio:</p>
              <ul className="lista-servicios">
                <li>
                  Máquina de desbastado CNC para la producción de prototipos
                  PCB.
                </li>
                <li>
                  Escáner y la impresora 3D para la creación de objetos en 3D.
                </li>
                <li>Sistema semi-automático de ensamblado SMT.</li>
                <li>
                  Horno de soldadura por refusión para posicionar y soldar
                  componentes de montaje superficial.
                </li>
                <li>Fresadora para maquinar piezas de aluminio.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
