// import { useState, useContext, FormEvent } from 'react'
// import { Link } from 'react-router-dom'
// import AuthContext from '../context/AuthContext'
// import deskImage from '../assets/images/desk.jpg';

// function RegisterPage() {
//   const authContext = useContext(AuthContext);

//   const [email, setEmail] = useState("")
//   const [first_name, setFirstname] = useState("")
//   const [last_name, setLastname] = useState("")
//   const [password, setPassword] = useState("")
//   const [password2, setPassword2] = useState("")

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (authContext?.registerUser) {
//       authContext.registerUser(email, first_name, last_name, password, password2)
//     }
//   }

//   return (
//     <div>
//       <>
//         <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
//           <div className="container py-5 h-100">
//             <div className="row d-flex justify-content-center align-items-center h-100">
//               <div className="col col-xl-10">
//                 <div className="card" style={{ borderRadius: "1rem" }}>
//                   <div className="row g-0">
//                     <div className="col-md-6 col-lg-5 d-none d-md-block">
//                     <img
//                       src={deskImage}
//                       alt="login form"
//                       className="img-fluid"
//                       style={{ borderRadius: "1rem 0 0 1rem" }}
//                     />
//                     </div>
//                     <div className="col-md-6 col-lg-7 d-flex align-items-center">
//                       <div className="card-body p-4 p-lg-5 text-black">
//                         <form onSubmit={handleSubmit}>
//                           <div className="d-flex align-items-center mb-3 pb-1">
//                             <i
//                               className="fas fa-cubes fa-2x me-3"
//                               style={{ color: "#ff6219" }}
//                             />
//                             <span className="h2 fw-bold mb-0">
//                               Welcome to <b>Desphixs👋</b>
//                             </span>
//                           </div>
//                           <h5
//                             className="fw-normal mb-3 pb-3"
//                             style={{ letterSpacing: 1 }}
//                           >
//                             Sign Up
//                           </h5>
//                           <div className="form-outline mb-4">
//                             <input
//                               type="email"
//                               className="form-control form-control-lg"
//                               placeholder="Email Address"
//                               value={email}
//                               onChange={(e) => setEmail(e.target.value)}
//                             />
//                           </div>
//                           <div className="form-outline mb-4">
//                             <input
//                               type="text"
//                               className="form-control form-control-lg"
//                               placeholder="Firstname"
//                               value={first_name}
//                               onChange={(e) => setFirstname(e.target.value)}
//                             />
//                           </div>
//                           <div className="form-outline mb-4">
//                             <input
//                               type="text"
//                               className="form-control form-control-lg"
//                               placeholder="Lastname"
//                               value={last_name}
//                               onChange={(e) => setLastname(e.target.value)}
//                             />
//                           </div>
//                           <div className="form-outline mb-4">
//                             <input
//                               type="password"
//                               className="form-control form-control-lg"
//                               placeholder="Password"
//                               value={password}
//                               onChange={(e) => setPassword(e.target.value)}
//                             />
//                           </div>
//                           <div className="form-outline mb-4">
//                             <input
//                               type="password"
//                               className="form-control form-control-lg"
//                               placeholder="Confirm Password"
//                               value={password2}
//                               onChange={(e) => setPassword2(e.target.value)}
//                             />
//                           </div>
//                           <div className="pt-1 mb-4">
//                             <button
//                               className="btn btn-dark btn-lg btn-block"
//                               type="submit"
//                             >
//                               Register
//                             </button>
//                           </div>
//                           <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
//                             Already have an account?{" "}
//                             <Link to="/login" style={{ color: "#393f81" }}>
//                               Login Now
//                             </Link>
//                           </p>
//                           <a href="#!" className="small text-muted">
//                             Terms of use.
//                           </a>
//                           <a href="#!" className="small text-muted">
//                             Privacy policy
//                           </a>
//                         </form>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <footer className="bg-light text-center text-lg-start">
//           <div
//             className="text-center p-3"
//             style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
//           >
//             © 2025 - till date Copyright:
//             <a className="text-dark" href="https://mdbootstrap.com/">
//               desphixs.com
//             </a>
//           </div>
//         </footer>
//       </>
//     </div>
//   )
// }

// export default RegisterPage


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
{/* 
      <footer className="login-footer">
        © 2025 - till date Copyright:
        <a className="text-dark ms-1" href="https://mdbootstrap.com/">desphixs.com</a>
      </footer> */}
    </div>
  );
}

export default RegisterPage;
