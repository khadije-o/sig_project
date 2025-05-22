import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import '../../../assets/styles/css/LoginPage.css'
import Swal from 'sweetalert2';

const GestionUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });

  const fetchUsers = async () => {
    const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
  try {
    const response = await axios.get('http://localhost:8000/users/users/', {
  headers: {
    Authorization: `Bearer ${tokens.access}`,
  },
});
    console.log("Données utilisateurs brutes :", response.data);

    setUsers(response.data);
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs', error);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/users/users/register/', formData);
      alert("Utilisateur bien créé !");
      setShowForm(false);
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
      });
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de la création de l'utilisateur.");
      console.error(err);
    }
  };

  const handleEdit = async (user: any) => {
  const { value: formValues } = await Swal.fire({
    title: 'Modifier utilisateur',
    html:
      `<input id="swal-input1" class="swal2-input" placeholder="Prénom" value="${user.first_name}">` +
      `<input id="swal-input2" class="swal2-input" placeholder="Nom" value="${user.last_name}">`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const first_name = (document.getElementById('swal-input1') as HTMLInputElement).value;
      const last_name = (document.getElementById('swal-input2') as HTMLInputElement).value;
      if (!first_name || !last_name) {
        Swal.showValidationMessage("Tous les champs sont requis");
        return;
      }
      return { first_name, last_name };
    }
  });

  if (formValues) {
    const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
    try {
      await axios.patch(`http://localhost:8000/users/users/${user.id}/`, formValues, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });
      Swal.fire('Succès', 'Utilisateur modifié avec succès', 'success');
      fetchUsers();
    } catch (err) {
      Swal.fire('Erreur', 'Échec de la mise à jour.', 'error');
      console.error(err);
    }
  }
};


  const handleDelete = async (id: number) => {
  const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');

  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8000/users/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });
      Swal.fire('Supprimé !', 'L’utilisateur a été supprimé.', 'success');
      fetchUsers();
    } catch (err) {
      Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
      console.error(err);
    }
  }
};


  return (
    <div className="gestion-users-container">
      <h2>Gestion des utilisateurs</h2>
      <button onClick={() => setShowForm(!showForm)}>Créer un utilisateur</button>

      {showForm && (
        <form onSubmit={handleSubmit} className="register-form">
          <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="text" placeholder="Prénom" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
          <input type="text" placeholder="Nom" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
          <input type="password" placeholder="Mot de passe" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="password" placeholder="Confirmer mot de passe" required value={formData.password2} onChange={(e) => setFormData({ ...formData, password2: e.target.value })} />
          <button type="submit">Enregistrer</button>
        </form>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>
            <i className="fal fa-edit" onClick={() => handleEdit(user)} style={{ cursor: 'pointer', marginRight: '10px' }}></i>
            <i className="fal fa-trash-alt" onClick={() => handleDelete(user.id)} style={{ cursor: 'pointer' }}></i>
          </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsers;
