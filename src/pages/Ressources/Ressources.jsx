import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ressources.css";
import Logout from "../../assets/Logout.png"; // icône bouton retour

const Ressources = () => {
  const navigate = useNavigate();

  const [allResources, setAllResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);

  const [search, setSearch] = useState("");
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [typeFilter, setTypeFilter] = useState("all");
  const [types, setTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  // Pagination (infinite scroll)
  const [displayCount, setDisplayCount] = useState(30);
  const batchSize = 30;

  // Refs pour l'observer
  const gridRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // 1) Fetch unique
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.dofusdu.de/dofus3/v1/fr/items/resources/all",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Erreur API ressources");
        const json = await res.json();
        const items = json.items || [];
        setAllResources(items);
        setFilteredResources(items);

        // liste des types disponibles
        const uniqueTypes = [
          "all",
          ...new Set(items.map((r) => r?.type?.name).filter(Boolean)),
        ];
        setTypes(uniqueTypes);
      } catch (e) {
        if (e.name !== "AbortError")
          console.error("Erreur API ressources :", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // 2) Filtrage + tri client
  useEffect(() => {
    let out = allResources.filter((r) => {
      const name = (r.name || "").toLowerCase();
      const okSearch = !search || name.includes(search.toLowerCase());
      const lv = r.level ?? 0;
      const okLevel =
        (!minLevel || lv >= parseInt(minLevel)) &&
        (!maxLevel || lv <= parseInt(maxLevel));
      const okType = typeFilter === "all" || r?.type?.name === typeFilter;
      return okSearch && okLevel && okType;
    });

    out.sort((a, b) =>
      sortOrder === "asc" ? a.level - b.level : b.level - a.level
    );

    setFilteredResources(out);
    setDisplayCount(batchSize);

    // remonte en haut de la grille au changement de filtres
    if (gridRef.current)
      gridRef.current.scrollTo({ top: 0, behavior: "instant" });
  }, [search, minLevel, maxLevel, sortOrder, typeFilter, allResources]);

  const hasMore = displayCount < filteredResources.length;

  // 3) IntersectionObserver pour l’infinite scroll
  useEffect(() => {
    if (!gridRef.current || !sentinelRef.current) return;

    // Nettoie l’observer précédent (si filtres changent)
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          setDisplayCount((n) => n + batchSize);
        }
      },
      {
        root: gridRef.current, // observe dans la grille scrollable
        rootMargin: "0px 0px 200px 0px", // déclenche un peu avant le bas
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current && observerRef.current.disconnect();
  }, [hasMore, filteredResources.length]);

  const handleReset = () => {
    setSearch("");
    setMinLevel("");
    setMaxLevel("");
    setSortOrder("asc");
    setTypeFilter("all");
    setDisplayCount(batchSize);
    if (gridRef.current)
      gridRef.current.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleReturnMenu = () => navigate("/menu");

  return (
    <div className="ressources-container">
      {/* Bouton retour menu (même look que logout du menu) */}
      <button
        className="logout-btn"
        onClick={handleReturnMenu}
        aria-label="Retour au menu"
      >
        <img src={Logout} alt="Retour au menu" className="logout-icon" />
      </button>

      <h1 className="ressources-title">📦 Ressources</h1>

      {/* Filtres */}
      <div
        className="ressources-filters"
        role="group"
        aria-label="Filtres ressources"
      >
        <input
          type="text"
          placeholder="Rechercher une ressource..."
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

        {/* Filtre par type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "Tous les types" : t}
            </option>
          ))}
        </select>

        <button onClick={handleReset}>Réinitialiser</button>
      </div>

      {/* Contenu */}
      {loading ? (
        <p className="loading-text">Chargement des ressources...</p>
      ) : (
        <>
          <div
            className="ressources-grid"
            ref={gridRef}
            aria-live="polite"
            aria-busy={loading ? "true" : "false"}
          >
            {filteredResources.length > 0 ? (
              filteredResources.slice(0, displayCount).map((res) => (
                <article
                  key={res.ankama_id}
                  className="ressource-card"
                  title={res.name}
                >
                  <img
                    src={res.image_urls?.icon || res.image_urls?.sd}
                    alt={res.name}
                    loading="lazy"
                  />
                  <h3 className="ressource-name">{res.name}</h3>
                  <p className="ressource-level">Niveau : {res.level}</p>
                  {res.type && (
                    <p className="ressource-type">{res.type.name}</p>
                  )}
                </article>
              ))
            ) : (
              <p className="no-result">Aucune ressource trouvée.</p>
            )}

            {/* Sentinel pour l’infinite scroll */}
            <div ref={sentinelRef} className="infinite-sentinel" />
          </div>
        </>
      )}
    </div>
  );
};

export default Ressources;
