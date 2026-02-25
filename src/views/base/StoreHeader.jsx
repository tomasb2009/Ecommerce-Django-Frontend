import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useState, useContext } from "react";
import { CartContext } from "../plugins/Context";

function StoreHeader() {
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  const { cartCount = 0, setCartCount } = useContext(CartContext) ?? {};
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/?query=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Tienda Tomas
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                                    Pages
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">About Us</a></li>
                                    <li><a className="dropdown-item" href="#">Contact Us</a></li>
                                    <li><a className="dropdown-item" href="#">Blog </a></li>
                                    <li><a className="dropdown-item" href="#">Changelog</a></li>
                                    <li><a className="dropdown-item" href="#">Terms & Condition</a></li>
                                    <li><a className="dropdown-item" href="#">Cookie Policy</a></li>

                                </ul>
                            </li> */}

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownAccount"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Cuenta
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownAccount"
                >
                  <li>
                    <Link to={"/customer/account/"} className="dropdown-item">
                      <i className="fas fa-user"></i> Mi cuenta
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/orders/`}>
                      <i className="fas fa-shopping-cart"></i> Pedidos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/wishlist/`}>
                      <i className="fas fa-heart"></i> Favoritos
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/customer/notifications/`}
                    >
                      <i className="fas fa-bell fa-shake"></i> Notificaciones
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/settings/`}>
                      <i className="fas fa-gear fa-spin"></i> Configuración
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownVendor"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Vendedor
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownVendor"
                >
                  <li>
                    <Link className="dropdown-item" to="/vendor/dashboard/">
                      {" "}
                      <i className="fas fa-user"></i> Panel
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/products/">
                      {" "}
                      <i className="bi bi-grid-fill"></i> Productos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/product/new/">
                      {" "}
                      <i className="fas fa-plus-circle"></i> Agregar producto
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/orders/">
                      {" "}
                      <i className="fas fa-shopping-cart"></i> Pedidos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/earning/">
                      {" "}
                      <i className="fas fa-dollar-sign"></i> Ganancias
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/reviews/">
                      {" "}
                      <i className="fas fa-star"></i> Reseñas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/coupon/">
                      {" "}
                      <i className="fas fa-tag"></i> Cupones
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/notifications/">
                      {" "}
                      <i className="fas fa-bell fa-shake"></i> Notificaciones
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/settings/">
                      {" "}
                      <i className="fas fa-gear fa-spin"></i> Configuración
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <form
              className="d-flex me-2"
              onSubmit={handleSearchSubmit}
              role="search"
            >
              <input
                value={search}
                onChange={handleSearchChange}
                name="search"
                className="form-control me-2"
                type="search"
                placeholder="Buscar productos…"
                aria-label="Buscar"
              />
              <button className="btn btn-outline-success" type="submit">
                Buscar
              </button>
            </form>

            {isLoggedIn() ? (
              <>
                <Link className="btn btn-primary me-2" to="/dashboard">
                  Panel
                </Link>
                <Link className="btn btn-primary me-2" to="/logout">
                  Salir
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-primary me-2" to="/register">
                  Crear cuenta
                </Link>
                <Link className="btn btn-primary me-2" to="/login">
                  Ingresar
                </Link>
              </>
            )}
            <Link className="btn btn-danger" to="/cart/">
              <i className="fas fa-shopping-cart"></i>{" "}
              <span id="cart-total-items">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default StoreHeader;
