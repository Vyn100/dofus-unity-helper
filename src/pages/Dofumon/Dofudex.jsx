import species from "./species.json";
import "./Dofumon.css";

const ELEM_EMOJI = {
  terre: "🌿",
  eau: "💧",
  feu: "🔥",
  air: "🌪",
  neutre: "⚪",
};

export default function Dofudex() {
  return (
    <div className="dofu-dex">
      <h2 className="dofu-section">📘 Dofudex</h2>
      <div className="dofu-grid">
        {species.map((sp) => (
          <article key={sp.id} className="dofu-mon">
            <img src={sp.icon} alt={sp.name} loading="lazy" />
            <h3>{sp.name}</h3>
            <div className="tags">
              {sp.elements.map((el) => (
                <span className={`tag tag-${el}`} key={el}>
                  {ELEM_EMOJI[el] || "✨"} {el}
                </span>
              ))}
            </div>
            <p className="lvl">Base : niv {sp.baseLevel}</p>
            {sp.evolvesTo?.length ? (
              <p className="evo">
                Évolution →{" "}
                {sp.evolvesTo
                  .map((id) => species.find((s) => s.id === id)?.name)
                  .join(", ")}
              </p>
            ) : (
              <p className="evo none">Évolution : —</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
