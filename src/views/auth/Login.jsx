import React, { useEffect, useState } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await login(email, password);
    if (error) {
      alert(error);
      setIsLoading(false);
    } else {
      navigate("/");
      resetForm();
    }
    setIsLoading(false);
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
                    <h3 className="text-center">Iniciar sesión</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleLogin}>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Correo electrónico
                            </label>
                            <input
                              type="email"
                              id="loginName"
                              name="username"
                              value={email}
                              className="form-control"
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="tucorreo@ejemplo.com"
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
                              name="password"
                              value={password}
                              className="form-control"
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Tu contraseña"
                            />
                          </div>

                          <button
                            disabled={isLoading}
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            <span className="mr-2">Ingresar </span>
                            <i className="fas fa-sign-in-alt" />
                          </button>

                          <div className="text-center">
                            <p className="mt-4">
                              ¿No tienes una cuenta?{" "}
                              <Link to="/register">Crear cuenta</Link>
                            </p>
                            <p className="mt-0">
                              <Link
                                to="/forgot-password/"
                                className="text-danger"
                              >
                                ¿Olvidaste tu contraseña?
                              </Link>
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

export default Login;
