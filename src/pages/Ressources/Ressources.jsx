import { useEffect, useState } from "react";
import "./Ressources.css";

const Ressources = () => {
  const [allResources, setAllResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [search, setSearch] = useState("");
  const [minLevel, setMinLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  const [displayCount, setDisplayCount] = useState(30); // Affichage progressif

  // 1. Appel API unique
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.dofusdu.de/dofus3/v1/fr/items/resources/all"
        );
        if (!response.ok) throw new Error("Erreur API ressources");
        const json = await response.json();

        const resources = json.items || [];
        setAllResources(resources);
        setFilteredResources(resources);
      } catch (error) {
        console.error("Erreur API ressources :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // 2. Filtrage dynamique côté client
  useEffect(() => {
    let filtered = allResources.filter((res) => {
      const name = res.name?.toLowerCase() || "";
      const matchesSearch = name.includes(search.toLowerCase());
      const matchesLevel =
        (!minLevel || res.level >= parseInt(minLevel)) &&
        (!maxLevel || res.level <= parseInt(maxLevel));
      return matchesSearch && matchesLevel;
    });

    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.level - b.level : b.level - a.level
    );

    setFilteredResources(filtered);
    setDisplayCount(30); // Reset pagination au filtrage
  }, [search, minLevel, maxLevel, sortOrder, allResources]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 30);
  };

  return (
    <div className="ressources-container">
      <h1 className="ressources-title">📦 Ressources</h1>

      {/* Barre de recherche et filtres */}
      <div className="ressources-filters">
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
        <button
          onClick={() => {
            setSearch("");
            setMinLevel("");
            setMaxLevel("");
            setSortOrder("asc");
            setDisplayCount(30);
          }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Contenu */}
      {loading ? (
        <p className="loading-text">Chargement des ressources...</p>
      ) : (
        <>
          <div className="ressources-grid">
            {filteredResources.length > 0 ? (
              filteredResources.slice(0, displayCount).map((res) => (
                <div key={res.ankama_id} className="ressource-card">
                  <img
                    src={res.image_urls?.icon || res.image_urls?.sd}
                    alt={res.name}
                    loading="lazy"
                  />
                  <h3>{res.name}</h3>
                  <p className="ressource-level">Niveau : {res.level}</p>
                  {res.type && (
                    <p className="ressource-type">{res.type.name}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-result">Aucune ressource trouvée.</p>
            )}
          </div>

          {displayCount < filteredResources.length && (
            <div className="load-more">
              <button onClick={handleLoadMore}>Charger plus</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Ressources;
