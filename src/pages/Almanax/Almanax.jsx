import "./Almanax.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/Back.png";
import KamasIcon from "../../assets/Kamas.png";
import XPIcon from "../../assets/XP.png";

const Almanax = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(100);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const fetchAlmanax = async (levelValue) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `https://api.dofusdu.de/dofus3/v1/fr/almanax/${today}?level=${levelValue}`
      );
      if (!response.ok) throw new Error("Réponse invalide");
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const parsed = parseInt(level);
    if (isNaN(parsed) || parsed < 1 || parsed > 200) return;
    setConfirmed(true);
    fetchAlmanax(parsed);
  };

  return (
    <div className="almanax-container">
      {!confirmed ? (
        <>
          <h2 className="almanax-title">Quel est ton niveau ?</h2>
          <div className="almanax-level">
            <input
              type="number"
              min="1"
              max="200"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
            <label>Niveau du personnage</label>
            <button onClick={handleConfirm} className="almanax-confirm-button">
              Confirmer
            </button>
          </div>
        </>
      ) : loading ? (
        <p>Chargement...</p>
      ) : data ? (
        <>
          <h2 className="almanax-title">
            Almanax du{" "}
            {new Date(data.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>

          <p className="almanax-description">{data.bonus.description}</p>

          {data.tribute?.item && (
            <div className="almanax-item-wrapper">
              <div className="almanax-image-wrapper">
                <div className="almanax-glow" />
                <img
                  src={data.tribute.item.image_urls.sd}
                  alt={data.tribute.item.name}
                  className="almanax-image"
                />
              </div>
              <p className="almanax-item-text">
                <span className="highlight">Tu dois ramener :</span>{" "}
                <strong>{data.tribute.item.name}</strong> x
                {data.tribute.quantity}
              </p>
            </div>
          )}

          <div className="almanax-rewards">
            <p>
              XP : <strong>{data.reward_xp.toLocaleString()}</strong>
              <img src={XPIcon} alt="XP" className="xp-icon" />
            </p>
            <p>
              Kamas : <strong>{data.reward_kamas.toLocaleString()}</strong>
              <img src={KamasIcon} alt="Kamas" className="kamas-icon" />
            </p>
          </div>
        </>
      ) : (
        <p>Erreur de chargement.</p>
      )}

      <div className="almanax-back-button">
        <button onClick={() => navigate("/menu")}>
          <img src={BackIcon} alt="Retour" />
        </button>
      </div>
    </div>
  );
};

export default Almanax;
