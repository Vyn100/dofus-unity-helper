import { useNavigate } from "react-router-dom";
import species from "./species.json";
import "./Dofumon.css";

export default function DofumonHome() {
  const navigate = useNavigate();

  // Init sauvegarde locale minimale
  const startNew = () => {
    const save = {
      player: { name: localStorage.getItem("pseudo") || "Héros" },
      party: [], // tes dofumons capturés
      seen: [],
      caught: [],
      bag: { dofuball: 5 },
      time: Date.now(),
    };
    localStorage.setItem("dofumon_save", JSON.stringify(save));
    navigate("dex");
  };

  const hasSave = !!localStorage.getItem("dofumon_save");

  return (
    <div className="dofu-home">
      <h1 className="dofu-title">🐣 Dofumon</h1>
      <p className="dofu-sub">Attrape-les tous… à la sauce Dofus !</p>

      <div className="dofu-actions">
        <button className="dofu-cta" onClick={startNew}>
          Nouvelle aventure
        </button>
        {hasSave && (
          <button
            className="dofu-cta secondary"
            onClick={() => navigate("dex")}
          >
            Continuer
          </button>
        )}
      </div>

      <div className="dofu-teaser">
        <div className="dofu-card">
          <h3>📘 Dofudex</h3>
          <p>Consulte les espèces connues et leurs évolutions.</p>
          <button className="mini" onClick={() => navigate("dex")}>
            Ouvrir
          </button>
        </div>
        <div className="dofu-card disabled">
          <h3>🗺️ Carte</h3>
          <p>Bientôt : explore des zones et lance des rencontres.</p>
        </div>
        <div className="dofu-card disabled">
          <h3>⚔️ Combat</h3>
          <p>Bientôt : tour par tour simple avec 4 sorts.</p>
        </div>
      </div>

      <p className="dofu-note">
        * MVP : sauvegarde locale (localStorage) — on branchera Supabase plus
        tard.
      </p>
    </div>
  );
}
