import React from "react";
import "../servicio/solicitud.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Form from "./Form";
import FormTwo from "./FormTwo";
import Footer from "../../components/commons/footer/Footer";

export default function SolicitarServicio() {
  return (
    <div className="background-container">
      <div className="request">
        <div className="solicitud-container">
          <div className="info-solicitud">
            <h1>¿Necesitas de nuestros servicios?</h1>
            <p className="process-introduction">
              Para poder solicitar un servicio del laboratorio se debe completar
              el siguiente proceso:
            </p>
            <div className="process">
              <div className="process-steps">
                <div>
                  <i
                    class="bi bi-1-circle-fill"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p>Llena el formulario y envíalo</p>
                </div>
                <i class="bi bi-arrow-right" style={{ fontSize: "2rem" }}></i>
                <div>
                  <i
                    class="bi bi-2-circle-fill"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p>Revisión y aprovación del jefe de laboratorio</p>
                </div>
                <i class="bi bi-arrow-right" style={{ fontSize: "2rem" }}></i>
                <div>
                  <i
                    class="bi bi-3-circle-fill"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p>Obtienes tu solicitud aprovada en formato PDF</p>
                </div>
                <i class="bi bi-arrow-right" style={{ fontSize: "2rem" }}></i>
                <div>
                  <i
                    class="bi bi-4-circle-fill"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p>Entrega tu formato impreso en el laboratorio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FormTwo />
        <Footer />
      </div>
    </div>
  );
}
