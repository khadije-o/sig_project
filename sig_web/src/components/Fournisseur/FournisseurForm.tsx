import { FormEvent, useState } from 'react';
import { createFournisseur } from '../../services/fournisseurService';
import { Fournisseur } from '../../types/fournisseurTypes';
import Swal from 'sweetalert2';
import '../Fournisseur/FournisseurForm.css'

const emptyFournisseur: Fournisseur = {
  nom_entreprise: '',
  telephone: '',
  email: '',
  nif: '',
  rc: '',
  compte_bancaire: '',
};

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const FournisseurForm = ({ onSuccess,onCancel }: Props) => {
  const [formData, setFormData] = useState<Fournisseur>(emptyFournisseur);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createFournisseur(formData);
      Swal.fire('Succès', 'Fournisseur bien créé !', 'success');
      setFormData(emptyFournisseur);
      onSuccess();
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la création du fournisseur.', 'error');
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="fournisseur-form">
      <input type="text" placeholder="Entreprise" required value={formData.nom_entreprise}
        onChange={e => setFormData({ ...formData, nom_entreprise: e.target.value })} />
      <input type="text" placeholder="Téléphone" required value={formData.telephone}
        onChange={e => setFormData({ ...formData, telephone: e.target.value })} />
      <input type="email" placeholder="Email" required value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <input type="text" placeholder="NIF" value={formData.nif}
        onChange={e => setFormData({ ...formData, nif: e.target.value })} />
      <input type="text" placeholder="RC" value={formData.rc}
        onChange={e => setFormData({ ...formData, rc: e.target.value })} />
      <input type="text" placeholder="Compte bancaire" value={formData.compte_bancaire}
        onChange={e => setFormData({ ...formData, compte_bancaire: e.target.value })} />
      <div className="form-buttons">
        <button type="submit" className="submit-btn">Enregistrer</button>
        <button type="button" onClick={onCancel} className="cancel-btn">
  Annuler
</button>

      </div>
    </form>
  );
};

export default FournisseurForm;
