import { useContext } from 'react'
import { jwtDecode } from "jwt-decode"
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Navbar() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { user, logoutUser } = authContext;

  const token = localStorage.getItem("authTokens");
  let user_id: number | undefined = undefined;

  if (token) {
    const decoded: any = jwtDecode(token); // préciser "any" pour le typage rapide
    user_id = decoded.user_id;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img style={{ width: "120px", padding: "6px" }} src="https://i.imgur.com/juL1aAc.png" alt="Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>

            {token === null && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

            {token !== null && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/fiches_besoin/fichebesoin">Fichebesoin</Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</span>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
