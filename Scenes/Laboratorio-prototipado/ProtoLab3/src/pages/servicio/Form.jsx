import React from "react";
import "./form.css";

export default function Form() {
  const [userType, setUserType] = useState("");
  return (
    <div className="form-container">
      <div className="title-form">
        <h2>Formulario de solicitud de prototipo</h2>
      </div>
      <form className="complex-form">
        {/* Sección 1: Datos de contacto */}
        <div className="form-section">
          <div className="row">
            <div className="form-group full-width">
              <label htmlFor="nombre" className="titulo-entrada">
                Nombre completo
              </label>
              <input type="text" id="nombre" placeholder="Tu nombre" />
            </div>
            <div className="form-group half-width">
              <label htmlFor="correo" className="titulo-entrada">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                placeholder="tuemail@ejemplo.com"
              />
            </div>
            <div className="form-group half-widthF">
              <label htmlFor="telefono" className="titulo-entrada">
                Teléfono
              </label>
              <input
                type="text"
                id="telefono"
                placeholder="Número de teléfono"
              />
            </div>
            <div className="form-group half-widthF">
              <label htmlFor="fecha" className="titulo-entrada">
                Fecha
              </label>
              <input type="text" id="fecha" placeholder="DD/MM/AAAA" />
            </div>
          </div>
        </div>

        {/* Sección 2: Aplicación y Usuario interno */}
        <div className="form-section">
          <div className="row">
            <div className="form-group full-width">
              <label htmlFor="aplicacion" className="titulo-entrada">
                Aplicación
              </label>
              <input type="text" id="aplicacion" placeholder="Aplicación" />
            </div>
            <div className="form-group half-width">
              <label className="titulo-entrada">Tipo de Usuario</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="alumno"
                    checked={userType === "alumno"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  Alumno
                </label>
              </div>
            </div>
            <div className="form-group half-width">
              <label htmlFor="codigoAlumno" className="titulo-entrada">
                Código Alumno
              </label>
              <input
                type="text"
                id="codigoAlumno"
                placeholder="Código Alumno"
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="codigoProfesor" className="titulo-entrada">
                Código Profesor Posgrado
              </label>
              <input
                type="text"
                id="codigoProfesor"
                placeholder="Código Profesor"
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="licenciatura" className="titulo-entrada">
                Licenciatura
              </label>
              <input type="text" id="licenciatura" placeholder="Licenciatura" />
            </div>
            <div className="form-group half-width">
              <label htmlFor="cuerpoAcademico" className="titulo-entrada">
                Cuerpo Académico
              </label>
              <input
                type="text"
                id="Cuerpo Académico"
                placeholder="Cuerpo Académico"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="pendiente" className="titulo-entrada">
                Pendiente
              </label>
              <input type="text" id="pendiente" placeholder="pendiente" />
            </div>
          </div>
        </div>

        {/* Sección 3: Tipo de prototipo y Descripción */}
        <div className="form-section">
          <div className="row">
            <div className="form-group half-width">
              <label htmlFor="tipoPrototipo" className="titulo-entrada">
                Tipo de prototipo
              </label>
              <input
                type="text"
                id="tipoPrototipo"
                placeholder="Diseño de circuito impreso / Diseño de prototipo en 3D"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="descripcionPrototipo" className="titulo-entrada">
                Descripción del prototipo
              </label>
              <textarea
                id="descripcionPrototipo"
                rows="4"
                placeholder="Descripción del prototipo"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Sección 4: Requerimientos específicos */}
        <div className="form-section">
          <h3>Requerimientos específicos del Prototipo</h3>
          <div className="form-group">
            <label htmlFor="dimensiones" className="titulo-entrada">
              Dimensiones
            </label>
            <input
              type="text"
              id="dimensiones"
              placeholder="Dimensiones del prototipo"
            />
          </div>
          <div className="form-group">
            <label htmlFor="corteEspecial" className="titulo-entrada">
              Corte especial
            </label>
            <input
              type="text"
              id="corteEspecial"
              placeholder="Requerimientos de corte especial"
            />
          </div>
          <div className="form-group">
            <label htmlFor="otros" className="titulo-entrada">
              Otros
            </label>
            <input type="text" id="otros" placeholder="Otros requerimientos" />
          </div>
        </div>
      </form>
    </div>
  );
}
