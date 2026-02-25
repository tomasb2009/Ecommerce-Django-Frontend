import React, { useState, useEffect } from "react";
import { register } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(
      fullname,
      email,
      mobile,
      password,
      password2,
    );

    if (error) {
      alert(JSON.stringify(error));
      setIsLoading(false);
    } else {
      navigate("/");
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Crear cuenta</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleSubmit}>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Nombre completo
                            </label>
                            <input
                              type="text"
                              id="username"
                              placeholder="Tu nombre y apellido"
                              required
                              className="form-control"
                              value={fullname}
                              onChange={(e) => setFullname(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginName"
                            >
                              Correo electrónico
                            </label>
                            <input
                              type="email"
                              id="email"
                              placeholder="tucorreo@ejemplo.com"
                              required
                              className="form-control"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
                              Teléfono
                            </label>
                            <input
                              type="number"
                              id="phone"
                              placeholder="Tu número de teléfono"
                              required
                              className="form-control"
                              onChange={(e) => setMobile(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Contraseña
                            </label>
                            <input
                              type="password"
                              id="password"
                              placeholder="Crea una contraseña segura"
                              className="form-control"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          {/* Password input */}
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Confirmar contraseña
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              placeholder="Repite la contraseña"
                              required
                              className="form-control"
                              onChange={(e) => setPassword2(e.target.value)}
                            />
                          </div>
                          {/* Password Check */}
                          {/* <p className='fw-bold text-danger'>
                                                    {password2 !== password ? 'Passwords do not match' : ''}
                                                </p> */}

                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            <span className="mr-2">Crear cuenta</span>
                            <i className="fas fa-user-plus" />
                          </button>

                          <div className="text-center">
                            <p className="mt-4">
                              ¿Ya tienes una cuenta?{" "}
                              <Link to="/login/">Iniciar sesión</Link>
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Register;
