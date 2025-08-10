import { Routes, Route, useNavigate } from "react-router-dom";
import "./Dofumon.css";
import DofumonHome from "./DofumonHome";
import Dofudex from "./Dofudex";
import Logout from "../../assets/Logout.png";

export default function DofumonApp() {
  const navigate = useNavigate();
  return (
    <div className="dofu-app">
      {/* Retour menu (même style que d’hab) */}
      <button
        className="logout-btn"
        onClick={() => navigate("/menu")}
        aria-label="Retour au menu"
      >
        <img src={Logout} alt="Retour au menu" className="logout-icon" />
      </button>

      <Routes>
        <Route index element={<DofumonHome />} />
        <Route path="dex" element={<Dofudex />} />
        {/* à venir: /party, /map, /quest, /battle */}
      </Routes>
    </div>
  );
}
