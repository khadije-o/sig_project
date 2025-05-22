import React from 'react';
import { Fiche } from '../../types/ficheGroupType';
import "../../assets/styles/css/FicheGroup.css";

interface Props {
  fiches: Fiche[];
  label?: string;
  isStaff: boolean;
  selectedFiches: number[];
  onToggleSelect: (ficheId: number) => void;
  onDelete: (ficheId: number) => void;
  onDownloadPdf: (ficheId: number) => void;
  onShowDetail: (fiche: Fiche) => void;
  onCreateInvitation: () => void;
}

const FicheTable: React.FC<Props> = ({
  fiches,
  label,
  isStaff,
  selectedFiches,
  onToggleSelect,
  onDelete,
  onDownloadPdf,
  onShowDetail,
  onCreateInvitation,
}) => {
  const getStatutLabel = (status: string) => {
    const statuts: Record<string, string> = {
      en_attente: 'En attente',
      acceptee: 'Acceptée',
      rejetee: 'Rejetée',
      historique: 'Historique',
    };
    return statuts[status] || status;
  };

  return (
    <>
      {label && <h3>{label}</h3>}
      {fiches.length > 0 ? (
        <>
          <table border={1} cellPadding={10}>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Status</th>
                <th>Actions</th>
                {isStaff && <th>Sélection</th>}
              </tr>
            </thead>
            <tbody>
            {fiches.map(fiche => (
                <tr key={fiche.id}>
                <td>{fiche.numero}</td>
                <td>{fiche.date_fiche}</td>
                <td>{fiche.user.first_name} {fiche.user.last_name}</td>
                <td>{getStatutLabel(fiche.status)}</td>
                <td>
                <div className="action-buttons">
                    <button className="action-btn view-btn" onClick={() => onShowDetail(fiche)} title="Détails">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn pdf-btn" onClick={() => onDownloadPdf(fiche.id)} title="Télécharger PDF">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    {isStaff && (
                    <button className="action-btn delete-btn" onClick={() => onDelete(fiche.id)} title="Supprimer fiche">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </div>
                  </td>
                {isStaff && (
                    <td>
                    <input
                        type="checkbox"
                        checked={selectedFiches.includes(fiche.id)}
                        onChange={() => onToggleSelect(fiche.id)}
                    />
                    </td>
                )}
                </tr>
            ))}
            </tbody>

          </table>

          {isStaff && selectedFiches.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onCreateInvitation}>Créer une invitation</button>
            </div>
          )}
        </>
      ) : (
        <p>Aucune fiche trouvée.</p>
      )}
    </>
  );
};

export default FicheTable;
