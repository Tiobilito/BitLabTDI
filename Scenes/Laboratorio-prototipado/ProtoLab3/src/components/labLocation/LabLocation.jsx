import React from "react";
import "../labLocation/location.css";

const LabLocation = () => {
  return (
    <div className="location">
      <div className="title-location">
        <h2>Ubicación del Laboratorio</h2>
      </div>
      <div className="location-map">
        <iframe
          className="location-map"
          style={{ height: "60vh", width: "60%" }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d933.3281692002264!2d-103.3260947377468!3d20.65685436704511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b2253cd9b393%3A0x7d5092d7de6fedef!2sM%C3%B3dulo%20N%2C%20Blvd.%20Gral.%20Marcelino%20Garc%C3%ADa%20Barrag%C3%A1n%2C%20Ol%C3%ADmpica%2C%2044840%20Guadalajara%2C%20Jal.!5e0!3m2!1ses!2smx!4v1726597939314!5m2!1ses!2smx"
          width="800"
          height="600"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default LabLocation;
