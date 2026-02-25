import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import CartID from "../plugins/CartID";
import GetCurrentAddress from "../plugins/UserCountry";
import { CartContext } from "../plugins/Context";
import Swal from "sweetalert2";

function totalCartItems(cartList) {
  if (!Array.isArray(cartList)) return 0;
  return cartList.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function Cart() {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState({});
  const [productQuantities, setProductQuantities] = useState({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const userData = UserData();
  const cart_id = CartID();
  const currentAddress = GetCurrentAddress();
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartContext) ?? {};

  const fetchCartData = (cartId, userId) => {
    const url = userId
      ? `cart-list/${cartId}/${userId}/`
      : `cart-list/${cartId}/`;
    apiInstance.get(url).then((res) => {
      setCart(res.data);
      setCartCount?.(totalCartItems(res.data));
    });
  };
  const fetchCartTotal = (cartId, userId) => {
    const url = userId
      ? `cart-detail/${cartId}/${userId}/`
      : `cart-detail/${cartId}/`;
    apiInstance.get(url).then((res) => {
      setCartTotal(res.data);
    });
  };

  if (cart_id !== null || cart_id !== undefined) {
    if (userData !== undefined) {
      useEffect(() => {
        fetchCartData(cart_id, userData?.user_id);
        fetchCartTotal(cart_id, userData?.user_id);
      }, []);
    } else {
      useEffect(() => {
        fetchCartData(cart_id, null);
        fetchCartTotal(cart_id, null);
      }, []);
    }
  }

  useEffect(() => {
    const initialQuantities = {};
    cart.forEach((c) => {
      initialQuantities[c.product?.id] = c.qty;
    });
    setProductQuantities(initialQuantities);
  }, [cart]);

  const handleQtyChange = (e, product_id) => {
    const quantity = e.target.value;
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product_id]: quantity,
    }));
  };

  const updateCart = async (
    product_id,
    price,
    shipping_amount,
    color,
    size,
    qty,
  ) => {
    const qtyValue = qty ?? productQuantities[product_id] ?? 1;

    const formdata = new FormData();
    formdata.append("product_id", product_id);
    formdata.append("user_id", userData?.user_id ?? "");
    formdata.append("qty", qtyValue);
    formdata.append("price", price);
    formdata.append("shipping_amount", shipping_amount);
    formdata.append("country", currentAddress?.country || "");
    formdata.append("size", size);
    formdata.append("color", color);
    formdata.append("cart_id", cart_id);

    const response = await apiInstance.post("cart-view/", formdata);
    const responseData = response?.data;
    console.log("Cart update response:", responseData);

    await Promise.all([
      apiInstance
        .get(
          userData?.user_id
            ? `cart-list/${cart_id}/${userData?.user_id}/`
            : `cart-list/${cart_id}/`,
        )
        .then((res) => {
          setCart(res.data);
          setCartCount?.(totalCartItems(res.data));
        }),
      apiInstance
        .get(
          userData?.user_id
            ? `cart-detail/${cart_id}/${userData?.user_id}/`
            : `cart-detail/${cart_id}/`,
        )
        .then((res) => setCartTotal(res.data)),
    ]);

    Toast.fire({
      icon: "success",
      title: responseData?.message || "Carrito actualizado",
    });
  };

  const handleDeleteCartItem = async (itemId) => {
    const url = userData?.user_id
      ? `cart-delete/${cart_id}/${itemId}/${userData?.user_id}`
      : `cart-delete/${cart_id}/${itemId}/`;

    try {
      await apiInstance.delete(url);
      fetchCartData(cart_id, userData?.user_id);
      fetchCartTotal(cart_id, userData?.user_id);
      Toast.fire({
        icon: "success",
        title: "Artículo eliminado del carrito",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "country":
        setCountry(value);
        break;

      default:
        break;
    }
  };

  const createOrder = async () => {
    if (
      !fullName ||
      !email ||
      !mobile ||
      !address ||
      !city ||
      !state ||
      !country
    ) {
      Toast.fire({
        icon: "error",
        title: "Faltan campos",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("full_name", fullName);
      formdata.append("email", email);
      formdata.append("mobile", mobile);
      formdata.append("address", address);
      formdata.append("city", city);
      formdata.append("state", state);
      formdata.append("country", country);
      formdata.append("cart_id", cart_id);
      formdata.append("user_id", userData ? userData?.user_id : 0);

      const response = await apiInstance.post("create-order/", formdata);

      navigate(`/checkout/${response.data.order_oid}/`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          <main className="mb-6">
            <div className="container">
              <section className="">
                <div className="row gx-lg-5 mb-5">
                  <div className="col-lg-8 mb-4 mb-md-0">
                    <section className="mb-5">
                      {cart?.map((c) => (
                        <div className="row border-bottom mb-4" key={c.id}>
                          <div className="col-md-2 mb-4 mb-md-0">
                            <div
                              className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                              data-ripple-color="light"
                            >
                              <Link to="">
                                <img
                                  src={c.product?.image}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                              </Link>
                              <a href="#!">
                                <div className="hover-overlay">
                                  <div
                                    className="mask"
                                    style={{
                                      backgroundColor:
                                        "hsla(0, 0%, 98.4%, 0.2)",
                                    }}
                                  />
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="col-md-8 mb-4 mb-md-0">
                            <Link to={null} className="fw-bold text-dark mb-4">
                              {c.product.title}
                            </Link>

                            {c.size !== "No Size" && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Talla:</span>
                                <span>{c.size}</span>
                              </p>
                            )}
                            {c.color !== "No Color" && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Color:</span>
                                <span>{c.color}</span>
                              </p>
                            )}
                            <p className="mb-0">
                              <span className="text-muted me-2">Precio:</span>
                              <span>{c.price}</span>
                            </p>

                            <p className="mb-0">
                              <span className="text-muted me-2">Vendedor:</span>
                              <span>{c.product?.vendor.name}</span>
                            </p>
                            <p className="mt-3">
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteCartItem(c.id)}
                              >
                                <small>
                                  <i className="fas fa-trash me-2" />
                                  Eliminar
                                </small>
                              </button>
                            </p>
                          </div>
                          <div className="col-md-2 mb-4 mb-md-0">
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="form-outline">
                                <input
                                  onChange={(e) =>
                                    handleQtyChange(e, c.product.id)
                                  }
                                  type="number"
                                  className="form-control"
                                  value={
                                    productQuantities[c.product?.id] ?? c.qty
                                  }
                                  min={1}
                                />
                              </div>
                              <button
                                className="ms-2 btn btn-primary"
                                onClick={() =>
                                  updateCart(
                                    c.product.id,
                                    c.product.price,
                                    c.product?.shipping_amount ?? 0,
                                    c.color,
                                    c.size,
                                    productQuantities[c.product?.id] ?? c.qty,
                                  )
                                }
                              >
                                <i className="fas fa-rotate-right"></i>
                              </button>
                            </div>
                            <h5 className="mb-2 mt-3 text-center">
                              <span className="align-middle">
                                {c.sub_total}
                              </span>
                            </h5>
                          </div>
                        </div>
                      ))}
                      {cart?.length <= 0 && (
                        <>
                          <h5>Tu carrito está vacío</h5>
                          <Link to="/">
                            {" "}
                            <i className="fas fa-shopping-cart"></i> Seguir
                            comprando
                          </Link>
                        </>
                      )}
                    </section>

                    {cart?.length > 0 && (
                      <div>
                        <h5 className="mb-4 mt-4">Información personal</h5>

                        {/* 2 column grid layout with text inputs for the first and last names */}
                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="full_name">
                                {" "}
                                <i className="fas fa-user"></i> Nombre completo
                              </label>
                              <input
                                onChange={handleChange}
                                type="text"
                                id=""
                                name="fullName"
                                className="form-control"
                                value={fullName}
                                placeholder="Tu nombre y apellido"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                <i className="fas fa-envelope"></i> Correo electrónico
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="email"
                                onChange={handleChange}
                                value={email}
                                placeholder="tucorreo@ejemplo.com"
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                <i className="fas fa-phone"></i> Teléfono
                              </label>
                              <input
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="mobile"
                                onChange={handleChange}
                                value={mobile}
                                placeholder="Tu número de teléfono"
                              />
                            </div>
                          </div>
                        </div>

                        <h5 className="mb-1 mt-4">Dirección de envío</h5>

                        <div className="row mb-4">
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {" "}
                                Dirección
                              </label>
                              <input
                                onChange={handleChange}
                                value={address}
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="address"
                                placeholder="Calle y número"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {" "}
                                Ciudad
                              </label>
                              <input
                                onChange={handleChange}
                                value={city}
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="city"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {" "}
                                Estado/Provincia
                              </label>
                              <input
                                onChange={handleChange}
                                value={state}
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="state"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="form6Example1"
                              >
                                {" "}
                                País
                              </label>
                              <input
                                onChange={handleChange}
                                value={country}
                                type="text"
                                id="form6Example1"
                                className="form-control"
                                name="country"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-4 mb-4 mb-md-0">
                    {/* Section: Summary */}
                    {cart.length > 0 && (
                      <section className="shadow-4 p-4 rounded-5 mb-4">
                        <h5 className="mb-3">Resumen del carrito</h5>
                        <div className="d-flex justify-content-between mb-3">
                          <span>Subtotal </span>
                          <span>{cartTotal.sub_total?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Envío </span>
                          <span>{cartTotal.shipping?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Impuestos </span>
                          <span>{cartTotal.tax?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Tarifa de servicio </span>
                          <span>{cartTotal.service_fee?.toFixed(2)}</span>
                        </div>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between fw-bold mb-5">
                          <span>Total </span>
                          <span>{cartTotal.total?.toFixed(2)}</span>
                        </div>
                        <button
                          className="btn btn-primary btn-rounded w-100"
                          onClick={createOrder}
                        >
                          Ir a pagar
                        </button>
                      </section>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}

export default Cart;
