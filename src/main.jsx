import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Almanax from "./pages/Almanax";
import Search from "./pages/Search";
import Accueil from "./pages/Accueil";
import Menu from "./pages/Menu";

const App = () => {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Almanax
        </Link>
        <Link to="/search">Recherche</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Almanax />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/almanax" element={<Almanax />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
