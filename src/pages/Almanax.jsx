import { useEffect, useState } from "react";

const Almanax = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(100);

  const fetchAlmanax = async (levelValue) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const url = `https://api.dofusdu.de/dofus3/v1/fr/almanax/${today}?level=${levelValue}`;
      console.log("📡 Requête envoyée à :", url);

      const response = await fetch(url);
      console.log("🔁 Status de la réponse :", response.status);

      if (!response.ok) {
        console.error("❌ Erreur HTTP :", response.status);
        return;
      }

      const json = await response.json();
      console.log("✅ Données reçues :", json);

      setData(json);
    } catch (err) {
      console.error("💥 Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  // Appel initial
  useEffect(() => {
    console.log("🚀 Appel initial à fetchAlmanax avec level =", level);
    fetchAlmanax(level);
  }, []);

  // Appel quand le niveau change
  useEffect(() => {
    // Pour éviter de spam si l'input vide ou 0
    const parsedLevel = parseInt(level);
    if (isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 200) {
      console.warn("⚠️ Niveau invalide, pas d'appel API :", level);
      return;
    }

    console.log("🔁 Changement de niveau détecté :", parsedLevel);
    fetchAlmanax(parsedLevel);
  }, [level]);

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Impossible de récupérer les données.</p>;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.description}</p>

      {data.item ? (
        <>
          <img
            src={data.item.image_urls?.hq}
            alt={data.item.name}
            style={{ width: "120px" }}
          />
          <p>
            Tu dois ramener : <strong>{data.item.name}</strong> x{data.quantity}
          </p>
        </>
      ) : (
        <p>
          <strong>Pas d'objet à rapporter aujourd'hui</strong>
        </p>
      )}

      <div style={{ marginTop: "10px" }}>
        <label>Niveau du personnage : </label>
        <input
          type="number"
          min="1"
          max="200"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ width: "60px", marginLeft: "10px" }}
        />
      </div>

      <p>XP : {data.rewards_experience}</p>
      <p>Kamas : {data.rewards_kamas}</p>
    </div>
  );
};

export default Almanax;
