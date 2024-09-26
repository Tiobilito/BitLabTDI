import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal } from "react-bootstrap";
import "./card.css";

const Card = ({ title, image, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efecto para añadir y quitar la clase 'no-scroll'
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Limpieza del efecto
    return () => document.body.classList.remove("no-scroll");
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Tarjeta principal */}
      <div
        className={`card ${isModalOpen ? "open" : ""}`}
        onClick={toggleModal}
      >
        <img src={image} alt={title} className="card-image" />
        <h3 className="card-title">{title}</h3>
      </div>

      {/* Modal de Bootstrap */}
      <Modal
        show={isModalOpen}
        onHide={toggleModal}
        centered
        dialogClassName="modal-dialog-custom"
        contentClassName="modal-content-custom"
        backdropClassName="modal-backdrop-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-image">
            <img src={image} alt={title} className="modal-image-into" />
            <img src="./images/L.png" alt="logo" className="modal-image-logo" />
          </div>
          <div className="modal-text">
            <p>{description}</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Card;
