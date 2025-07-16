import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/Back.png";
const Ressources = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Page Recherche d'objet</h2>
      <div className="ressources-back-button">
        <button onClick={() => navigate("/menu")}>
          <img src={BackIcon} alt="Retour" />
        </button>
      </div>
    </div>
  );
};

export default Ressources;
