import React from "react";
import Banner from "../../components/banner/Banner";
import Servicios from "../../components/servicios/Servicios";
import Maquinaria from "../../components/maquinaria/Maquinaria";
import LabLocation from "../../components/labLocation/LabLocation";
import Footer from "../../components/commons/footer/Footer";
import "../home/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <Banner />
      <Maquinaria />
      <Servicios />
      <LabLocation />
      <Footer />
    </div>
  );
}
