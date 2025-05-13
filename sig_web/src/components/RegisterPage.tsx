

import { useState, useContext, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import deskImage from '../assets/images/logo1.jpg';
import '../css/LoginPage.css';

function RegisterPage() {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authContext?.registerUser) {
      authContext.registerUser(email, first_name, last_name, password, password2);
    }
  };

  return (
    <div>
      <section className="login-section register-page">
        <div className="container login-container">
          <img src={deskImage} alt="Logo" className="login-logo" />
          {/* <h5 className="login-title">Créer un compte</h5> */}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <div className="login-button-container">
              <button type="submit">S'inscrire</button>
            </div>

            <div className="text-center">
              <p className="mt-2" style={{ color: "#393f81" }}>
                Déjà un compte ?{" "}
                <Link to="/login" className="register-link">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
