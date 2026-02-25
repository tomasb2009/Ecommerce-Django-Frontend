import { Link, useSearchParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import apiInstante from "../../utils/axios";
import GetCurrentAddress from "../plugins/UserCountry";
import UserData from "../plugins/UserData";
import CartID from "../plugins/CartID";
import { CartContext } from "../plugins/Context";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function Search() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState({});

  const [selectedColors, setSelectedCololrs] = useState({});
  const [selectedSize, setSelectedSize] = useState({});

  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();
  const { setCartCount } = useContext(CartContext) ?? {};

  const handleColorButtonClick = (e, product_id, colorName) => {
    setColorValue(colorName);
    setSelectedProduct(product_id);

    setSelectedCololrs((prevSelectedColors) => ({
      ...prevSelectedColors,
      [product_id]: colorName,
    }));
  };
  const handleSizeButtonClick = (e, product_id, sizeName) => {
    setSizeValue(sizeName);
    setSelectedProduct(product_id);

    setSelectedSize((prevSelectedSize) => ({
      ...prevSelectedSize,
      [product_id]: sizeName,
    }));
  };

  const handleQtyChange = (e, product_id) => {
    setQtyValue(e.target.value);
    setSelectedProduct(product_id);
  };

  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") || "").trim();

  useEffect(() => {
    // Si no hay query, mostrar todos los productos publicados
    const fetch = async () => {
      try {
        if (!query) {
          const res = await apiInstante.get("products/");
          setProducts(Array.isArray(res.data) ? res.data : []);
        } else {
          const res = await apiInstante.get(`search/?query=${encodeURIComponent(query)}`);
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setProducts([]);
      }
    };

    fetch();
  }, [query]);

  const handleAddToCart = async (product_id, price, shipping_amount) => {
    if (!cart_id) return;
    try {
      const formdata = new FormData();
      formdata.append("product_id", product_id);
      formdata.append("user_id", userData?.user_id ?? "");
      formdata.append("qty", qtyValue);
      formdata.append("price", price);
      formdata.append("shipping_amount", shipping_amount);
      formdata.append("country", currentAddress.country);
      formdata.append("size", sizeValue);
      formdata.append("color", colorValue);
      formdata.append("cart_id", cart_id);

      await apiInstante.post("cart-view/", formdata);

      const url = userData?.user_id
        ? `cart-list/${cart_id}/${userData.user_id}/`
        : `cart-list/${cart_id}/`;
      const res = await apiInstante.get(url);
      const total = Array.isArray(res.data)
        ? res.data.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
        : 0;
      setCartCount?.(total);

      Toast.fire({
        icon: "success",
        title: "Added To Cart",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Could not add to cart",
      });
    }
  };
  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            <div className="row">
              {products.map((p, index) => (
                <div className="col-lg-4 col-md-12 mb-4">
                  <div className="card">
                    <div
                      className="bg-image hover-zoom ripple"
                      data-mdb-ripple-color="light"
                    >
                      <Link to={`/detail/${p.slug}`}>
                        <img
                          src={p.image}
                          className="w-100"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                      <Link to={`/detail/${p.slug}`}>
                        <div className="mask">
                          <div className="d-flex justify-content-start align-items-end h-100">
                            <h5>
                              <span className="badge badge-primary ms-2">
                                New
                              </span>
                            </h5>
                          </div>
                        </div>
                        <div className="hover-overlay">
                          <div
                            className="mask"
                            style={{
                              backgroundColor: "rgba(251, 251, 251, 0.15)",
                            }}
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="card-body">
                      <Link to={`/detail/${p.slug}`} className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
                      </Link>
                      <a href="" className="text-reset">
                        <p>{p.category?.title}</p>
                      </a>
                      <div className="d-flex justify-content-center">
                        <h6 className="mb-3">${p.price}</h6>
                        <h6 className="mb-3 text-muted ms-2">
                          <strike>${p.oldPrice}</strike>
                        </h6>
                      </div>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary dropdown-toggle"
                          type="button"
                          id="dropdownMenuClickable"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="false"
                          aria-expanded="false"
                        >
                          Variation
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuClickable"
                        >
                          <div className="d-flex flex-column">
                            <li className="p-1">
                              <b>Quantity</b>
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                              <li>
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) => handleQtyChange(e, p.id)}
                                />
                              </li>
                            </div>
                          </div>
                          {p.size?.length > 0 && (
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b>Size</b>:{" "}
                                {selectedSize[p.id] || "Select a size"}
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.size?.map((size, index) => (
                                  <li>
                                    <button
                                      onClick={(e) =>
                                        handleSizeButtonClick(
                                          e,
                                          p.id,
                                          size.name,
                                        )
                                      }
                                      className="btn btn-secondary btn-sm me-2 mb-1"
                                    >
                                      {size.name}
                                    </button>
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}

                          {p.color?.length > 0 && (
                            <div className="d-flex flex-column mt-3">
                              <li className="p-1">
                                <b>Color</b>:{" "}
                                {selectedColors[p.id] || "Select a color"}
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.color?.map((color, index) => (
                                  <li>
                                    <button
                                      className="btn btn-sm me-2 mb-1 p-3"
                                      style={{
                                        backgroundColor: color.color_code,
                                      }}
                                      onClick={(e) =>
                                        handleColorButtonClick(
                                          e,
                                          p.id,
                                          color.name,
                                        )
                                      }
                                    />
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="d-flex mt-3 p-1">
                            <button
                              type="button"
                              className="btn btn-primary me-1 mb-1"
                              onClick={() =>
                                handleAddToCart(
                                  p.id,
                                  p.price,
                                  p.shipping_amount,
                                )
                              }
                            >
                              <i className="fas fa-shopping-cart" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger px-3 me-1 mb-1 ms-2"
                            >
                              <i className="fas fa-heart" />
                            </button>
                          </div>
                        </ul>
                        <button
                          type="button"
                          className="btn btn-danger px-3 me-1 ms-2"
                        >
                          <i className="fas fa-heart" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="row">
                {category?.map((c, index) => (
                  <div className="col-lg-2">
                    <img
                      src="https://darrensaines.no/wp-content/uploads/2020/02/dummy-1.png"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt=""
                    />
                    <h6>{c.title}</h6>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  );
}

export default Search;
