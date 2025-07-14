import "./Almanax.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Almanax = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(100);
  const navigate = useNavigate();

  const fetchAlmanax = async (levelValue) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `https://api.dofusdu.de/dofus3/v1/fr/almanax/${today}?level=${levelValue}`
      );
      if (!response.ok) return;
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlmanax(level);
  }, []);

  useEffect(() => {
    const parsedLevel = parseInt(level);
    if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 200) return;
    fetchAlmanax(parsedLevel);
  }, [level]);

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Erreur de chargement.</p>;

  return (
    <div className="almanax-container">
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

      {data.tribute && data.tribute.item && (
        <div className="almanax-item-wrapper">
          <div className="almanax-item-image">
            <img
              src={data.tribute.item.image_urls.sd}
              alt={data.tribute.item.name}
            />
          </div>
          <p className="almanax-item-text">
            Tu dois ramener : <strong>{data.tribute.item.name}</strong> x
            {data.tribute.quantity}
          </p>
        </div>
      )}

      <div className="almanax-level">
        <input
          type="number"
          min="1"
          max="200"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        <label>Niveau du personnage</label>
      </div>

      <div className="almanax-rewards">
        <p>
          XP : <strong>{data.reward_xp.toLocaleString()}</strong>
        </p>
        <p>
          Kamas : <strong>{data.reward_kamas.toLocaleString()}</strong>
        </p>
      </div>

      <div className="almanax-back-button">
        <button onClick={() => navigate("/")}>
          <span>←</span> Retour
        </button>
      </div>
    </div>
  );
};

export default Almanax;
