import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Almanax from "./pages/Almanax/Almanax";
import Ressources from "./pages/Ressources/Ressources";
import Accueil from "./pages/Accueil/Accueil";
import Menu from "./pages/Menu/Menu";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/almanax" element={<Almanax />} />
        <Route path="/ressources" element={<Ressources />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="wrapper">
      <App />
    </div>
  </React.StrictMode>
);
