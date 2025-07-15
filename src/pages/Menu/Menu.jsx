import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Menu.css";
import Separateur from "../../assets/SeparateurHorizontalDofus.png";
import { FaDoorOpen } from "react-icons/fa";
import AlmanaxIcon from "../../assets/Almanax.png";
import RessourcesIcon from "../../assets/Ressources.png";
import EquipementsIcon from "../../assets/Equipements.png";
import Logout from "../../assets/Logout.png";

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

  return (
    <div className="menu-outer-frame">
      <div className="menu-inner-frame">
        <div className="menu-page">
          <button className="logout-btn" onClick={handleLogout}>
            <img src={Logout} alt="Déconnexion" className="logout-icon" />
          </button>

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
            <p>
              – Clique sur{" "}
              <img src={AlmanaxIcon} alt="Almanax" className="menu-icon" />{" "}
              <strong>Almanax</strong> pour voir l'offrande et bonus du jour
            </p>
            <p>
              – Clique sur{" "}
              <img
                src={RessourcesIcon}
                alt="Ressources"
                className="menu-icon"
              />{" "}
              <strong>Ressources</strong> pour rechercher des ressources avec
              leurs infos utiles
            </p>
            <p>
              – Clique sur{" "}
              <img
                src={EquipementsIcon}
                alt="Equipements"
                className="menu-icon"
              />{" "}
              <strong>Équipements</strong> pour chercher tous les objets liés au
              stuff
            </p>
          </div>

          <div className="menu-box">
            <button
              className="menu-button"
              onClick={() => navigate("/almanax")}
            >
              <img src={AlmanaxIcon} alt="Almanax" className="menu-icon" />
              Almanax
            </button>
            <button className="menu-button" onClick={() => navigate("/search")}>
              <img
                src={RessourcesIcon}
                alt="Ressources"
                className="menu-icon"
              />
              Ressources
            </button>
            <button className="menu-button" onClick={() => navigate("/search")}>
              <img
                src={EquipementsIcon}
                alt="Equipements"
                className="menu-icon"
              />
              Équipements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
