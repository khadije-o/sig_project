import { useState, useContext, useRef, useEffect } from "react";
import AuthContext from "../../../context/AuthContext";
import FicheForm from "../../../components/FicheForm/FicheForm";
import FicheDuJour from "../../../components/FicheDuJour/FicheDuJour";

// Composant du mini-panel profil sous le bouton
const ProfilDropdownPanel = ({ user }: { user: any }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: "10px",
        width: "320px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        padding: "20px",
        zIndex: 100,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#098163",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <i className="fas fa-user-circle"></i> Informations du profil
      </h3>
      <hr style={{ borderColor: "#e0e0e0", margin: "12px 0" }} />

      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="fas fa-id-badge" style={{ color: "#098163" }}></i>
        <span><strong>Prénom :</strong> {user.first_name}</span>
      </div>
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="fas fa-user" style={{ color: "#098163" }}></i>
        <span><strong>Nom :</strong> {user.last_name}</span>
      </div>
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="fas fa-envelope" style={{ color: "#098163" }}></i>
        <span><strong>Email :</strong> {user.email}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="fas fa-user-tag" style={{ color: "#098163" }}></i>
        <span><strong>Statut :</strong> {user.is_staff ? "Admin" : "Utilisateur"}</span>
      </div>
    </div>
  );
};

// Composant principal
const FisheBesoinsAdmin = () => {
  const { user } = useContext(AuthContext);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggleProfilePanel = () => {
    setShowProfilePanel((prev) => !prev);
  };

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowProfilePanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* En-tête */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "600", color: "#2c3e50" }}>
          Bonjour <span style={{ color: "#098163" }}>{user?.first_name}</span> !
        </h2>

        <div style={{ position: "relative" }} ref={buttonRef}>
          <button
            onClick={toggleProfilePanel}
            style={{
              backgroundColor: "#098163",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(9, 129, 99, 0.45)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#065f3e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#098163")
            }
            aria-expanded={showProfilePanel}
            aria-controls="profil-side-panel"
          >
            <i className="fas fa-user-shield" aria-hidden="true"></i> Profil
          </button>

          {showProfilePanel && user && <ProfilDropdownPanel user={user} />}
        </div>
      </div>

      {/* Contenu principal */}
      <FicheForm />
      <FicheDuJour />
    </div>
  );
};

export default FisheBesoinsAdmin;
