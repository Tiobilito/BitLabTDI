import React from "react";
import "../maquinaria/maquinaria.css";
import Card from "./card/Card";

export default function Maquinaria() {
  return (
    <div>
      <section className="maquinaria">
        <div>
          <h2>Maquinaria disponible en el laboratorio</h2>
        </div>
        <div className="cards-display">
          <Card
            title="LPKF ProtoMat S103"
            image="./images/ProtoMat.jpg"
            description="El trazador de placa de circuito LPKF ProtoMat S103 produce 
            prototipos PCB y pequeños lotes. Cuenta con una resolución de 0.5μm (0.02 mil), 
            un motor de 100,000 RPM y una velocidad de desplazamiento de 150 mm/s, 
            asegurando la precisión requerida para perforar y desbastar estructuras ultra 
            finas - especialmente para aplicaciones en el campo de RF y microonda. 
            Los requerimientos de los archivos gerber son: Pistas de 0.4mm mínimo, 
            Perforaciones de mínimo 0.5mm, Evitar ángulos de 90 grados y Eliminar islas de 
            cobre menores a 2mm cuadrados."
          />
          <Card
            title="Makerbot Replicator 2"
            image="./images/Makerbot.jpg"
            description="El Makerbot Replicator 2 crea objetos sólidos tri-dimensionales de 
            filamento PLA. Los archivos de diseño 3D son traducidos en instrucciones y enviados 
            via USB o tarjeta SD. Para imprimir tu diseño 3D, necesitarás generarlo en formato 
            .stl/.obj/.thing con un tamaño no mayor a 28.5 L x 15.3 W x 15.5 H cm y llevarlo en 
            una USB junto con tu filamento PLA de 1.75mm."
          />
          <Card
            title="ProtoPlace S"
            image="./images/ProtoPlace.jpg"
            description="El ProtoPlace S es una máquina semi-automática de colocación de 
            componentes diseñada para el ensable profesional de prototipos de circuitos impresos
             que incluyen componentes electrónicos SMD. La máquina permite la colocación de 
             diferentes componentes, incluyendo empaquetados QFP de hasta 0.4mm con hasta 300 pines 
             y encapsulados de tipo 0201, ajuste de diversos tamaños de tarjetas de circuitos 
             impresos de hasta 297x420mm. Para el uso de la máquina, preséntese en el 
             laboratorio con sus componentes SMD, su PCB y su pasta en los horarios disponibles."
          />
          <Card
            title="Torch T200C+"
            image="./images/Torch.jpg"
            description="El T200C+ es un horno de soldadura por refusión libre de plomo con curvas 
            de temperatura configurables, ideal para circuitos con componentes de montaje superficial.
            Con un tamaño efectivo de trabajo de 360x230mm, se pueden trabajar con varios lotes a la vez, 
            requiriendo un tiempo mínimo de soldado de 3 minutos."
          />
          <Card
            title="Sense 3D Scanner"
            image="./images/Sense.jpg"
            description="El T200C+ es un horno de soldadura por refusión libre de plomo con curvas 
            de temperatura configurables, ideal para circuitos con componentes de montaje superficial.
            Con un tamaño efectivo de trabajo de 360x230mm, se pueden trabajar con varios lotes a la vez, 
            requiriendo un tiempo mínimo de soldado de 3 minutos."
          />
          <Card
            title="Fresadora"
            image="./images/Fresadora.jpg"
            description="La fresadora VF3KM400 es un verdadero Caballo de Batalla. Ideal para evolucionar 
            tu taller de fresadoras convencionales a tecnología CNC. Con la VF3K M400 podrás maquinar 
            piezas de hasta 760 mm de largo, 355 mm de ancho y 400 mm de alto, además de los 120 mm 
            adicionales con los que cuenta el cañón del husillo."
          />
        </div>
      </section>
    </div>
  );
}
