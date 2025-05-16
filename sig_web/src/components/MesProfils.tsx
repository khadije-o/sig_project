import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const MesProfils = () => {
    
  const { user, authTokens, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
    const handleRetour = () => {
      navigate("/fishebesoinsAdmin");

    };
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleEdit = () => {
    setEditing(!editing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authTokens) {
      Swal.fire("Erreur", "Utilisateur non authentifié", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/users/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Conserve le statut is_staff original de l'utilisateur actuel
        const finalUserData = {
          ...updatedUser,
          is_staff: user?.is_staff || false
        };
        setUser(finalUserData);

        Swal.fire({
          title: "Modifications enregistrées",
          icon: "success",
          timer: 2000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });

        setEditing(false);

        if (location.pathname === "/mes-profils") {
          return;
        }

        // Utilise le statut original pour la redirection
        const isAdmin = Boolean(user?.is_staff) || user?.role === "admin";
        const targetPath = isAdmin ? "/mes-profils" : "/mes-profils";
        
        if (location.pathname !== targetPath) {
          navigate(targetPath);
        }

      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Erreur",
          text: errorData.detail || "Une erreur est survenue.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible de se connecter au serveur.",
        icon: "error",
      });
    }
  };

  return (
    
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        
      <div style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "500px"
      }}>
        <button onClick={handleRetour} style={{ marginBottom: "20px" }}>
        ← 
      </button>
        <h2 style={{ marginBottom: "20px", color: "#2c3e50", textAlign: "center" }}>
          Mon Profil
        </h2>

        {user ? (
          editing ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>Prénom :</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Nom :</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Email :</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={{ backgroundColor: "#098163", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px" }}>
                  Enregistrer
                </button>
                <button type="button" onClick={handleToggleEdit} style={{ backgroundColor: "#6c757d", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px" }}>
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>Prénom :</strong> {user.first_name}</p>
              <p><strong>Nom :</strong> {user.last_name}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Statut :</strong> {user.is_staff ? "Admin" : "Utilisateur"}</p>

              <button
                onClick={handleToggleEdit}
                style={{
                  marginTop: "20px",
                  backgroundColor: "#098163",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Modifier mes infos
              </button>
            </>
          )
        ) : (
          <p>Aucune information disponible.</p>
        )}
      </div>
    </div>
  );
};

export default MesProfils;