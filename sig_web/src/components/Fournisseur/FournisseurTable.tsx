import { Fournisseur } from '../../types/fournisseurTypes';
import Button from '../button/button';
import IconButton from '../button/IconButton';

interface Props {
  fournisseurs: Fournisseur[];
  onDelete: (id?: number) => void;
  onRefresh: () => void;
  onEdit: (fournisseur: Fournisseur) => void;
  onCreateDevis: (fournisseur: Fournisseur) => void;
}

const FournisseurTable = ({ fournisseurs, onDelete, onEdit, onCreateDevis }: Props) => {
   if (fournisseurs.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30px', fontStyle: 'italic', color: '#777' }}>
        Aucun résultat trouvé.
      </div>
    );
  }
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Entreprise</th>
          <th>Téléphone</th>
          <th>Email</th>
          <th>NIF</th>
          <th>RC</th>
          <th>Compte bancaire</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {fournisseurs.map((fournisseur) => (
          <tr key={fournisseur.id}>
            <td>{fournisseur.nom_entreprise}</td>
            <td>{fournisseur.telephone}</td>
            <td>{fournisseur.email}</td>
            <td>{fournisseur.nif}</td>
            <td>{fournisseur.rc}</td>
            <td>{fournisseur.compte_bancaire}</td>
            <td>
              <IconButton
                iconClass="fal fa-edit"
                title="Modifier"
                onClick={() => onEdit(fournisseur)}
                variant="edit"
              ></IconButton>

              <IconButton
              iconClass="fal fa-trash-alt"
              title="Supprimer"
              onClick={() => onDelete(fournisseur.id)}
              variant="danger"
            />
            <Button 
              title="Créer un devis" 
              onClick={() => onCreateDevis(fournisseur)}
              variant="secondary"
              size="sm"
            >
              Créer un devis
            </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FournisseurTable;
