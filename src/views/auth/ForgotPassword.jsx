import { useState } from "react";
import apiInstante from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await apiInstante.get(`user/password-reset/${email}/`).then((res) => {
        alert("Te hemos enviado un correo electrónico");
        setIsLoading(false);
      });
    } catch (error) {
      alert("El correo electrónico no existe");
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
                    <h3 className="text-center">Recuperar contraseña</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <div>
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

                          <button
                            disabled={isLoading}
                            className="btn btn-primary w-100"
                            type="button"
                            onClick={handleSubmit}
                          >
                            <span className="mr-2">Enviar correo </span>
                            <i className="fas fa-paper-plane" />
                          </button>
                          <div className="text-center">
                            <p>
                              ¿No tienes cuenta?{" "}
                              <Link to={"/register"}>Crear cuenta</Link>
                            </p>
                          </div>
                        </div>
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

export default ForgotPassword;
