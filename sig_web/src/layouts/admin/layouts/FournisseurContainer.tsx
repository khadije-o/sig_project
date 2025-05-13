import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";

interface Fournisseur {
  id?: number;
  nom_entreprise: string;
  telephone: string;
  email: string;
  nif: string;
  rc: string;
  compte_bancaire: string;
}

export default function FournisseurContainer() {
  const { authTokens } = useContext(AuthContext);

  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Fournisseur>({
    nom_entreprise: "",
    telephone: "",
    email: "",
    nif: "",
    rc: "",
    compte_bancaire: "",
  });
  const [search, setSearch] = useState<string>("");

  const fetchFournisseurs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/fournisseurs/fournisseurs/", {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      setFournisseurs(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des fournisseurs", err);
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/fournisseurs/fournisseurs/", formData, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      setShowModal(false);
      setFormData({
        nom_entreprise: "",
        telephone: "",
        email: "",
        nif: "",
        rc: "",
        compte_bancaire: "",
      });
      fetchFournisseurs();
    } catch (err) {
      alert("Erreur lors de la création du fournisseur");
    }
  };

  const filteredFournisseurs = fournisseurs.filter((f) =>
    f.nom_entreprise.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Liste des fournisseurs</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Rechercher un fournisseur"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Créer un fournisseur
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Nom entreprise</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>NIF</th>
            <th>RC</th>
            <th>Compte bancaire</th>
          </tr>
        </thead>
        <tbody>
          {filteredFournisseurs.map((f) => (
            <tr key={f.id}>
              <td>{f.nom_entreprise}</td>
              <td>{f.email}</td>
              <td>{f.telephone}</td>
              <td>{f.nif}</td>
              <td>{f.rc}</td>
              <td>{f.compte_bancaire}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de création */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Créer un fournisseur</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {[
                    "nom_entreprise",
                    "telephone",
                    "email",
                    "nif",
                    "rc",
                    "compte_bancaire",
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.replace("_", " ")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name={field}
                        value={(formData as any)[field]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-success">
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
