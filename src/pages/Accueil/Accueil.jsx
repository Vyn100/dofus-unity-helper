import { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "./Accueil.css";

const Accueil = () => {
  const [pseudo, setPseudo] = useState("");
  const [mdp, setMdp] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!pseudo || !mdp) {
      setError("Remplis tous les champs !");
      return;
    }

    if (isSignUp) {
      const { data: existingUser } = await supabase
        .from("Utilisateurs")
        .select("id")
        .eq("pseudo", pseudo)
        .single();

      if (existingUser) {
        setError("Ce pseudo est déjà pris.");
        return;
      }

      const { error: insertError } = await supabase
        .from("Utilisateurs")
        .insert([{ pseudo, mdp }]);

      if (insertError) {
        setError("Erreur lors de l'inscription.");
        return;
      }

      localStorage.setItem("pseudo", pseudo);
      navigate("/menu");
    } else {
      const { data: user, error: loginError } = await supabase
        .from("Utilisateurs")
        .select("*")
        .eq("pseudo", pseudo)
        .eq("mdp", mdp)
        .single();

      if (loginError || !user) {
        setError("Pseudo ou mot de passe incorrect.");
        return;
      }

      localStorage.setItem("pseudo", pseudo);
      navigate("/menu");
    }
  };

  return (
    <div className="page-accueil">
      <div className="accueil-card">
        <h2>{isSignUp ? "Créer un compte" : "Connexion"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
          />
          <button type="submit">
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        {error && <p className="accueil-error">{error}</p>}

        <p className="accueil-switch">
          {isSignUp ? "Déjà un compte ?" : "Pas encore inscrit ?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Accueil;
