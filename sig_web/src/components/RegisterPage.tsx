import { useState, useContext, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import deskImage from '../assets/images/desk.jpg';

function RegisterPage() {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (authContext?.registerUser) {
      authContext.registerUser(email, firstname, lastname, password, password2)
    }
  }

  return (
    <div>
      <>
        <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-10">
                <div className="card" style={{ borderRadius: "1rem" }}>
                  <div className="row g-0">
                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={deskImage}
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                    </div>
                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        <form onSubmit={handleSubmit}>
                          <div className="d-flex align-items-center mb-3 pb-1">
                            <i
                              className="fas fa-cubes fa-2x me-3"
                              style={{ color: "#ff6219" }}
                            />
                            <span className="h2 fw-bold mb-0">
                              Welcome to <b>Desphixs👋</b>
                            </span>
                          </div>
                          <h5
                            className="fw-normal mb-3 pb-3"
                            style={{ letterSpacing: 1 }}
                          >
                            Sign Up
                          </h5>
                          <div className="form-outline mb-4">
                            <input
                              type="email"
                              className="form-control form-control-lg"
                              placeholder="Email Address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              placeholder="Firstname"
                              value={firstname}
                              onChange={(e) => setFirstname(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              placeholder="Lastname"
                              value={lastname}
                              onChange={(e) => setLastname(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <input
                              type="password"
                              className="form-control form-control-lg"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <input
                              type="password"
                              className="form-control form-control-lg"
                              placeholder="Confirm Password"
                              value={password2}
                              onChange={(e) => setPassword2(e.target.value)}
                            />
                          </div>
                          <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                            >
                              Register
                            </button>
                          </div>
                          <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: "#393f81" }}>
                              Login Now
                            </Link>
                          </p>
                          <a href="#!" className="small text-muted">
                            Terms of use.
                          </a>
                          <a href="#!" className="small text-muted">
                            Privacy policy
                          </a>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-light text-center text-lg-start">
          <div
            className="text-center p-3"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2025 - till date Copyright:
            <a className="text-dark" href="https://mdbootstrap.com/">
              desphixs.com
            </a>
          </div>
        </footer>
      </>
    </div>
  )
}

export default RegisterPage
