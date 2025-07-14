import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Menu.css";

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
    <div className="page-menu">
      <div className="menu-container">
        <h2>Bienvenue {pseudo} 👋</h2>

        <div className="menu-buttons">
          <button onClick={() => navigate("/almanax")}>📅 Almanax</button>
          <button onClick={() => navigate("/search")}>🔍 Objets</button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Menu;
