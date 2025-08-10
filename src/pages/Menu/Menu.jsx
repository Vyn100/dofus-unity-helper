import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Menu.css";
import Separateur from "../../assets/SeparateurHorizontalDofus.png";
import AlmanaxIcon from "../../assets/Almanax.png";
import RessourcesIcon from "../../assets/Ressources.png";
import EquipementsIcon from "../../assets/Equipements.png";
import Logout from "../../assets/Logout.png";
import Account from "../../assets/HavreSac.png";
import MobsIcon from "../../assets/Mobs.png";
import DofumonIcon from "../../assets/Dofumon.png";

const Menu = () => {
  const navigate = useNavigate();
  const pseudo = localStorage.getItem("pseudo");

  useEffect(() => {
    if (!pseudo) navigate("/");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pseudo");
    navigate("/");
  };

  const handleAlmanaxClick = () => {
    localStorage.setItem("almanaxTransition", "true");
    navigate("/almanax");
  };

  return (
    <div className="menu-outer-frame">
      <div className="menu-inner-frame">
        <div className="menu-page">
          <button className="logout-btn" onClick={handleLogout}>
            <img src={Logout} alt="Déconnexion" className="logout-icon" />
          </button>

          <div className="account-btn" onClick={() => navigate("/Compte")}>
            <div className="account-glow" />
            <img src={Account} alt="Mon compte" />
          </div>

          <h1 className="menu-title">
            Bienvenue <span className="pseudo">{pseudo}</span> 👋
          </h1>

          <img
            src={Separateur}
            alt="séparateur"
            className="menu-separateur"
            draggable="false"
          />

          <div className="menu-description">
            <p>Cette page est ton tableau de bord !</p>
          </div>

          <div className="menu-box">
            {/* Ligne 1 — 4 boutons fixes sur une seule ligne */}
            <div className="menu-row top">
              <button className="menu-button" onClick={handleAlmanaxClick}>
                <img src={AlmanaxIcon} alt="Almanax" className="menu-icon" />
                Almanax
              </button>
              <button
                className="menu-button"
                onClick={() => navigate("/Ressources")}
              >
                <img
                  src={RessourcesIcon}
                  alt="Ressources"
                  className="menu-icon"
                />
                Ressources
              </button>
              <button
                className="menu-button"
                onClick={() => navigate("/Equipements")}
              >
                <img
                  src={EquipementsIcon}
                  alt="Équipements"
                  className="menu-icon"
                />
                Équipements
              </button>
              <button className="menu-button" onClick={() => navigate("/mobs")}>
                <img src={MobsIcon} alt="Mobs" className="menu-icon" />
                Mobs
              </button>
            </div>

            {/* Ligne 2 — Dofumon seul, sans titre */}
            <div className="menu-row single">
              <button
                className="menu-button dofumon"
                onClick={() => navigate("/dofumon")}
                aria-label="Dofumon"
                title="Dofumon"
              >
                <img
                  src={DofumonIcon}
                  alt="Dofumon"
                  className="menu-icon dofumon-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
