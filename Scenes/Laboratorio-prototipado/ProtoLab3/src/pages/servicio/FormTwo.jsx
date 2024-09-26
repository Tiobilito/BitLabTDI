import React, { useState } from "react";
import "./formTwo.css";

export default function FormTwo() {
  const [fecha, setFecha] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [rol, setRol] = useState({ alumno: false, profesor: false });
  const [tipoProyecto, setTipoProyecto] = useState("Licenciatura");
  const [rolError, setRolError] = useState("");
  const [formError, setFormError] = useState("");
  const [tipoPrototipo, setTipoPrototipo] = useState("");
  const [message, setMessage] = useState("");
  const [numCarasPCB, setNumCarasPCB] = useState("");
  const [pcbProporcionado, setPcbProporcionado] = useState("");

  const handleFechaChange = (e) => {
    const value = e.target.value;
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(value)) {
      setError("Formato de fecha inválido. Use DD/MM/AAAA.");
    } else {
      setError("");
    }
    setFecha(value);
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    const regex = /^\+?[0-9]*$/;
    if (!regex.test(value)) {
      setErrorTelefono("El número de teléfono solo puede contener dígitos.");
    } else {
      setErrorTelefono("");
    }
    setTelefono(value);
  };

  const handleRolChange = (e) => {
    const { name, checked } = e.target;
    setRol((prevRol) => ({ ...prevRol, [name]: checked }));
  };

  const handleTipoProyectoChange = (event) => {
    setTipoProyecto(event.target.value);
  };

  const handleTipoPrototipoChange = (event) => {
    setTipoPrototipo(event.target.value); // Manejo del cambio de prototipo
  };

  // Manejo de cambios en la sección 3: Número de caras del PCB
  const handleNumCarasChange = (e) => {
    setNumCarasPCB(e.target.value);
  };

  // Manejo de cambios en la sección 3: PCB proporcionado por el usuario
  const handlePcbProporcionadoChange = (e) => {
    setPcbProporcionado(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !correo || !telefono || !fecha) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }
    if (!rol.alumno && !rol.profesor) {
      setRolError("Debe seleccionar al menos una opción: Alumno o Profesor.");
      return;
    }
    setFormError("");
    setRolError("");
    // Aquí puedes manejar el envío del formulario
    console.log("Formulario enviado");
  };

  const handleClick = () => {
    setMessage("Envío exitoso");
  };

  return (
    <div className="form-container">
      <div className="title-form">
        <h2>Formato de requerimiento de servicio de maquinado de prototipo.</h2>
      </div>
      <form className="complex-form">
        {/*Seccion 1: Datos de contacto*/}
        <div className="form-section">
          <div className="row">
            <h3>Datos de contacto</h3>
            <div className="form-group half-width">
              <label htmlFor="nombre" className="titulo-entrada">
                Nombre completo
              </label>
              <input type="text" id="nombre" placeholder="Tu nombre" />
            </div>
            <div className="form-group half-width">
              <label htmlFor="correo" className="titulo-entrada">
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                placeholder="tuemail@ejemplo.com"
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="telefono" className="titulo-entrada">
                Número de teléfono
              </label>
              <input
                type="text"
                id="telefono"
                placeholder="Número"
                value={telefono}
                onChange={handleTelefonoChange}
              />
              {errorTelefono && (
                <span className="error-message">{errorTelefono}</span>
              )}
            </div>
            <div className="form-group half-width">
              <label htmlFor="fecha" className="titulo-entrada">
                Fecha
              </label>
              <input
                type="text"
                id="fecha"
                placeholder="DD/MM/AAAA"
                value={fecha}
                onChange={handleFechaChange}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            {/*Checkbox y radio button*/}
            <div className="usuario-proyecto-row">
              <div className="izquierda">
                <div>
                  <h3>Usuario interno</h3>
                </div>
                <div className="usuario-intern">
                  <div className="checkbox-group">
                    <div>
                      <input
                        type="checkbox"
                        id="alumno"
                        name="alumno"
                        checked={rol.alumno}
                        onChange={handleRolChange}
                      />
                      <label htmlFor="alumno">Alumno</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="profesor"
                        name="profesor"
                        checked={rol.profesor}
                        onChange={handleRolChange}
                      />
                      <label htmlFor="profesor">Profesor</label>
                    </div>
                    {rol.alumno && (
                      <div className="input-row-alumno">
                        <div className="half-input-alumno">
                          <label
                            htmlFor="codigoAlumno"
                            className="titulo-entrada"
                          >
                            Código de Alumno
                          </label>
                          <input
                            type="text"
                            id="codigoAlumno"
                            placeholder="Código de Alumno"
                          />
                        </div>
                      </div>
                    )}
                    {rol.profesor && (
                      <div className="input-row-profesor">
                        <div className="half-input-profesor">
                          <label
                            htmlFor="codigoProfesor"
                            className="titulo-entrada"
                          >
                            Código de Profesor
                          </label>
                          <input
                            type="text"
                            id="codigoProfesor"
                            placeholder="Código de Profesor"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*Usuario interno */}

              <div className="derecha">
                <h3>Tipo de proyecto</h3>
                {/*Tipo de proyecto */}
                <div className="proyecto">
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="tipoProyecto"
                        value="Licenciatura"
                        checked={tipoProyecto === "Licenciatura"}
                        onChange={handleTipoProyectoChange}
                      />
                      Licenciatura
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="tipoProyecto"
                        value="Posgrado"
                        checked={tipoProyecto === "Posgrado"}
                        onChange={handleTipoProyectoChange}
                      />
                      Posgrado
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="tipoProyecto"
                        value="CuerpoAcademico"
                        checked={tipoProyecto === "CuerpoAcademico"}
                        onChange={handleTipoProyectoChange}
                      />
                      Cuerpo académico
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group half-width">
              <label htmlFor="aplicacion" className="titulo-entrada">
                Aplicacion
              </label>
              <input
                type="text"
                id="aplicacion"
                placeholder="Aplicacion del proyecto"
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="descripcion-proyecto" className="titulo-entrada">
                Descripcion
              </label>
              <input
                type="text"
                id="descripcion"
                placeholder="Descripcion del proyecto"
              />
            </div>
          </div>
        </div>
        {/*Seccion 2: Datos del prototipo */}
        <div className="form-section">
          <div className="row">
            <h3>Datos del Prototipo</h3>
            <div className="datos-row">
              {/*Tipo de prototipo */}
              <div className="tipo-prototipo">
                <h3>Tipo de prototipo</h3>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="tipoPrototipo"
                      value="circuito-impreso"
                      checked={tipoPrototipo === "circuito-impreso"}
                      onChange={handleTipoPrototipoChange}
                    />
                    Diseño de circuito impreso
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipoPrototipo"
                      value="3D"
                      checked={tipoPrototipo === "3D"}
                      onChange={handleTipoPrototipoChange}
                    />
                    Diseño de prototipo en 3D
                  </label>
                </div>
              </div>

              {/*Descripcion del prototipo */}
              <div className="descripcion-prototipo">
                <h3>Descripción del prototipo</h3>
                <div className="form-groupP half-width">
                  <label htmlFor="descripcion" className="titulo-entrada">
                    DESCRIPCIÓN
                  </label>
                  <input
                    type="text"
                    id="descripcionProto"
                    placeholder="Describe tu prototipo"
                  />
                </div>
              </div>
            </div>
            <div className="requerimientos-prototipo">
              <h3>Requerimientos específicos del Prototipo</h3>
              <div className="form-group half-width">
                <label htmlFor="dimensiones" className="titulo-entrada">
                  DIMENSIONES
                </label>
                <input type="text" id="dimensiones" placeholder="" />
              </div>
              <div className="form-group half-width">
                <label htmlFor="corte" className="titulo-entrada">
                  CORTE ESPECIAL
                </label>
                <input type="text" id="corte" placeholder="" />
              </div>
              <div className="form-group half-width">
                <label htmlFor="otros" className="titulo-entrada">
                  OTROS
                </label>
                <input type="text" id="otros" placeholder="" />
              </div>
              <div className="form-group half-width">
                <label htmlFor="observaciones" className="titulo-entrada">
                  OBSERVACIONES
                </label>
                <input type="text" id="observaciones" placeholder="" />
              </div>
            </div>
          </div>
        </div>
        {/*Seccion 3: Uso interno */}
        <div className="form-section">
          <div className="row">
            <h3>Uso interno</h3>
            <div className="interno-row">
              <div className="izquierda">
                <h3>Número de caras PCB</h3>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="numCarasPCB"
                      value="1"
                      checked={numCarasPCB === "1"}
                      onChange={handleNumCarasChange}
                    />
                    1
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="numCarasPCB"
                      value="2"
                      checked={numCarasPCB === "2"}
                      onChange={handleNumCarasChange}
                    />
                    2
                  </label>
                </div>
              </div>
              <div className="derecha">
                <h3>PCB proporcionado por usuario</h3>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="pcbProporcionado"
                      value="si"
                      checked={pcbProporcionado === "si"}
                      onChange={handlePcbProporcionadoChange}
                    />
                    Sí
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="pcbProporcionado"
                      value="no"
                      checked={pcbProporcionado === "no"}
                      onChange={handlePcbProporcionadoChange}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button onClick={handleClick}>Enviar</button>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
}
