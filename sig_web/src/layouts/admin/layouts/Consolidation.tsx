import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface InvitationOffre {
  id: number;
  delai: string;
  valeur_offre: number;
}

const Consolidation: React.FC = () => {
  const [invitations, setInvitations] = useState<InvitationOffre[]>([]);
  const [delai, setDelai] = useState('');
  const [valeurOffre, setValeurOffre] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/invitations/')
      .then(res => setInvitations(res.data))
      .catch(() => Swal.fire('Erreur', 'Échec du chargement.', 'error'));
  }, []);

  const resetForm = () => {
    setDelai('');
    setValeurOffre('');
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { delai, valeur_offre: valeurOffre };
    try {
      if (editId !== null) {
        await axios.put(`http://localhost:8000/api/invitations/${editId}/`, data);
        Swal.fire('Succès', 'Modifié avec succès', 'success');
      } else {
        await axios.post('http://localhost:8000/api/invitations/', data);
        Swal.fire('Succès', 'Ajouté avec succès', 'success');
      }

      const res = await axios.get('http://localhost:8000/api/invitations/');
      setInvitations(res.data);
      resetForm();
    } catch {
      Swal.fire('Erreur', 'Échec lors de la soumission', 'error');
    }
  };

  const handleEdit = (inv: InvitationOffre) => {
    setDelai(inv.delai);
    setValeurOffre(inv.valeur_offre);
    setEditId(inv.id);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Supprimer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/invitations/${id}/`);
        setInvitations(invitations.filter(i => i.id !== id));
        Swal.fire('Supprimé', '', 'success');
      } catch {
        Swal.fire('Erreur', 'Impossible de supprimer.', 'error');
      }
    }
  };

  return (
    <div>
      <h2>{editId ? 'Modifier' : 'Ajouter'} une Invitation</h2>
      <form onSubmit={handleSubmit}>
        <input type="datetime-local" value={delai} onChange={e => setDelai(e.target.value)} />
        <input type="number" value={valeurOffre} onChange={e => setValeurOffre(parseFloat(e.target.value))} />
        <button type="submit">{editId ? 'Mettre à jour' : 'Ajouter'}</button>
      </form>

      <h3>Liste des Invitations</h3>
      <table>
        <thead>
          <tr>
            <th>Délais</th>
            <th>Valeur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map(inv => (
            <tr key={inv.id}>
              <td>{inv.delai}</td>
              <td>{inv.valeur_offre}</td>
              <td>
                <button onClick={() => handleEdit(inv)}>Modifier</button>
                <button onClick={() => handleDelete(inv.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Consolidation;
