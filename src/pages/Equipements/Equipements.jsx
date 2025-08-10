import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Equipements.css";
import Logout from "../../assets/Logout.png";

/** Map FR -> type.name_id (API, anglais) */
const TYPE_MAP = {
  Tous: null,
  Anneau: "ring",
  Amulette: "amulet",
  Cape: "cloak",
  Ceinture: "belt",
  Bottes: "boots",
  Coiffe: "hat",
  Bouclier: "shield",
  Dofus: "dofus",
  Trophée: "trophy",
  Familier: "pet",
  Montilier: "petsmount", // souvent 'petsmount' côté API
  Arme: "weapon", // groupe logique côté UI (sous-types ci-dessous)
};
const TYPE_ORDER = Object.keys(TYPE_MAP);

/** Sous-types d'armes (name_id API) */
const WEAPON_SUBTYPES = [
  { label: "Toutes", id: "all" },
  { label: "Épée", id: "sword" },
  { label: "Hache", id: "axe" },
  { label: "Baguette", id: "wand" },
  { label: "Dague", id: "dagger" },
  { label: "Pelle", id: "shovel" },
  { label: "Arc", id: "bow" },
  { label: "Marteau", id: "hammer" },
  { label: "Bâton", id: "staff" },
];

/** Détection élément dominante: Force/Chance/Intelligence/Agilité + Dommages élément */
function detectElement(item) {
  const effects = item?.effects || [];
  const score = { terre: 0, eau: 0, feu: 0, air: 0 };

  for (const ef of effects) {
    const t = (ef.formatted || ef?.type?.name || "").toLowerCase();

    // Caractéristiques
    if (t.includes("force")) score.terre += 1;
    if (t.includes("chance")) score.eau += 1;
    if (t.includes("intelligence")) score.feu += 1;
    if (t.includes("agilité") || t.includes("agilite")) score.air += 1;

    // Dommages élémentaires
    if (t.includes("dommages terre") || t.includes("dmg terre"))
      score.terre += 1.5;
    if (t.includes("dommages eau") || t.includes("dmg eau")) score.eau += 1.5;
    if (t.includes("dommages feu") || t.includes("dmg feu")) score.feu += 1.5;
    if (t.includes("dommages air") || t.includes("dmg air")) score.air += 1.5;
  }

  const entries = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  if (!top || top[1] === 0) return "none";
  const second = entries[1];
  if (second && second[1] === top[1]) return "multi";
  return top[0]; // "terre" | "eau" | "feu" | "air"
}

export default function Equipements() {
  const navigate = useNavigate();

  // UI
  const [typeChip, setTypeChip] = useState("Tous");
  const [weaponSub, setWeaponSub] = useState("all");
  const [search, setSearch] = useState("");
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [elementFilter, setElementFilter] = useState("all"); // all | terre | eau | feu | air | multi

  // Data
  const [items, setItems] = useState([]); // données brutes (du type sélectionné ou armes all)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cache pour limiter les appels
  const cacheRef = useRef({}); // { "Anneau": [...], "Arme_all": [...] }

  // Infinite scroll
  const [displayCount, setDisplayCount] = useState(30);
  const batchSize = 30;
  const gridRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  /** FETCH selon type sélectionné (avec cache), 1 seul fetch pour toutes les armes */
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setError("");

      const cacheKey = typeChip === "Arme" ? "Arme_all" : typeChip;

      // En cache ?
      if (cacheRef.current[cacheKey]) {
        if (!alive) return;
        setItems(cacheRef.current[cacheKey]);
        setLoading(false);
        setDisplayCount(batchSize);
        if (gridRef.current)
          gridRef.current.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      try {
        const base = `https://api.dofusdu.de/dofus3/v1/fr/items/equipment/all`;

        let url;
        if (typeChip === "Arme") {
          const u = new URL(base);
          for (const st of WEAPON_SUBTYPES) {
            if (st.id !== "all")
              u.searchParams.append("filter[type.name_id]", st.id);
          }
          u.searchParams.append(
            "sort[level]",
            sortOrder === "desc" ? "desc" : "asc"
          );
          url = u.toString();
        } else {
          const typeId = TYPE_MAP[typeChip];
          if (typeId) {
            const u = new URL(base);
            u.searchParams.append("filter[type.name_id]", typeId);
            u.searchParams.append(
              "sort[level]",
              sortOrder === "desc" ? "desc" : "asc"
            );
            url = u.toString();
          } else {
            const u = new URL(base);
            u.searchParams.append(
              "sort[level]",
              sortOrder === "desc" ? "desc" : "asc"
            );
            url = u.toString();
          }
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur API (${res.status})`);
        const json = await res.json();
        const list = json.items || [];

        // Fallback client si besoin
        let filteredList = list;
        if (typeChip !== "Arme" && TYPE_MAP[typeChip]) {
          const id = TYPE_MAP[typeChip];
          filteredList = list.filter((it) => it?.type?.name_id === id);
        } else if (typeChip === "Arme") {
          // garde uniquement les vrais sous-types d'armes attendus
          const allowed = new Set(
            WEAPON_SUBTYPES.filter((s) => s.id !== "all").map((s) => s.id)
          );
          filteredList = list.filter(
            (it) => allowed.has(it?.type?.name_id) || it?.is_weapon
          );
        }

        // Enrichir avec l’élément dominant
        const withElem = filteredList.map((it) => ({
          ...it,
          __elem: detectElement(it),
        }));

        cacheRef.current[cacheKey] = withElem;
        if (!alive) return;
        setItems(withElem);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Impossible de charger les équipements.");
      } finally {
        if (!alive) return;
        setLoading(false);
        setDisplayCount(batchSize);
        if (gridRef.current)
          gridRef.current.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    run();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeChip, sortOrder]);

  /** Filtrage & tri client (inclut weaponSub) */
  const filtered = useMemo(() => {
    let out = items.filter((it) => {
      // Sous-type d'arme
      if (typeChip === "Arme" && weaponSub !== "all") {
        if (it?.type?.name_id !== weaponSub) return false;
      }

      const name = (it.name || "").toLowerCase();
      const okSearch = !search || name.includes(search.toLowerCase());
      const lv = it.level ?? 0;
      const okLevel =
        (!minLevel || lv >= parseInt(minLevel)) &&
        (!maxLevel || lv <= parseInt(maxLevel));

      const elem = it.__elem || "none";
      const okElem =
        elementFilter === "all" ||
        (elementFilter === "multi" ? elem === "multi" : elem === elementFilter);

      return okSearch && okLevel && okElem;
    });

    out.sort((a, b) =>
      sortOrder === "asc" ? a.level - b.level : b.level - a.level
    );

    return out;
  }, [
    items,
    search,
    minLevel,
    maxLevel,
    elementFilter,
    sortOrder,
    typeChip,
    weaponSub,
  ]);

  // Reset pagination au changement de filtres
  useEffect(() => {
    setDisplayCount(batchSize);
    if (gridRef.current)
      gridRef.current.scrollTo({ top: 0, behavior: "instant" });
  }, [search, minLevel, maxLevel, elementFilter, sortOrder, weaponSub]);

  const hasMore = displayCount < filtered.length;

  /** IntersectionObserver pour infinite scroll */
  useEffect(() => {
    if (!gridRef.current || !sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          setDisplayCount((n) => n + batchSize);
        }
      },
      { root: gridRef.current, rootMargin: "0px 0px 200px 0px", threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current && observerRef.current.disconnect();
  }, [hasMore, filtered.length]);

  const handleReset = () => {
    setSearch("");
    setMinLevel("");
    setMaxLevel("");
    setSortOrder("asc");
    setElementFilter("all");
    setWeaponSub("all");
    setDisplayCount(batchSize);
    if (gridRef.current)
      gridRef.current.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleReturnMenu = () => navigate("/menu");

  return (
    <div className="equip-container">
      {/* Retour menu */}
      <button
        className="logout-btn"
        onClick={handleReturnMenu}
        aria-label="Retour au menu"
      >
        <img src={Logout} alt="Retour au menu" className="logout-icon" />
      </button>

      <h1 className="equip-title">🛡️ Équipements</h1>

      {/* Chips types */}
      <div
        className="equip-types"
        role="tablist"
        aria-label="Types d'équipements"
      >
        {TYPE_ORDER.map((label) => (
          <button
            key={label}
            className={`equip-chip ${typeChip === label ? "is-active" : ""}`}
            onClick={() => {
              setTypeChip(label);
              setWeaponSub("all");
            }}
            role="tab"
            aria-selected={typeChip === label}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sous-chips d’armes */}
      {typeChip === "Arme" && (
        <div
          className="equip-types"
          role="tablist"
          aria-label="Sous-types d'armes"
          style={{ marginTop: "-6px" }}
        >
          {WEAPON_SUBTYPES.map((st) => (
            <button
              key={st.id}
              className={`equip-chip ${weaponSub === st.id ? "is-active" : ""}`}
              onClick={() => setWeaponSub(st.id)}
              role="tab"
              aria-selected={weaponSub === st.id}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}

      {/* Filtres complémentaires */}
      <div className="equip-filters" role="group" aria-label="Filtres">
        <input
          type="text"
          placeholder="Rechercher un équipement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Niv min"
          value={minLevel}
          onChange={(e) => setMinLevel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Niv max"
          value={maxLevel}
          onChange={(e) => setMaxLevel(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Niveau ↑</option>
          <option value="desc">Niveau ↓</option>
        </select>

        <select
          value={elementFilter}
          onChange={(e) => setElementFilter(e.target.value)}
        >
          <option value="all">Tous éléments</option>
          <option value="terre">Terre</option>
          <option value="eau">Eau</option>
          <option value="feu">Feu</option>
          <option value="air">Air</option>
          <option value="multi">Multi</option>
        </select>

        <button onClick={handleReset}>Réinitialiser</button>
      </div>

      {/* Contenu */}
      {loading ? (
        <p className="equip-loading">Chargement des équipements...</p>
      ) : error ? (
        <p className="equip-error">{error}</p>
      ) : (
        <div className="equip-grid" ref={gridRef} aria-live="polite">
          {filtered.slice(0, displayCount).map((it) => (
            <article key={it.ankama_id} className="equip-card" title={it.name}>
              <img
                src={it.image_urls?.icon || it.image_urls?.sd}
                alt={it.name}
                loading="lazy"
              />
              <h3 className="equip-name">{it.name}</h3>
              <p className="equip-level">Niveau : {it.level}</p>
              <p className="equip-type">{it?.type?.name}</p>

              <div className="equip-elems">
                {it.__elem && it.__elem !== "none" ? (
                  it.__elem === "multi" ? (
                    <>
                      <span className="elem-badge elem-terre">Terre</span>
                      <span className="elem-badge elem-eau">Eau</span>
                      <span className="elem-badge elem-feu">Feu</span>
                      <span className="elem-badge elem-air">Air</span>
                    </>
                  ) : (
                    <span className={`elem-badge elem-${it.__elem}`}>
                      {it.__elem}
                    </span>
                  )
                ) : null}
              </div>
            </article>
          ))}

          <div ref={sentinelRef} className="infinite-sentinel" />
        </div>
      )}
    </div>
  );
}
