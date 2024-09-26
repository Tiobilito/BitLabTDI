import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Header from "./components/commons/header/Header";
import SolicitarServicio from "./pages/servicio/SolicitarServicio";
//import Maquinaria from "./pages/Maquinaria";

function App() {
  return (
    <Router>
      {/* Colocamos el Header fuera de Routes para que siempre se muestre */}
      <Header />
      {/* Definimos las rutas para las páginas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitar-servicio" element={<SolicitarServicio />} />
        {/*<Route path="/maquinaria" element={<Maquinaria />} />*/}
        {/* Otras rutas que quieras agregar */}
      </Routes>
    </Router>
  );
}

export default App;
