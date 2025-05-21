


import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import deskImage from '../assets/images/logo1.jpg';
import '../css/LoginPage.css';

function LoginPage() {
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  const { loginUser } = authContext;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (email.length > 0) {
      loginUser(email, password);
    }
  };

  return (
    <div>
      <section className="login-section">
        <div className="container login-container">
          <img src={deskImage} alt="Logo" className="login-logo" />
          {/* <h5 className="login-title">Se connecter</h5> */}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="form2Example17" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="form2Example17"
                className="form-control"
                name="email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="form2Example27" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                id="form2Example27"
                className="form-control"
                name="password"
                required
              />
            </div>

            <div className="login-button-container">
              <button type="submit">Se connecter</button>
            </div>

            {/* <div className="text-center">
              <a className="forgot-link"  href="#!">Mot de passe oublié?</a>
              <p className="mt-2" style={{ color: "#393f81" }}>
                Vous n'avez pas de compte?{" "}
                <Link to="/register" className="register-link">
                  Créer un compte
                </Link>
              </p>
            </div> */}
          </form>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
