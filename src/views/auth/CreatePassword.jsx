import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import apiInstante from "../../utils/axios";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParam] = useSearchParams();

  const otp = searchParam.get("otp");
  const uidb64 = searchParam.get("uidb64");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("password", password);
      formdata.append("otp", otp);
      formdata.append("uidb64", uidb64);

      try {
        await apiInstante
          .post(`user/password-change/`, formdata)
          .then((res) => {
            console.log(res.data);
            alert("Contraseña cambiada correctamente");
            navigate("/login");
            setIsLoading(false);
          });
      } catch (error) {
        alert("Ocurrió un error al intentar cambiar la contraseña");
        setIsLoading(false);
      }
    }
  };
  return (
    <main style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        {/* Section: Login form */}
        <section>
          <div className="row d-flex justify-content-center">
            <div className="col-xl-5 col-md-8">
              <div className="card rounded-5">
                <div className="card-body p-4">
                  <form onSubmit={handlePasswordSubmit}>
                    {/* Password */}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={password}
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password2">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        name="password2"
                        value={confirmPassword}
                        className="form-control"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite la nueva contraseña"
                      />
                    </div>

                    <button
                      disabled={isLoading}
                      className="btn btn-primary w-100"
                      type="submit"
                    >
                      <span className="mr-2">Guardar contraseña</span>
                      <i className="fas fa-paper-plane" />
                    </button>

                    <div className="text-center mt-3">
                      <p>
                        ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CreatePassword;
